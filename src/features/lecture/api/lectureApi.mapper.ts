import { ApiLectureDetail, LectureDetail } from './lectureApi.types'

/**
 *   API 응답 → 프론트 타입 변환 함수
 * - 백엔드 구조와 UI 구조를 분리하기 위한 매핑 레이어
 * - API 변경 시 이 함수만 수정하면 됨
 */
export function mapApiLectureDetailToLectureDetail(api: ApiLectureDetail): LectureDetail {
  return {
    id: String(api.lectureId),
    orgId: api.orgId,
    title: api.lectureName,
    orgName: api.orgName,
    tags: [api.categoryName, api.recruitType].filter(Boolean),
    lectureLoc: api.lectureLoc,
    categoryName: api.categoryName,
    thumbnailUrl: api.lectureImageUrl,
    url: api.url,
    recruitType: api.recruitType,
    summary: generateSummary(api),
    schedule: {
      recruitPeriod: formatDate(api.deadline ?? api.startAt),
      coursePeriod: { start: formatDate(api.startAt), end: formatDate(api.endAt) },
      days: sortDays(api.days)
        .map(day => dayKor(day))
        .join(', '),
      time: `${api.startTime.slice(0, 5)} - ${api.endTime.slice(0, 5)}`,
      totalHours: api.totalTimes,
      totalDays: api.totalDays,
    },
    support: {
      tuition: api.lectureFee,
      stipend: api.subsidy ? `${api.subsidy.toLocaleString()}원` : undefined,
      extraSupport: api.eduSubsidy ? `${api.eduSubsidy.toLocaleString()}원` : undefined,
    },
    location: api.location,
    recruitStatus: api.status === 'RECRUITING' ? 'RECRUITING' : 'FINISHED',
    photos: api.orgFacilityImageUrls ?? [],
    steps: api.steps ? api.steps.sort((a, b) => a.stepOrder - b.stepOrder).map(s => stepTypeKor(s.stepType)) : [],
    benefits: api.adds ? api.adds.map(a => a.addName) : [],

    // Expanded fields mapping
    goal: api.goal,
    maxCapacity: api.maxCapacity,
    equipment: {
      pc: api.equipPc,
      merit: api.equipMerit,
    },
    services: {
      books: api.books,
      resume: api.resume,
      mockInterview: api.mockInterview,
      employmentHelp: api.employmentHelp,
      afterCompletion: api.afterCompletion,
    },
    project: {
      num: api.projectNum,
      time: api.projectTime,
      team: api.projectTeam,
      tool: api.projectTool,
      mentor: api.projectMentor,
    },
    curriculum: api.curriculums
      ? api.curriculums.map(c => ({
          level: c.level,
          name: c.curriculum?.curriculumName || c.curriculumName || '',
        }))
      : [],
    teachers: Array.isArray(api.teachers)
      ? api.teachers
          .map(t => {
            if (typeof t === 'string') {
              return { name: t, desc: '', imageUrl: undefined }
            }
            const teacher = (t as any)?.teacher ?? t
            const name = teacher?.teacherName ?? teacher?.name ?? (t as any)?.teacherName ?? (t as any)?.name ?? ''
            const desc =
              teacher?.teacherDescription ??
              teacher?.teacherDesc ??
              teacher?.desc ??
              (t as any)?.teacherDescription ??
              (t as any)?.teacherDesc ??
              (t as any)?.desc ??
              ''
            const imageUrl =
              teacher?.teacherImageUrl ??
              teacher?.imageUrl ??
              (t as any)?.teacherImageUrl ??
              (t as any)?.imageUrl ??
              undefined
            return { name, desc, imageUrl }
          })
          .filter(t => Boolean(t.name))
      : [],
    quals: api.quals ? api.quals.map(q => ({ type: q.type, text: q.text })) : [],
  }
}

function generateSummary(api: ApiLectureDetail): string {
  const parts = []

  // Location & Type
  const loc = api.lectureLoc === 'OFFLINE' ? '오프라인에서 진행되는' : '온라인으로 진행되는'
  const type = api.recruitType === 'CARD_REQUIRED' || api.recruitType === 'KDT' ? 'KDT(우수형)' : '국비지원'
  parts.push(`${loc} ${type} ${api.categoryName} 부트캠프입니다.`)

  // Goal
  if (api.goal) {
    parts.push(`\n${api.goal}`)
  }

  // Target/Pre-req (Simulated based on common patterns or fields)
  if (api.quals && api.quals.length > 0) {
    const required = api.quals
      .filter(q => q.type === 'REQUIRED')
      .map(q => q.text)
      .join(', ')
    if (required) {
      parts.push(`\n주요 지원 자격: ${required}`)
    }
  }

  return parts.join('')
}

function stepTypeKor(type: string): string {
  const map: Record<string, string> = {
    DOCUMENT: '서류심사',
    INTERVIEW: '면접',
    CODING_TEST: '코딩테스트',
    PRE_TASK: '사전과제',
  }
  return map[type] ?? type
}

/**
 *   요일 영문(enum) → 한글 변환 함수
 */
const DAY_KOR_MAP: Record<string, string> = {
  MONDAY: '월',
  TUESDAY: '화',
  WEDNESDAY: '수',
  THURSDAY: '목',
  FRIDAY: '금',
  SATURDAY: '토',
  SUNDAY: '일',
}

export function dayKor(day: string): string {
  return DAY_KOR_MAP[day] ?? day
}

function formatDate(isoString: string): string {
  if (!isoString) return ''
  return isoString.split('T')[0]
}

function sortDays(days: string[]): string[] {
  const order = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY']
  return days.sort((a, b) => order.indexOf(a) - order.indexOf(b))
}
