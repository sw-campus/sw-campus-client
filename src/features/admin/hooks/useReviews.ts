import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { approveReview, fetchReviewDetail, fetchReviews, rejectReview } from '@/features/admin/api/reviewApi'
import type { ReviewAuthStatus } from '@/features/admin/types/review.type'

// Review 목록 조회 Query Hook
export function useReviewsQuery(status?: ReviewAuthStatus, keyword?: string, page: number = 0) {
  return useQuery({
    queryKey: ['admin', 'reviews', status ?? 'ALL', keyword ?? '', page],
    queryFn: () => fetchReviews(status, keyword, page),
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
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'reviews'] })
      toast.success(data.message)
    },
  })
}

// Review 반려 Mutation Hook
export function useRejectReviewMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: rejectReview,
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'reviews'] })
      toast.success(data.message)
    },
  })
}
