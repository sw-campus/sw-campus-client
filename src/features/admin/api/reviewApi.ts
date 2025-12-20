import type {
  ReviewApprovalResponse,
  ReviewAuthStatus,
  ReviewDetail,
  ReviewListResponse,
  ReviewSummary,
} from '@/features/admin/types/review.type'
import { api } from '@/lib/axios'
import type { PageResponse } from '@/types/api.type'

/**
 * Review 목록 조회 API (페이징)
 */
export async function fetchReviews(
  status?: ReviewAuthStatus,
  keyword?: string,
  page: number = 0,
  size: number = 10,
): Promise<PageResponse<ReviewSummary>> {
  const { data } = await api.get<ReviewListResponse>('/admin/reviews', {
    params: {
      ...(status && { status }),
      ...(keyword && { keyword }),
      page,
      size,
    },
  })

  // ApprovalPage 공통 컴포넌트 호환을 위해 PageResponse 형식으로 변환
  return {
    content: data.reviews,
    page: {
      size,
      number: page,
      totalElements: data.totalCount,
      totalPages: Math.ceil(data.totalCount / size),
    },
  }
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
