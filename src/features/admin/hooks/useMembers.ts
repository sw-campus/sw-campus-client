import { useQuery } from '@tanstack/react-query'

import { fetchMembers } from '../api/memberApi'
import type { MemberRole } from '../types/member.type'

/**
 * 회원 목록 조회 Query Hook
 */
export function useMembersQuery(keyword?: string, page: number = 0, size: number = 1000) {
  return useQuery({
    queryKey: ['admin', 'members', keyword ?? '', page, size],
    queryFn: () => fetchMembers(keyword, page, size),
    staleTime: 1000 * 60 * 5,
  })
}
