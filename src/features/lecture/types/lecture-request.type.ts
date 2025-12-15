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

export type LectureStepType = 'DOCUMENT' | 'CODING_TEST' | 'INTERVIEW' | (string & {})

export interface LectureStepCreateRequest {
  stepType: LectureStepType
  stepOrder: number
}

export interface LectureTeacherCreateRequest {
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

  startAt: LocalDateString
  endAt: LocalDateString
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

