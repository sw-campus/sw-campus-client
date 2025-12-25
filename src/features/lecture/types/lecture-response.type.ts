import type { LectureAuthStatus, LectureDay, LectureLocation, RecruitType } from '@/features/lecture/types/lecture.type'

export type LocalTimeString = string
export type LocalDateTimeString = string

export interface LectureStepResponseDto {
  stepId: number
  stepType: string | null
  stepOrder: number | null
}

export interface LectureAddResponseDto {
  addId: number
  addName: string | null
}

export interface LectureQualResponseDto {
  qualId: number
  type: string | null
  text: string | null
}

export interface LectureTeacherResponseDto {
  teacherId: number
  teacherName: string | null
  teacherImageUrl: string | null
}

export interface LectureCurriculumResponseDto {
  curriculumId: number
  curriculumName: string | null
  level: string | null
}

export interface LectureResponseDto {
  lectureId: number
  categoryId: number | null
  orgId: number
  orgName: string | null

  lectureName: string
  days: LectureDay[]
  startTime: LocalTimeString | null
  endTime: LocalTimeString | null

  lectureLoc: LectureLocation | null
  location: string | null

  recruitType: RecruitType | null
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

  afterCompletion: number | null
  url: string | null
  lectureImageUrl: string | null

  status: string | null
  lectureAuthStatus: LectureAuthStatus | null

  projectNum: number | null
  projectTime: number | null
  projectTeam: string | null
  projectTool: string | null
  projectMentor: boolean | null

  startAt: LocalDateTimeString | null
  endAt: LocalDateTimeString | null
  deadline: LocalDateTimeString | null

  totalDays: number | null
  totalTimes: number | null

  steps: LectureStepResponseDto[]
  adds: LectureAddResponseDto[]
  quals: LectureQualResponseDto[]
  teachers: LectureTeacherResponseDto[]
  curriculums: LectureCurriculumResponseDto[]
  categoryName: string | null
  averageScore: number | null
  reviewCount: number | null
}

// Spring Data Page 응답 타입 (실제 백엔드 응답 구조)
export interface PageInfo {
  size: number
  number: number // 현재 페이지 (0-indexed)
  totalElements: number
  totalPages: number
}

export interface PageResponse<T> {
  content: T[]
  page: PageInfo
}
