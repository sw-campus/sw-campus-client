import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import {
  approveCertificate,
  approveReview,
  fetchCertificateDetail,
  fetchReviewDetail,
  fetchReviews,
  rejectCertificate,
  rejectReview,
} from '@/features/admin/api/reviewApi'
import type { CertificateApprovalResponse, ReviewAuthStatus } from '@/features/admin/types/review.type'

// Review 목록 조회 Query Hook
export function useReviewsQuery(status?: ReviewAuthStatus, keyword?: string, page: number = 0) {
  return useQuery({
    queryKey: ['admin', 'reviews', status ?? 'ALL', keyword ?? '', page],
    queryFn: () => fetchReviews(status, keyword, page),
    staleTime: 1000 * 60 * 5,
  })
}

/**
 * 리뷰 통계 조회 훅 (수료증 승인된 리뷰만, reviewApprovalStatus 기준)
 */
export function useReviewStats() {
  return useQuery({
    queryKey: ['admin', 'reviews', 'stats'],
    queryFn: async () => {
      const data = await fetchReviews(undefined, '', 0, 1000)
      // 수료증이 승인된 리뷰만 필터링 (리뷰 관리는 수료증 승인 후에 진행)
      const reviewsWithApprovedCert = data.content.filter(r => r.certificateApprovalStatus === 'APPROVED')

      return {
        all: reviewsWithApprovedCert.length,
        pending: reviewsWithApprovedCert.filter(r => r.reviewApprovalStatus === 'PENDING').length,
        approved: reviewsWithApprovedCert.filter(r => r.reviewApprovalStatus === 'APPROVED').length,
        rejected: reviewsWithApprovedCert.filter(r => r.reviewApprovalStatus === 'REJECTED').length,
      }
    },
    staleTime: 1000 * 60 * 5,
  })
}

// Review 상세 조회 Query Hook
export function useReviewDetailQuery(reviewId: number) {
  return useQuery({
    queryKey: ['admin', 'review', reviewId],
    queryFn: () => fetchReviewDetail(reviewId),
    staleTime: 1000 * 60 * 5,
    enabled: !!reviewId,
  })
}

// Review 승인 Mutation Hook
export function useApproveReviewMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: approveReview,
    onSuccess: (data, reviewId) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'reviews'] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'review', reviewId] })
      toast.success(data.message)
    },
  })
}

// Review 반려 Mutation Hook
export function useRejectReviewMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: rejectReview,
    onSuccess: (data, reviewId) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'reviews'] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'review', reviewId] })
      toast.success(data.message)
    },
  })
}

// Certificate 상세 조회 Query Hook
export function useCertificateDetailQuery(certificateId: number) {
  return useQuery({
    queryKey: ['admin', 'certificate', certificateId],
    queryFn: () => fetchCertificateDetail(certificateId),
    staleTime: 1000 * 60 * 5,
    enabled: !!certificateId,
  })
}

// Certificate 승인 Mutation Hook
export function useApproveCertificateMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: approveCertificate,
    onSuccess: (data: CertificateApprovalResponse, certificateId) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'reviews'] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'certificate', certificateId] })
      toast.success(data.message || '수료증이 승인되었습니다.')
    },
  })
}

// Certificate 반려 Mutation Hook
export function useRejectCertificateMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: rejectCertificate,
    onSuccess: (data: CertificateApprovalResponse, certificateId) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'reviews'] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'certificate', certificateId] })
      toast.success(data.message || '수료증이 반려되었습니다.')
    },
  })
}
