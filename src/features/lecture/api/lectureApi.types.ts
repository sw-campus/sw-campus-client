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
  orgId: number
  title: string
  orgName: string
  tags: string[]
  lectureLoc: string
  categoryName: string
  thumbnailUrl?: string
  url?: string
  summary: string
  recruitType: string
  schedule: {
    recruitPeriod: string
    coursePeriod: { start: string; end: string }
    days: string
    time: string
    totalHours: number
    totalDays: number
  }
  support: {
    tuition?: number
    stipend?: string
    extraSupport?: string
  }
  location: string
  recruitStatus: 'OPEN' | 'CLOSED' | 'DRAFT'
  photos: string[]
  steps: string[]
  benefits: string[]

  goal: string
  maxCapacity: number
  equipment: {
    pc: string
    merit: string
  }
  services: {
    books: boolean
    resume: boolean
    mockInterview: boolean
    employmentHelp: boolean
    afterCompletion: boolean
  }
  project: {
    num: number
    time: number
    team: string
    tool: string
    mentor: boolean
  }
  curriculum: {
    level: string
    name: string
  }[]
  teachers: {
    name: string
    desc: string
    imageUrl?: string
  }[]
  quals: {
    type: string
    text: string
  }[]
}
