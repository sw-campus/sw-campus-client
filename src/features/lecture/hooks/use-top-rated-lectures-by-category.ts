'use client'

import { useQuery } from '@tanstack/react-query'

import { getTopRatedLecturesByCategory } from '@/features/lecture/api/lecture.api'
import type { LectureResponseDto } from '@/features/lecture/types/lecture-response.type'

/**
 * 카테고리별 평점 높은 강의 조회 Hook
 * @param categoryId - 카테고리 ID (null일 경우 쿼리 비활성화)
 */
export const useTopRatedLecturesByCategory = (categoryId: number | null) => {
    return useQuery<LectureResponseDto[], Error>({
        queryKey: ['lectures', 'topRated', categoryId],
        queryFn: () => getTopRatedLecturesByCategory(categoryId!),
        enabled: categoryId !== null,
    })
}
