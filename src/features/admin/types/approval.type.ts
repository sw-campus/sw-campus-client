/**
 * 공통 승인 상태 타입
 * Lecture, Organization 등 여러 도메인에서 공유
 */
export type ApprovalStatus = 'PENDING' | 'APPROVED' | 'REJECTED'

/**
 * 승인 상태 상수 객체
 * 문자열 리터럴 대신 이 상수를 사용하여 타입 안전성을 확보
 */
export const APPROVAL_STATUS = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
} as const

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
  PENDING: '대기중',
  APPROVED: '승인됨',
  REJECTED: '반려됨',
}

/**
 * 필터 상태 한국어 라벨 (전체 포함)
 */
export const APPROVAL_STATUS_FILTER_LABEL: Record<ApprovalStatusFilter, string> = {
  ALL: '전체',
  PENDING: '대기중',
  APPROVED: '승인됨',
  REJECTED: '반려됨',
}

/**
 * 승인 상태 배지 색상 (통계 카드와 동일한 색상 체계)
 */
export const APPROVAL_STATUS_COLOR: Record<ApprovalStatus, string> = {
  PENDING: 'bg-warning text-warning-foreground',
  APPROVED: 'bg-success text-success-foreground',
  REJECTED: 'bg-destructive text-destructive-foreground',
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
  { label: APPROVAL_STATUS_FILTER_LABEL.PENDING, value: APPROVAL_STATUS.PENDING },
  { label: APPROVAL_STATUS_FILTER_LABEL.APPROVED, value: APPROVAL_STATUS.APPROVED },
  { label: APPROVAL_STATUS_FILTER_LABEL.REJECTED, value: APPROVAL_STATUS.REJECTED },
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

/**
 * 승인 상태 라벨 반환 헬퍼 함수
 * @param status 승인 상태 문자열
 * @returns 한국어 라벨 (없으면 '대기중')
 */
export const getApprovalStatusLabel = (status?: string): string =>
  APPROVAL_STATUS_LABEL[status as ApprovalStatus] ?? APPROVAL_STATUS_LABEL.PENDING

/**
 * 승인 상태 색상 반환 헬퍼 함수
 * @param status 승인 상태 문자열
 * @returns 배지 색상 클래스 (없으면 PENDING 색상)
 */
export const getApprovalStatusColor = (status?: string): string =>
  APPROVAL_STATUS_COLOR[status as ApprovalStatus] ?? APPROVAL_STATUS_COLOR.PENDING

/**
 * 승인 상태에 따른 수정 가능 여부 반환 헬퍼 함수
 * APPROVED 상태는 수정 불가
 * @param status 승인 상태 문자열
 * @returns 수정 가능 여부
 */
export const canEditByStatus = (status?: string): boolean =>
  status !== APPROVAL_STATUS.APPROVED
