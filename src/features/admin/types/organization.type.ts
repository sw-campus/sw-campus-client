import {
  APPROVAL_STATUS_COLOR,
  APPROVAL_STATUS_FILTER_LABEL,
  APPROVAL_STATUS_LABEL,
  type ApprovalStatus,
  type ApprovalStatusFilter,
  type MutationOptions,
  type PageInfo,
  type PageResponse,
} from './approval.type'

// 공통 타입 재export (기존 import문 호환성 유지)
export type { ApprovalStatus, ApprovalStatusFilter, MutationOptions, PageInfo, PageResponse }

// 공통 상수 재export (기존 이름 유지)
export { APPROVAL_STATUS_LABEL, APPROVAL_STATUS_FILTER_LABEL, APPROVAL_STATUS_COLOR }

/**
 * Organization 요약 정보 (목록용)
 */
export interface OrganizationSummary {
  id: number
  name: string
  approvalStatus: ApprovalStatus
  createdAt: string
}

/**
 * Organization 상세 정보
 */
export interface OrganizationDetail {
  id: number
  name: string
  description: string | null
  certificateKey: string | null
  approvalStatus: ApprovalStatus
  homepage: string | null
  createdAt: string
  updatedAt: string
}

/**
 * Organization 목록 조회 파라미터
 */
export interface OrganizationListParams {
  status?: ApprovalStatus
  page?: number
  size?: number
}
