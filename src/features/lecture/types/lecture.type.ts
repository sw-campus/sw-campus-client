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
  averageScore?: number // 리뷰 평균 점수
  reviewCount?: number // 리뷰 수
  recruitType?: string // 모집 유형
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

export const LECTURE_DAYS = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'] as const

export type LectureDayLiteral = (typeof LECTURE_DAYS)[number]

export type LectureDay = LectureDayLiteral | (string & {})

export type LectureLocation = 'ONLINE' | 'OFFLINE' | 'MIXED' | (string & {})

export type RecruitType = 'CARD_REQUIRED' | 'GENERAL' | (string & {})

export type EquipmentType = 'NONE' | 'PC' | 'LAPTOP' | 'PERSONAL' | (string & {})

export type LectureStatus = 'RECRUITING' | 'FINISHED' | (string & {})

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
