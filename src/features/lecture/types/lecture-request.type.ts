import {
  DecimalString,
  EquipmentType,
  LectureDay,
  LectureAuthStatus,
  LectureLocation,
  LocalDateString,
  LocalDateTimeString,
  LocalTimeString,
  RecruitType,
} from '@/features/lecture/types/lecture.type'

export interface LectureCreateRequest {
  lectureName: string
  days: LectureDay[]
  startTime: LocalTimeString
  endTime: LocalTimeString

  lectureLoc: LectureLocation
  location?: string | null

  recruitType: RecruitType

  subsidy: DecimalString
  lectureFee: DecimalString
  eduSubsidy: DecimalString

  goal?: string | null
  maxCapacity?: number | null

  equipPc?: EquipmentType | null
  equipMerit?: string | null

  books: boolean
  resume: boolean
  mockInterview: boolean
  employmentHelp: boolean

  afterCompletion?: number | null
  url?: string | null
  lectureImageUrl?: string | null
  lectureAuthStatus?: LectureAuthStatus | null

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
}

export interface LectureCreateResponse {
  lectureId: number
}
