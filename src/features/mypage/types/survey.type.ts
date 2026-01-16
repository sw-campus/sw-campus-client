/**
 * 설문조사 관련 TypeScript 타입 정의
 */

// Enums
export type LearningMethod = 'ONLINE' | 'OFFLINE' | 'MIXED'
export type DesiredJob = 'BACKEND' | 'FRONTEND' | 'DATA' | 'AI' | 'MOBILE' | 'OTHER'
export type BudgetRange = 'UNDER_50' | 'RANGE_50_100' | 'RANGE_100_200' | 'OVER_200'
export type RecommendedJob = 'FRONTEND' | 'BACKEND' | 'DATA' | 'FULLSTACK'
export type JobTypeCode = 'F' | 'B' | 'D'

// Basic Survey
export interface MajorInfo {
  hasMajor: boolean
  majorName: string | null
}

export interface ProgrammingExperience {
  hasExperience: boolean
  bootcampName: string | null
}

export interface BasicSurvey {
  majorInfo: MajorInfo
  programmingExperience: ProgrammingExperience
  preferredLearningMethod: LearningMethod
  desiredJobs: DesiredJob[]
  desiredJobOther: string | null
  affordableBudgetRange: BudgetRange
}

// Aptitude Test
export interface AptitudeTest {
  part1Answers: Record<string, number> // q1-q4: 1, 2, 3
  part2Answers: Record<string, number> // q5-q8: 1, 2, 3
  part3Answers: Record<string, JobTypeCode> // q9-q15: F, B, D
}

// Survey Results (추천 직무만 사용자에게 표시)
export interface SurveyResults {
  recommendedJob: RecommendedJob
}

// Survey Status
export interface SurveyStatus {
  hasBasicSurvey: boolean
  hasAptitudeTest: boolean
  canUseBasicRecommendation: boolean
  canUsePreciseRecommendation: boolean
}

// Full Survey Response
export interface SurveyResponse {
  memberId: number
  basicSurvey: BasicSurveyResponse | null
  results: SurveyResultsResponse | null
  status: SurveyStatus
  createdAt: string
  updatedAt: string
  completedAt: string | null
}

export interface MajorInfoResponse {
  hasMajor: boolean
  majorName: string | null
}

export interface ProgrammingExperienceResponse {
  hasExperience: boolean
  bootcampName: string | null
}

export interface BasicSurveyResponse {
  majorInfo: MajorInfoResponse
  programmingExperience: ProgrammingExperienceResponse
  preferredLearningMethod: LearningMethod
  desiredJobs: DesiredJob[]
  desiredJobOther: string | null
  affordableBudgetRange: BudgetRange
}

export interface SurveyResultsResponse {
  recommendedJob: RecommendedJob
}

// Request Types
export interface MajorInfoRequest {
  hasMajor: boolean
  majorName: string | null
}

export interface ProgrammingExperienceRequest {
  hasExperience: boolean
  bootcampName: string | null
}

export interface SaveBasicSurveyRequest {
  majorInfo: MajorInfoRequest
  programmingExperience: ProgrammingExperienceRequest
  preferredLearningMethod: LearningMethod
  desiredJobs: DesiredJob[]
  desiredJobOther: string | null
  affordableBudgetRange: BudgetRange
}

export interface SubmitAptitudeTestRequest {
  part1Answers: Record<string, number>
  part2Answers: Record<string, number>
  part3Answers: Record<string, JobTypeCode>
}

// Display labels
export const LEARNING_METHOD_LABELS: Record<LearningMethod, string> = {
  ONLINE: '온라인',
  OFFLINE: '오프라인',
  MIXED: '혼합',
}

export const DESIRED_JOB_LABELS: Record<DesiredJob, string> = {
  BACKEND: '백엔드',
  FRONTEND: '프론트엔드',
  DATA: '데이터',
  AI: 'AI',
  MOBILE: '모바일',
  OTHER: '기타',
}

export const BUDGET_RANGE_LABELS: Record<BudgetRange, string> = {
  UNDER_50: '50만원 미만',
  RANGE_50_100: '50~100만원',
  RANGE_100_200: '100~200만원',
  OVER_200: '200만원 이상',
}

export const RECOMMENDED_JOB_LABELS: Record<RecommendedJob, string> = {
  FRONTEND: '프론트엔드 개발자',
  BACKEND: '백엔드 개발자',
  DATA: '데이터 분석가 / AI 엔지니어',
  FULLSTACK: '풀스택 개발자',
}

// LocalStorage keys
export const APTITUDE_TEST_STORAGE_KEY = 'sw-campus-aptitude-test-draft'
