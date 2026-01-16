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

// ============================================
// Question Set Types (서버에서 문항 세트 조회)
// ============================================

export type QuestionSetType = 'BASIC' | 'APTITUDE'
export type QuestionType = 'RADIO' | 'CHECKBOX' | 'TEXT'
export type QuestionPart = 'PART1' | 'PART2' | 'PART3' | null

export interface OptionResponse {
  optionId: number
  optionOrder: number
  optionText: string
  optionValue: string
}

export interface QuestionResponse {
  questionId: number
  questionOrder: number
  questionText: string
  questionType: QuestionType
  isRequired: boolean
  fieldKey: string
  part: QuestionPart
  options: OptionResponse[]
}

export interface QuestionSetResponse {
  questionSetId: number
  name: string
  description: string | null
  type: QuestionSetType
  version: number
  questions: QuestionResponse[]
}

// ============================================
// Aptitude Test Question Types (컴포넌트용)
// ============================================

export interface AptitudeQuestion {
  id: string
  part: 1 | 2 | 3
  question: string
  options: AptitudeOption[]
}

export interface AptitudeOption {
  value: number | JobTypeCode
  label: string
}

/**
 * 서버 응답을 컴포넌트용 AptitudeQuestion 배열로 변환
 */
export function mapQuestionSetToAptitudeQuestions(
  questionSet: QuestionSetResponse | null
): AptitudeQuestion[] | null {
  if (!questionSet) return null

  return questionSet.questions
    .filter((q) => q.part !== null) // APTITUDE type은 항상 part가 있음
    .sort((a, b) => a.questionOrder - b.questionOrder)
    .map((q) => ({
      id: q.fieldKey,
      part: partToNumber(q.part!),
      question: q.questionText,
      options: q.options
        .sort((a, b) => a.optionOrder - b.optionOrder)
        .map((opt) => ({
          value: parseOptionValue(opt.optionValue, q.part!),
          label: opt.optionText,
        })),
    }))
}

function partToNumber(part: QuestionPart): 1 | 2 | 3 {
  switch (part) {
    case 'PART1':
      return 1
    case 'PART2':
      return 2
    case 'PART3':
      return 3
    default:
      return 1
  }
}

function parseOptionValue(value: string, part: QuestionPart): number | JobTypeCode {
  if (part === 'PART3') {
    return value as JobTypeCode
  }
  return parseInt(value, 10)
}
