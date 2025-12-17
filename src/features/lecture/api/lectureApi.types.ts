// 백엔드 API 응답 타입 (서버에서 내려주는 강의 상세 데이터 구조)
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

// 프론트엔드에서 사용하는 강의 상세 타입
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
