'use client'

import { useQuery } from '@tanstack/react-query'

import { getCompletedLectures } from '@/features/mypage/api/completed-lectures.api'
import { useAuthStore } from '@/store/auth-store'

export const completedLecturesQueryKey = ['mypage', 'completedLectures'] as const

/**
 * 수료 강의 목록 조회 hook
 * React Query 캐싱으로 중복 API 호출 방지
 * 응답에 reviewStatus가 포함되어 있어 별도 API 호출 불필요
 */
export function useCompletedLecturesQuery() {
  const isLoggedIn = useAuthStore(state => state.isLoggedIn)

  return useQuery({
    queryKey: completedLecturesQueryKey,
    queryFn: getCompletedLectures,
    enabled: isLoggedIn,
  })
}
