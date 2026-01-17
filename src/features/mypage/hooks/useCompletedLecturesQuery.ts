'use client'

import { useQuery } from '@tanstack/react-query'

import {
  getCompletedLectures,
  getReviewStatuses,
  type CompletedLecture,
  type ReviewStatus,
} from '@/features/mypage/api/completedLectures.api'
import { useAuthStore } from '@/store/authStore'

export const completedLecturesQueryKey = ['mypage', 'completedLectures'] as const

/**
 * 수료 강의 목록 조회 hook
 * React Query 캐싱으로 중복 API 호출 방지
 */
export function useCompletedLecturesQuery() {
  const isLoggedIn = useAuthStore(state => state.isLoggedIn)

  return useQuery({
    queryKey: completedLecturesQueryKey,
    queryFn: getCompletedLectures,
    enabled: isLoggedIn,
  })
}

export const reviewStatusesQueryKey = (lectures: CompletedLecture[]) =>
  ['mypage', 'reviewStatuses', lectures.map(l => l.lectureId).join(',')] as const

/**
 * 리뷰 상태 조회 hook
 * 수료 강의 목록을 기반으로 각 강의의 리뷰 상태를 조회
 */
export function useReviewStatusesQuery(lectures: CompletedLecture[] | undefined) {
  const isLoggedIn = useAuthStore(state => state.isLoggedIn)
  const validLectures = lectures ?? []

  return useQuery({
    queryKey: reviewStatusesQueryKey(validLectures),
    queryFn: () => getReviewStatuses(validLectures),
    enabled: isLoggedIn && validLectures.length > 0,
  })
}
