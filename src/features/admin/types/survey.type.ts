// Question Set Types
export type QuestionSetType = 'BASIC' | 'APTITUDE'
export type QuestionSetStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
export type QuestionSetStatusFilter = QuestionSetStatus | 'ALL'

// Question Types
export type QuestionType = 'TEXT' | 'RADIO' | 'CHECKBOX' | 'RANGE' | 'CONDITIONAL'
export type QuestionPart = 'PART1' | 'PART2' | 'PART3'
export type JobTypeCode = 'F' | 'B' | 'D'

// Question Set Interfaces
export interface AdminQuestionSet {
  questionSetId: number
  name: string
  description: string | null
  type: QuestionSetType
  version: number
  status: QuestionSetStatus
  createdAt: string
  updatedAt: string
  publishedAt: string | null
  questionCount: number
}

export interface AdminQuestionSetDetail {
  questionSetId: number
  name: string
  description: string | null
  type: QuestionSetType
  version: number
  status: QuestionSetStatus
  createdAt: string
  updatedAt: string
  publishedAt: string | null
  questions: AdminQuestion[]
}

// Question Interfaces
export interface AdminQuestion {
  questionId: number
  questionSetId: number
  questionOrder: number
  questionText: string
  questionType: QuestionType
  isRequired: boolean
  fieldKey: string | null
  part: QuestionPart | null
  showCondition: Record<string, unknown> | null
  metadata: Record<string, unknown> | null
  createdAt: string
  options: AdminOption[]
}

// Option Interfaces
export interface AdminOption {
  optionId: number
  questionId: number
  optionOrder: number
  optionText: string
  optionValue: string | null
  score: number | null
  jobType: JobTypeCode | null
  isCorrect: boolean | null
}

// Request Interfaces (성향 테스트 전용, type은 서버에서 APTITUDE로 고정)
export interface CreateQuestionSetRequest {
  name: string
  description?: string
}

export interface UpdateQuestionSetRequest {
  name: string
  description?: string
}

export interface CreateQuestionRequest {
  questionText: string
  questionType: QuestionType
  isRequired: boolean
  part?: QuestionPart
  showCondition?: Record<string, unknown>
  metadata?: Record<string, unknown>
  // fieldKey는 서버에서 "q{순서}" 형식으로 자동 생성됩니다.
}

export interface UpdateQuestionRequest {
  questionText: string
  questionType: QuestionType
  isRequired: boolean
  part?: QuestionPart
  showCondition?: Record<string, unknown>
  metadata?: Record<string, unknown>
  // fieldKey는 수정할 수 없습니다.
}

// optionValue는 서버에서 Part에 따라 자동 생성됩니다:
// - PART3: jobType 값 (F, B, D)
// - PART1, PART2: optionOrder 값 (1, 2, 3...)
export interface CreateOptionRequest {
  optionText: string
  score?: number
  jobType?: JobTypeCode
  isCorrect?: boolean
}

export interface UpdateOptionRequest {
  optionText: string
  score?: number
  jobType?: JobTypeCode
  isCorrect?: boolean
}

// Labels
export const QUESTION_SET_TYPE_LABEL: Record<QuestionSetType, string> = {
  BASIC: '기초 설문',
  APTITUDE: '성향 테스트',
}

export const QUESTION_SET_STATUS_LABEL: Record<QuestionSetStatus, string> = {
  DRAFT: '작성 중',
  PUBLISHED: '발행됨',
  ARCHIVED: '보관됨',
}

export const QUESTION_SET_STATUS_COLOR: Record<QuestionSetStatus, string> = {
  DRAFT: 'bg-warning text-warning-foreground',
  PUBLISHED: 'bg-success text-success-foreground',
  ARCHIVED: 'bg-muted text-muted-foreground',
}

export const QUESTION_TYPE_LABEL: Record<QuestionType, string> = {
  TEXT: '텍스트 입력',
  RADIO: '단일 선택',
  CHECKBOX: '복수 선택',
  RANGE: '범위 선택',
  CONDITIONAL: '조건부 입력',
}

export const QUESTION_PART_LABEL: Record<QuestionPart, string> = {
  PART1: 'Part 1 - 논리 및 사고력',
  PART2: 'Part 2 - 끈기 및 학습 태도',
  PART3: 'Part 3 - 직무 성향 진단',
}

export const JOB_TYPE_LABEL: Record<JobTypeCode, string> = {
  F: '프론트엔드',
  B: '백엔드',
  D: '데이터/AI',
}
