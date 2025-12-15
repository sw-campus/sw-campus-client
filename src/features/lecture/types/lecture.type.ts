// -----------------------------
// mock data types
// -----------------------------
export interface LectureTag {
  id: string
  name: string
}

export interface LectureSummary {
  id: string
  title: string
  organization: string
  periodStart: string // YYYY-MM-DD
  periodEnd: string // YYYY-MM-DD
  tags: LectureTag[]
  imageUrl?: string
  status?: string // 'RECRUITING' | 'FINISHED' | 'PREPARING'
}

// Keep existing imports working
export type Lecture = LectureSummary

// -----------------------------
// Backend-aligned Types (DTO)
// -----------------------------

export type LocalDateTimeString = string
export type LocalDateString = string
export type LocalTimeString = string
export type DecimalString = string

export type LectureDay =
  | 'MONDAY'
  | 'TUESDAY'
  | 'WEDNESDAY'
  | 'THURSDAY'
  | 'FRIDAY'
  | 'SATURDAY'
  | 'SUNDAY'
  | (string & {})

export type LectureLocation = 'ONLINE' | 'OFFLINE' | 'HYBRID' | (string & {})

export type RecruitType = 'CARD_REQUIRED' | 'GENERAL' | (string & {})

export type EquipmentType = 'NONE' | 'PC' | 'LAPTOP' | 'PERSONAL' | (string & {})

export type LectureStatus = 'OPEN' | 'CLOSED' | 'DRAFT' | (string & {})

export type LectureAuthStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | (string & {})

export interface LectureDto {
  lectureId: number
  orgId: number
  orgName?: string | null

  lectureName: string
  days?: LectureDay[] | null
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

  status: LectureStatus
  lectureAuthStatus?: LectureAuthStatus | null

  projectNum?: number | null
  projectTime?: number | null
  projectTeam?: string | null
  projectTool?: string | null
  projectMentor?: boolean | null

  startAt: LocalDateTimeString
  endAt: LocalDateTimeString
  deadline?: LocalDateTimeString | null

  totalDays: number
  totalTimes: number

  createdAt?: LocalDateTimeString
  updatedAt?: LocalDateTimeString
}
