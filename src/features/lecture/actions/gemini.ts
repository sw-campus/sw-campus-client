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
    const model = genAI.getGenerativeModel({ model: 'gemini-3-pro-preview' })

    const prompt = `
      다음 강의 정보를 바탕으로 예비 수강생에게 이 강의의 핵심 정보를 전달하는 3줄 요약을 작성해줘.
      **반드시** 아래의 형식을 정확히 따라서 작성해야 해. 괄호 [] 부분은 강의 정보를 바탕으로 채워줘.
      
      형식:
      [위치]에서 [온/오프라인, 시간]으로 진행되는
      [국비지원유형] [카테고리] [과정유형] 입니다.
      채용 관련 [주요혜택] 혜택이 있으며, 선발절차에 코딩테스트는 [유/무].

      예시:
      [KR 서울]에서 [오프라인, 풀타임]으로 진행되는
      [내일배움카드(KDT)] [웹 풀스택] [부트캠프] 입니다.
      채용 관련 [인재추천] 혜택이 있으며, 선발절차에 코딩테스트는 [없습니다].

      [강의 정보]
      제목: ${lectureData.title}
      기관: ${lectureData.orgName}
      카테고리: ${lectureData.categoryName}
      위치: ${lectureData.location} (${lectureData.lectureLoc})
      모집 유형: ${lectureData.tags.join(', ')}
      국비지원 여부: ${lectureData.recruitType === 'CARD_REQUIRED' ? '내일배움카드 필요(KDT)' : '일반'}
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
        lectureData.services.employmentHelp ? '취업연계' : '',
        lectureData.services.afterCompletion ? '사후관리' : '',
      ]
        .filter(Boolean)
        .join(', ')}
      
      [기타]
      지원 자격: ${lectureData.quals.map(q => q.text).join(', ')}
      채용 혜택: ${lectureData.benefits.join(', ')}
    `

    const result = await model.generateContent(prompt)
    const response = await result.response
    return response.text()
  } catch (error) {
    console.error('Gemini API Error:', error)
    return 'AI 요약 서비스를 일시적으로 사용할 수 없습니다.'
  }
}
