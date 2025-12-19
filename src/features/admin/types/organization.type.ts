/**
 * Organization 승인 상태
 */
export type ApprovalStatus = 'PENDING' | 'APPROVED' | 'REJECTED'

/**
 * 승인 상태 한국어 라벨
 */
export const APPROVAL_STATUS_LABEL: Record<ApprovalStatus, string> = {
  PENDING: '승인대기',
  APPROVED: '승인완료',
  REJECTED: '반려',
}

/**
 * 승인 상태 배지 색상
 */
export const APPROVAL_STATUS_COLOR: Record<ApprovalStatus, string> = {
  PENDING: 'bg-chart-4 text-foreground',
  APPROVED: 'bg-emerald-400 text-white',
  REJECTED: 'bg-destructive text-destructive-foreground',
}

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
  certificateUrl: string | null
  approvalStatus: ApprovalStatus
  homepage: string | null
  createdAt: string
  updatedAt: string
}

/**
 * Spring Data Page 응답 - PageInfo
 */
export interface PageInfo {
  size: number
  number: number // 현재 페이지 (0-indexed)
  totalElements: number
  totalPages: number
}

/**
 * 페이지네이션 응답
 */
export interface PageResponse<T> {
  content: T[]
  page: PageInfo
}

/**
 * Organization 목록 조회 파라미터
 */
export interface OrganizationListParams {
  status?: ApprovalStatus
  page?: number
  size?: number
}
