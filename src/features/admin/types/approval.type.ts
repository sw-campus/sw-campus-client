/**
 * 공통 승인 상태 타입
 * Lecture, Organization 등 여러 도메인에서 공유
 */
export type ApprovalStatus = 'PENDING' | 'APPROVED' | 'REJECTED'

/**
 * 필터 상태 (전체 포함)
 */
export type ApprovalStatusFilter = ApprovalStatus | 'ALL'

/**
 * 승인 통계 데이터
 * Organization, Lecture, Review 등 여러 도메인에서 공유
 */
export interface ApprovalStats {
  total: number
  pending: number
  approved: number
  rejected: number
}

/**
 * 승인 상태 한국어 라벨
 */
export const APPROVAL_STATUS_LABEL: Record<ApprovalStatus, string> = {
  PENDING: '승인대기',
  APPROVED: '승인완료',
  REJECTED: '반려',
}

/**
 * 필터 상태 한국어 라벨 (전체 포함)
 */
export const APPROVAL_STATUS_FILTER_LABEL: Record<ApprovalStatusFilter, string> = {
  ALL: '전체',
  PENDING: '승인대기',
  APPROVED: '승인완료',
  REJECTED: '반려',
}

/**
 * 승인 상태 배지 색상 (통계 카드와 동일한 색상 체계)
 */
export const APPROVAL_STATUS_COLOR: Record<ApprovalStatus, string> = {
  PENDING: 'bg-amber-500 text-white',
  APPROVED: 'bg-emerald-500 text-white',
  REJECTED: 'bg-rose-500 text-white',
}

/**
 * 필터 옵션 타입
 */
export interface FilterOption<T extends string = ApprovalStatusFilter> {
  label: string
  value: T
}

/**
 * 공통 필터 옵션
 */
export const DEFAULT_FILTER_OPTIONS: FilterOption<ApprovalStatusFilter>[] = [
  { label: APPROVAL_STATUS_FILTER_LABEL.ALL, value: 'ALL' },
  { label: APPROVAL_STATUS_FILTER_LABEL.PENDING, value: 'PENDING' },
  { label: APPROVAL_STATUS_FILTER_LABEL.APPROVED, value: 'APPROVED' },
  { label: APPROVAL_STATUS_FILTER_LABEL.REJECTED, value: 'REJECTED' },
]

// 공통 페이지네이션 타입 re-export
export type { PageInfo, PageResponse } from '@/types/api.type'

/**
 * Mutation 옵션 타입
 */
export interface MutationOptions {
  onSuccess?: () => void
  onError?: (error: unknown) => void
}
