'use client'

import { useQuery } from '@tanstack/react-query'

import { getCurrentMember, type CurrentMember } from '@/features/mypage/api/member.api'
import { useAuthStore } from '@/store/auth-store'

export const currentMemberQueryKey = ['currentMember'] as const

export function useCurrentMemberQuery() {
  const isLoggedIn = useAuthStore(state => state.isLoggedIn)

  return useQuery<CurrentMember>({
    queryKey: currentMemberQueryKey,
    queryFn: getCurrentMember,
    enabled: isLoggedIn,
  })
}
