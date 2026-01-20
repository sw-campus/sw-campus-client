/** API 응답: 모집 절차 단계 */
interface ApiStep {
  stepOrder: number
  stepType: string
}

/** API 응답: 추가 혜택 */
interface ApiAdd {
  addName: string
}

/** API 응답: 지원 자격 */
interface ApiQual {
  type: string
  text: string
}

/** API 응답: 커리큘럼 (중첩 구조 호환) */
interface ApiCurriculum {
  level: string
  curriculumName?: string
  curriculum?: {
    curriculumName: string
  }
}

/** API 응답: 특화 커리큘럼 */
interface ApiSpecialCurriculum {
  specialCurriculumId: number
  title: string
  sortOrder: number
}

/** API 응답: 강사 정보 (다양한 구조 호환) */
interface ApiTeacher {
  teacherName?: string
  name?: string
  teacherDescription?: string
  teacherDesc?: string
  desc?: string
  teacherImageUrl?: string
  imageUrl?: string
  teacher?: {
    teacherName?: string
    name?: string
    teacherDescription?: string
    teacherDesc?: string
    desc?: string
    teacherImageUrl?: string
    imageUrl?: string
  }
}

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
  steps: ApiStep[]
  adds: ApiAdd[]
  quals: ApiQual[]
  teachers: (string | ApiTeacher)[]
  categoryName: string
  curriculums: ApiCurriculum[]
  specialCurriculums: ApiSpecialCurriculum[] | null
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
  recruitStatus: 'RECRUITING' | 'FINISHED'
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
  specialCurriculums: {
    specialCurriculumId: number
    title: string
    sortOrder: number
  }[] | null
}
