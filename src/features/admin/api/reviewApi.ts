import type {
  ReviewApprovalResponse,
  ReviewAuthStatus,
  ReviewDetail,
  ReviewSummary,
  CertificateDetail,
  CertificateApprovalResponse,
} from '@/features/admin/types/review.type'
import { api } from '@/lib/axios'
import type { PageResponse } from '@/types/api.type'

import type { ApprovalStats } from '../types/approval.type'

/**
 * 수료증 통계 조회 API
 */
export async function fetchCertificateStats(): Promise<ApprovalStats> {
  const { data } = await api.get<ApprovalStats>('/admin/certificates/stats')
  return data
}

/**
 * 리뷰 통계 조회 API
 */
export async function fetchReviewStats(): Promise<ApprovalStats> {
  const { data } = await api.get<ApprovalStats>('/admin/reviews/stats')
  return data
}

/**
 * Review 목록 조회 API (페이징)
 */
export async function fetchReviews(
  status?: ReviewAuthStatus,
  keyword?: string,
  page: number = 0,
  size: number = 10,
): Promise<PageResponse<ReviewSummary>> {
  const { data } = await api.get<PageResponse<ReviewSummary>>('/admin/reviews/all', {
    params: {
      ...(status && { status }),
      ...(keyword && { keyword }),
      page,
      size,
    },
  })

  // API 응답이 이미 PageResponse 형태 (content + page 객체)
  return data
}

/**
 * Review 상세 조회 API
 */
export async function fetchReviewDetail(reviewId: number): Promise<ReviewDetail> {
  const { data } = await api.get<ReviewDetail>(`/admin/reviews/${reviewId}`)
  return data
}

/**
 * Review 승인 API
 */
export async function approveReview(reviewId: number): Promise<ReviewApprovalResponse> {
  const { data } = await api.patch<ReviewApprovalResponse>(`/admin/reviews/${reviewId}/approve`)
  return data
}

/**
 * Review 반려 API
 */
export async function rejectReview(reviewId: number): Promise<ReviewApprovalResponse> {
  const { data } = await api.patch<ReviewApprovalResponse>(`/admin/reviews/${reviewId}/reject`)
  return data
}

/**
 * 수료증 상세 조회 API
 */
export async function fetchCertificateDetail(certificateId: number): Promise<CertificateDetail> {
  const { data } = await api.get<CertificateDetail>(`/admin/certificates/${certificateId}`)
  return data
}

/**
 * 수료증 승인 API
 */
export async function approveCertificate(certificateId: number): Promise<CertificateApprovalResponse> {
  const { data } = await api.patch<CertificateApprovalResponse>(`/admin/certificates/${certificateId}/approve`)
  return data
}

/**
 * 수료증 반려 API
 */
export async function rejectCertificate(certificateId: number): Promise<CertificateApprovalResponse> {
  const { data } = await api.patch<CertificateApprovalResponse>(`/admin/certificates/${certificateId}/reject`)
  return data
}
