'use server'

import { GoogleGenerativeAI } from '@google/generative-ai'

import type { LectureDetail } from '@/features/lecture/api/lectureApi.types'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

export async function generateGeminiSummary(lectureData: LectureDetail) {
  if (!process.env.GEMINI_API_KEY) {
    console.warn('GEMINI_API_KEY is missing')
    return 'API 키가 설정되지 않아 AI 요약을 생성할 수 없습니다. (GEMINI_API_KEY 확인 필요)'
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite-preview-09-2025' })

    const prompt = `
      다음 강의 정보를 바탕으로 예비 수강생에게 이 강의의 핵심 정보를 전달하는 3줄 요약을 작성해줘.
      **반드시** 아래의 형식을 정확히 따라서 작성해야 해. 괄호 [] 부분은 강의 정보를 바탕으로 채워줘.
      
      형식:
      [위치]에서 [온/오프라인, 시간]으로 진행되는
      [국비지원유형] [카테고리] 과정입니다.
      주요 서비스로 [주요서비스] 등을 제공하며, 선발절차에 코딩테스트는 [유/무].

      예시:
      [KR 서울]에서 [오프라인, 풀타임]으로 진행되는
      [내일배움카드(KDT)] [웹 풀스택] 과정입니다.
      주요 서비스로 [이력서첨삭, 모의면접] 등을 제공하며, 선발절차에 코딩테스트는 [없습니다].

      [강의 정보]
      제목: ${lectureData.title}
      기관: ${lectureData.orgName}
      카테고리: ${lectureData.categoryName}
      위치: ${lectureData.location} (${lectureData.lectureLoc})
      교육시간: ${lectureData.schedule.time} (${lectureData.schedule.totalHours}시간)
      교육기간: ${lectureData.schedule.coursePeriod.start} ~ ${lectureData.schedule.coursePeriod.end}
      국비지원 여부: ${lectureData.recruitType === 'CARD_REQUIRED' ? '내일배움카드 필요(KDT)' : '내일배움카드 필요 X'}
      선발 절차: ${lectureData.steps && lectureData.steps.length > 0 ? lectureData.steps.join(', ') : '없음'}
      
      [핵심 내용]
      목표: ${lectureData.goal}
      커리큘럼 요약: ${lectureData.curriculum.map(c => c.name).join(', ')}
      
      [교육 환경 및 혜택]
      모집 정원: ${lectureData.maxCapacity}명
      지원금/수당: ${lectureData.support.stipend ?? '정보 없음'}, ${lectureData.support.extraSupport ?? '정보 없음'}
      장비 지원: ${lectureData.equipment.pc} (${lectureData.equipment.merit})
      취업 지원 서비스: ${[
        lectureData.services.books ? '교재제공' : '',
        lectureData.services.resume ? '이력서첨삭' : '',
        lectureData.services.mockInterview ? '모의면접' : '',
        lectureData.services.employmentHelp ? '취업지원' : '',
        lectureData.services.afterCompletion ? '사후관리' : '',
      ]
        .filter(Boolean)
        .join(', ')}
      
      [기타]
      지원 자격: ${lectureData.quals.map(q => q.text).join(', ')}
      채용 혜택: ${lectureData.benefits.length > 0 ? lectureData.benefits.join(', ') : '없음'}
    `

    const result = await model.generateContent(prompt)
    const response = await result.response
    return response.text()
  } catch (error) {
    console.error('Gemini API Error:', error)
    return 'AI 요약 서비스를 일시적으로 사용할 수 없습니다.'
  }
}

/**
 * AI 비교 분석 결과에서 사용되는 섹션 키 타입
 * COMPARE_SECTIONS의 key 값과 일치해야 함
 */
export type CompareSectionKey =
  | 'education'
  | 'cost'
  | 'benefits'
  | 'goal'
  | 'quals'
  | 'equipment'
  | 'project'
  | 'job'
  | 'steps'
  | 'curriculum'

/**
 * AI 비교 분석 결과 - 섹션별 코멘트
 */
export interface SectionComment {
  sectionKey: CompareSectionKey
  comment: string
  advantage: 'left' | 'right' | 'equal'
}

/**
 * AI 비교 분석 결과 - 최종 추천
 */
export interface FinalRecommendation {
  recommended: 'left' | 'right'
  reason: string
  summary: string
}

/**
 * AI 비교 분석 전체 결과
 */
export interface ComparisonResult {
  sectionComments: SectionComment[]
  finalRecommendation: FinalRecommendation
}

/**
 * 사용자 설문조사 정보 타입 (서버에서 받아온 데이터)
 */
export interface UserSurvey {
  major: string | null
  bootcampCompleted: boolean | null
  wantedJobs: string | null
  licenses: string | null
  hasGovCard: boolean | null
  affordableAmount: number | null
  exists: boolean
  userLocation: string | null // 사용자 거주지 주소
}

/**
 * Gemini AI를 활용하여 두 강의를 사용자 맞춤 비교 분석
 */
export async function compareCoursesWithAI(
  leftLecture: LectureDetail,
  rightLecture: LectureDetail,
  userSurvey: UserSurvey,
): Promise<ComparisonResult> {
  if (!process.env.GEMINI_API_KEY) {
    console.warn('GEMINI_API_KEY is missing')
    throw new Error('API 키가 설정되지 않아 AI 분석을 수행할 수 없습니다.')
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite-preview-09-2025' })

    const formatLecture = (lecture: LectureDetail, label: string) => `
      [${label} 강의 정보]
      제목: ${lecture.title}
      기관: ${lecture.orgName}
      카테고리: ${lecture.categoryName}
      위치: ${lecture.location} (${lecture.lectureLoc === 'ONLINE' ? '온라인' : lecture.lectureLoc === 'OFFLINE' ? '오프라인' : '온/오프 병행'})
      교육기간: ${lecture.schedule?.coursePeriod?.start ?? '미정'} ~ ${lecture.schedule?.coursePeriod?.end ?? '미정'}
      교육시간: ${lecture.schedule?.time ?? '미정'}
      총 교육시간: ${lecture.schedule?.totalHours ?? 0}시간
      모집유형: ${lecture.recruitType === 'CARD_REQUIRED' ? '내일배움카드 필요' : lecture.recruitType === 'KDT' ? 'KDT(우수형)' : '일반'}
      자기부담금: ${lecture.support?.tuition ? lecture.support.tuition.toLocaleString() + '원' : '정보 없음'}
      훈련장려금: ${lecture.support?.stipend ?? '정보 없음'}
      훈련비 지원: ${lecture.support?.extraSupport ?? '정보 없음'}
      훈련목표: ${lecture.goal ?? '정보 없음'}
      모집정원: ${lecture.maxCapacity ?? '정보 없음'}명
      장비: ${lecture.equipment?.pc ?? '정보 없음'}
      교재지원: ${lecture.services?.books ? '있음' : '없음'}
      이력서첨삭: ${lecture.services?.resume ? '있음' : '없음'}
      모의면접: ${lecture.services?.mockInterview ? '있음' : '없음'}
      취업지원: ${lecture.services?.employmentHelp ? '있음' : '없음'}
      프로젝트 수: ${lecture.project?.num ?? 0}회
      커리큘럼: ${lecture.curriculum?.map(c => `${c.name}(${c.level === 'BASIC' ? '기본' : c.level === 'ADVANCED' ? '심화' : (c.level ?? '')})`).join(', ') || '정보 없음'}
      선발절차: ${lecture.steps?.join(', ') || '정보 없음'}
      지원자격: ${lecture.quals?.map(q => `[${q.type}] ${q.text}`).join(', ') || '정보 없음'}
    `

    const prompt = `
      너는 부트캠프/교육과정 선택을 도와주는 전문 AI 상담사야.
      아래 사용자 정보와 두 강의 정보를 바탕으로, 사용자에게 어떤 강의가 더 적합한지 비교 분석해줘.

      [사용자 정보]
      거주지: ${userSurvey.userLocation ?? '정보 없음'}
      전공: ${userSurvey.major ?? '정보 없음'}
      부트캠프 수료 경험: ${userSurvey.bootcampCompleted === null ? '정보 없음' : userSurvey.bootcampCompleted ? '있음' : '없음'}
      희망 직무: ${userSurvey.wantedJobs ?? '정보 없음'}
      보유 자격증: ${userSurvey.licenses ?? '정보 없음'}
      내일배움카드 보유: ${userSurvey.hasGovCard === null ? '정보 없음' : userSurvey.hasGovCard ? '보유' : '미보유'}
      수강 가능 금액: ${userSurvey.affordableAmount ? userSurvey.affordableAmount.toLocaleString() + '원' : '정보 없음'}

      ${formatLecture(leftLecture, 'A (왼쪽)')}

      ${formatLecture(rightLecture, 'B (오른쪽)')}

      다음 JSON 형식으로만 응답해줘 (다른 텍스트 없이 순수 JSON만):
      {
        "sectionComments": [
          {"sectionKey": "education", "comment": "교육기간, 시간, 장소에 대한 비교 코멘트 (1-2문장)", "advantage": "left" 또는 "right" 또는 "equal"},
          {"sectionKey": "cost", "comment": "비용, 지원금에 대한 비교 코멘트 (1-2문장)", "advantage": "left" 또는 "right" 또는 "equal"},
          {"sectionKey": "benefits", "comment": "추가 제공 항목(주거비, 훈련수당 등) 비교 코멘트 (1-2문장)", "advantage": "left" 또는 "right" 또는 "equal"},
          {"sectionKey": "goal", "comment": "훈련목표 비교 코멘트 (1-2문장)", "advantage": "left" 또는 "right" 또는 "equal"},
          {"sectionKey": "quals", "comment": "지원자격 비교 코멘트 (1-2문장)", "advantage": "left" 또는 "right" 또는 "equal"},
          {"sectionKey": "steps", "comment": "선발절차 비교 코멘트 (1-2문장)", "advantage": "left" 또는 "right" 또는 "equal"},
          {"sectionKey": "equipment", "comment": "시설 및 장비 비교 코멘트 (1-2문장)", "advantage": "left" 또는 "right" 또는 "equal"},
          {"sectionKey": "project", "comment": "프로젝트 비교 코멘트 (1-2문장)", "advantage": "left" 또는 "right" 또는 "equal"},
          {"sectionKey": "job", "comment": "취업지원 서비스 비교 코멘트 (1-2문장)", "advantage": "left" 또는 "right" 또는 "equal"},
          {"sectionKey": "curriculum", "comment": "커리큘럼 비교 코멘트 (1-2문장)", "advantage": "left" 또는 "right" 또는 "equal"}
        ],
        "finalRecommendation": {
          "recommended": "left" 또는 "right",
          "reason": "최종 추천 이유 (2-3문장)",
          "summary": "사용자에게 전하는 한 줄 추천 메시지"
        }
      }

      주의사항:
      - 사용자의 희망 직무, 예산, 내일배움카드 보유 여부를 중요하게 고려해줘
      - 비용 대비 효과, 커리큘럼 적합성, 취업 지원 서비스를 종합적으로 평가해줘
      - 코멘트는 친근하고 이해하기 쉬운 한국어로 작성해줘
      - JSON만 출력하고 다른 텍스트는 출력하지 마
    `

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: 'application/json',
      },
    })
    const response = await result.response
    const text = response.text()

    // console.log('Gemini Raw Response:', text) // 디버깅용 로그

    // JSON 파싱 개선: 첫 번째 { 부터 마지막 } 까지 추출
    const firstOpenBrace = text.indexOf('{')
    const lastCloseBrace = text.lastIndexOf('}')

    let jsonStr = text
    if (firstOpenBrace !== -1 && lastCloseBrace !== -1) {
      jsonStr = text.substring(firstOpenBrace, lastCloseBrace + 1)
    }

    try {
      const parsed = JSON.parse(jsonStr) as ComparisonResult
      return parsed
    } catch (parseError) {
      console.error('JSON Parse Error. Raw Text:', text)
      throw new Error('AI 응답을 분석할 수 없습니다.')
    }
  } catch (error) {
    console.error('Gemini API Comparison Error:', error)
    throw new Error('AI 비교 분석 중 오류가 발생했습니다.')
  }
}
