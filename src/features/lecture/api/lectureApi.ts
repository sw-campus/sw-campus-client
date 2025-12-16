import { api } from '@/lib/axios'

/**
 *   백엔드 API 응답 타입
 * - 서버에서 내려주는 강의 상세 데이터 구조
 * - 실제 응답은 더 많은 필드를 가질 수 있으며,
 *   프론트에서 사용하는 필드만 선별해서 정의
 */
export interface ApiLectureDetail {
  lectureId: number
  orgId: number
  orgName: string
  lectureName: string
  days: string[]
  startTime: string
  endTime: string
  lectureLoc: string
  location: string
  recruitType: string
  subsidy: number
  lectureFee: number
  eduSubsidy: number
  goal: string
  maxCapacity: number
  equipPc: string
  equipMerit: string
  books: boolean
  resume: boolean
  mockInterview: boolean
  employmentHelp: boolean
  afterCompletion: boolean
  url: string
  lectureImageUrl: string
  status: string
  lectureAuthStatus: string
  projectNum: number
  projectTime: number
  projectTeam: string
  projectTool: string
  projectMentor: boolean
  startAt: string
  endAt: string
  deadline: string
  totalDays: number
  totalTimes: number
  steps: any[]
  adds: any[]
  quals: any[]
  teachers: any[]
  categoryName: string
  curriculums: any[]
  orgLogoUrl: string
  orgFacilityImageUrls: string[]
  averageScore: number
}

/**
 *   프론트엔드에서 실제 사용하는 강의 상세 타입
 * - UI 렌더링에 맞게 구조 단순화
 * - LectureDetailPage.tsx 에서 사용
 */
export type LectureDetail = {
  id: string
  title: string
  orgName: string
  tags: string[]
  thumbnailUrl?: string
  summary: string
  schedule: {
    recruitPeriod: { start: string; end: string }
    coursePeriod: { start: string; end: string }
    days: string
    time: string
    totalHours: number
  }
  support: {
    tuition?: number
    stipend?: string
    extraSupport?: string
  }
  location: string
  recruitStatus: 'OPEN' | 'CLOSED' | 'DRAFT'
  photos: string[]
}

/**
 *   API 응답 → 프론트 타입 변환 함수
 * - 백엔드 구조와 UI 구조를 분리하기 위한 매핑 레이어
 * - API 변경 시 이 함수만 수정하면 됨
 */
export function mapApiLectureDetailToLectureDetail(api: ApiLectureDetail): LectureDetail {
  return {
    id: String(api.lectureId),
    title: api.lectureName,
    orgName: api.orgName,
    tags: [api.categoryName, api.recruitType].filter(Boolean),
    thumbnailUrl: api.lectureImageUrl,
    summary: api.goal,
    schedule: {
      recruitPeriod: { start: api.deadline, end: api.startAt },
      coursePeriod: { start: api.startAt, end: api.endAt },
      days: api.days.map(day => dayKor(day)).join(', '),
      time: `${api.startTime.slice(0, 5)} - ${api.endTime.slice(0, 5)}`,
      totalHours: api.totalTimes,
    },
    support: {
      tuition: api.lectureFee,
      stipend: api.subsidy ? `월 ${api.subsidy.toLocaleString()}원` : undefined,
      extraSupport: api.eduSubsidy ? `교육비 지원 ${api.eduSubsidy.toLocaleString()}원` : undefined,
    },
    location: api.location,
    recruitStatus: api.status === 'RECRUITING' ? 'OPEN' : api.status === 'DRAFT' ? 'DRAFT' : 'CLOSED',
    photos: api.orgFacilityImageUrls ?? [],
  }
}

/**
 *   요일 영문(enum) → 한글 변환 함수
 */
function dayKor(day: string): string {
  switch (day) {
    case 'MONDAY':
      return '월'
    case 'TUESDAY':
      return '화'
    case 'WEDNESDAY':
      return '수'
    case 'THURSDAY':
      return '목'
    case 'FRIDAY':
      return '금'
    case 'SATURDAY':
      return '토'
    case 'SUNDAY':
      return '일'
    default:
      return day
  }
}

/**
 *   강의 상세 조회 API
 * - 서버에서 데이터를 가져온 후
 * - 프론트에서 사용하는 형태로 변환해서 반환
 */
export async function getLectureDetail(lectureId: string | number): Promise<LectureDetail> {
  const { data } = await api.get<ApiLectureDetail>(`/lectures/${lectureId}`)
  return mapApiLectureDetailToLectureDetail(data)
}
