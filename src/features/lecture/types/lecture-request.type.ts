import {
  EquipmentType,
  LectureDay,
  LectureAuthStatus,
  LectureLocation,
  LocalDateString,
  LocalTimeString,
  RecruitType,
} from '@/features/lecture/types/lecture.type'

export type LectureQualType = 'REQUIRED' | 'PREFERRED' | (string & {})

export interface LectureQualCreateRequest {
  type: LectureQualType
  text: string
}

export type LectureStepType = 'DOCUMENT' | 'CODING_TEST' | 'INTERVIEW' | 'PRE_TASK' | (string & {})

export interface LectureStepCreateRequest {
  stepType: LectureStepType
  stepOrder: number
}

export interface LectureTeacherCreateRequest {
  teacherId?: number | null // 기존 강사 선택 시 ID
  teacherName: string
  teacherDescription?: string | null
  teacherImageUrl?: string | null
}

export interface LectureAddCreateRequest {
  addName: string
}

export type CurriculumLevel = 'NONE' | 'BASIC' | 'ADVANCED'

export interface LectureCurriculumRequest {
  curriculumId: number
  level: CurriculumLevel
}

export interface LectureCreateRequest {
  orgId?: number | null // 기관 ID (백엔드에서 로그인 사용자 기준으로 설정)
  lectureName: string
  days: LectureDay[]
  startTime: LocalTimeString
  endTime: LocalTimeString

  lectureLoc: LectureLocation
  location?: string | null

  recruitType: RecruitType

  subsidy: number
  lectureFee: number
  eduSubsidy: number

  goal?: string | null
  maxCapacity?: number | null

  equipPc?: EquipmentType | null
  equipMerit?: string | null

  books: boolean
  resume: boolean
  mockInterview: boolean
  employmentHelp: boolean

  afterCompletion?: boolean | null
  url?: string | null
  lectureImageUrl?: string | null

  projectNum?: number | null
  projectTime?: number | null
  projectTeam?: string | null
  projectTool?: string | null
  projectMentor?: boolean | null

  startAt?: LocalDateString | null
  endAt?: LocalDateString | null
  deadline?: LocalDateString | null

  totalDays: number
  totalTimes: number

  steps: LectureStepCreateRequest[]
  quals?: LectureQualCreateRequest[]
  teachers?: LectureTeacherCreateRequest[]
  adds?: LectureAddCreateRequest[]
  curriculums?: LectureCurriculumRequest[]
}

export interface LectureCreateResponse {
  lectureId: number
}
