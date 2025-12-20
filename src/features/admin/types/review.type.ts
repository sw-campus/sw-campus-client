import {
  APPROVAL_STATUS_COLOR,
  APPROVAL_STATUS_FILTER_LABEL,
  APPROVAL_STATUS_LABEL,
  type ApprovalStatus,
  type ApprovalStatusFilter,
  type MutationOptions,
} from './approval.type'

// Review 승인 상태
export type ReviewAuthStatus = ApprovalStatus

// Review 필터 상태
export type ReviewAuthStatusFilter = ApprovalStatusFilter

// MutationOptions 타입 re-export
export type { MutationOptions }

// 승인 상태 한국어 라벨
export const REVIEW_AUTH_STATUS_LABEL = APPROVAL_STATUS_LABEL

// 필터 상태 한국어 라벨
export const REVIEW_AUTH_STATUS_FILTER_LABEL = APPROVAL_STATUS_FILTER_LABEL

// 승인 상태 배지 색상
export const REVIEW_AUTH_STATUS_COLOR = APPROVAL_STATUS_COLOR

// Review 요약 정보 (목록용)
export interface ReviewSummary {
  reviewId: number
  lectureId: number
  lectureName: string
  memberId: number
  userName: string
  nickname: string
  score: number
  certificateId: number
  certificateApprovalStatus: ReviewAuthStatus
  reviewApprovalStatus: ReviewAuthStatus
  createdAt: string
}

/**
 * 상세 평가 항목 정보
 */
export interface DetailScore {
  category: string
  score: number
  comment: string
}

// Review 상세 정보
export interface ReviewDetail {
  reviewId: number
  lectureId: number
  lectureName: string
  memberId: number
  userName: string
  nickname: string
  comment: string
  score: number
  approvalStatus: ReviewAuthStatus
  certificateId: number
  certificateApprovalStatus: ReviewAuthStatus
  detailScores: DetailScore[]
  createdAt: string
}

/**
 * Review API 응답 형식 (사용자 제공 형식)
 */
export interface ReviewListResponse {
  reviews: ReviewSummary[]
  totalCount: number
}

/**
 * Review 승인/반려 응답 형식
 */
export interface ReviewApprovalResponse {
  reviewId: number
  approvalStatus: ReviewAuthStatus
  message: string
}

// Review 목록 조회 파라미터
export interface ReviewListParams {
  status?: ReviewAuthStatus
  keyword?: string
  page?: number
  size?: number
}
