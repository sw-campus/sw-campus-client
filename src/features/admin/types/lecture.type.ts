/**
 * Lecture 승인 상태
 */
export type LectureAuthStatus = 'PENDING' | 'APPROVED' | 'REJECTED'

/**
 * Lecture 필터 상태 (전체 포함)
 */
export type LectureAuthStatusFilter = LectureAuthStatus | 'ALL'

/**
 * 승인 상태 한국어 라벨
 */
export const LECTURE_AUTH_STATUS_LABEL: Record<LectureAuthStatus, string> = {
  PENDING: '승인대기',
  APPROVED: '승인완료',
  REJECTED: '반려',
}

/**
 * 필터 상태 한국어 라벨 (전체 포함)
 */
export const LECTURE_AUTH_STATUS_FILTER_LABEL: Record<LectureAuthStatusFilter, string> = {
  ALL: '전체',
  PENDING: '승인대기',
  APPROVED: '승인완료',
  REJECTED: '반려',
}

/**
 * 승인 상태 배지 색상
 */
export const LECTURE_AUTH_STATUS_COLOR: Record<LectureAuthStatus, string> = {
  PENDING: 'bg-chart-4 text-foreground',
  APPROVED: 'bg-emerald-400 text-white',
  REJECTED: 'bg-destructive text-destructive-foreground',
}

/**
 * Lecture 요약 정보 (목록용)
 */
export interface LectureSummary {
  lectureId: number
  lectureName: string
  orgName: string
  lectureAuthStatus: LectureAuthStatus
  createdAt: string
}

/**
 * 커리큘럼 정보
 */
export interface CurriculumInfo {
  curriculumId: number
  curriculumName: string
  curriculumDesc: string
  level: string // NONE, BASIC, ADVANCED
}

/**
 * 난이도 라벨
 */
export const CURRICULUM_LEVEL_LABEL: Record<string, string> = {
  NONE: '없음',
  BASIC: '기초',
  ADVANCED: '고급',
}

/**
 * Lecture 상세 정보
 */
export interface LectureDetail {
  lectureId: number
  orgId: number
  orgName: string
  lectureName: string
  days: string[]
  startTime: string | null
  endTime: string | null
  lectureLoc: string | null
  location: string | null
  recruitType: string | null
  subsidy: number | null
  lectureFee: number | null
  eduSubsidy: number | null
  goal: string | null
  maxCapacity: number | null
  equipPc: string | null
  equipMerit: string | null
  books: boolean | null
  resume: boolean | null
  mockInterview: boolean | null
  employmentHelp: boolean | null
  afterCompletion: boolean | null
  url: string | null
  lectureImageUrl: string | null
  status: string
  lectureAuthStatus: LectureAuthStatus
  projectNum: number | null
  projectTime: number | null
  projectTeam: string | null
  projectTool: string | null
  projectMentor: boolean | null
  startAt: string | null
  endAt: string | null
  deadline: string | null
  totalDays: number | null
  totalTimes: number | null
  categoryName: string | null
  averageScore: number | null
  reviewCount: number | null
  curriculums: CurriculumInfo[]
}

/**
 * Lecture 목록 조회 파라미터
 */
export interface LectureListParams {
  status?: LectureAuthStatus
  keyword?: string
  page?: number
  size?: number
}
