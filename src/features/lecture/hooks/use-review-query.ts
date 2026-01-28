import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { getReviewDetail, updateReview, type UpdateReviewPayload } from '../api/review-api.client'

/**
 * 리뷰 상세 조회 Query Hook
 */
export function useReviewDetailQuery(reviewId: number) {
  return useQuery({
    queryKey: ['review', reviewId],
    queryFn: () => getReviewDetail(reviewId),
    enabled: !!reviewId && !isNaN(reviewId),
  })
}

/**
 * 리뷰 수정 Mutation Hook
 */
export function useUpdateReviewMutation(reviewId: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: UpdateReviewPayload) => updateReview(reviewId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['review', reviewId] })
      queryClient.invalidateQueries({ queryKey: ['reviews'] })
    },
  })
}
