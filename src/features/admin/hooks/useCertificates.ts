import { useQuery } from '@tanstack/react-query'

import { fetchCertificateStats, fetchReviews } from '../api/reviewApi'
import type { ReviewAuthStatus, ReviewSummary } from '../types/review.type'

/**
 * 수료증 목록 조회 훅 (클라이언트 사이드 필터링)
 * 리뷰 데이터를 가져와서 certificateApprovalStatus로 필터링
 */
export function useCertificatesQuery(
  status?: ReviewAuthStatus,
  keyword?: string,
  page: number = 0,
  size: number = 1000, // 클라이언트 사이드 필터링을 위해 큰 사이즈
) {
  // 리뷰 전체 데이터 조회 (status 없이)
  const query = useQuery({
    queryKey: ['admin', 'certificates', status ?? 'ALL', keyword ?? '', page],
    queryFn: async () => {
      // 전체 리뷰 데이터 조회 (status 파라미터 없이)
      const data = await fetchReviews(undefined, keyword, 0, size)
      const allReviews = data.content

      // certificateApprovalStatus 기준으로 필터링
      let filteredReviews: ReviewSummary[]
      if (status) {
        filteredReviews = allReviews.filter(r => r.certificateApprovalStatus === status)
      } else {
        filteredReviews = allReviews
      }

      // 클라이언트 페이지네이션
      const pageSize = 10
      const offset = page * pageSize
      const paginatedReviews = filteredReviews.slice(offset, offset + pageSize)

      return {
        content: paginatedReviews,
        page: {
          size: pageSize,
          number: page,
          totalElements: filteredReviews.length,
          totalPages: Math.ceil(filteredReviews.length / pageSize),
        },
      }
    },
    staleTime: 1000 * 60 * 5,
  })

  return query
}

/**
 * 수료증 통계 조회 훅 (서버 API 사용)
 */
export function useCertificateStats() {
  return useQuery({
    queryKey: ['admin', 'certificates', 'stats'],
    queryFn: fetchCertificateStats,
    staleTime: 1000 * 60 * 5,
  })
}
