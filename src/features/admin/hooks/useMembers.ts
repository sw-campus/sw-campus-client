import { useQuery } from '@tanstack/react-query'

import { fetchMembers, fetchMemberStats } from '../api/memberApi'
import type { MemberRole } from '../types/member.type'

/**
 * 회원 역할별 통계 조회 Query Hook
 */
export function useMemberStatsQuery() {
  return useQuery({
    queryKey: ['admin', 'members', 'stats'],
    queryFn: fetchMemberStats,
    staleTime: 1000 * 60 * 5,
  })
}

/**
 * 회원 목록 조회 Query Hook
 */
export function useMembersQuery(role?: MemberRole, keyword?: string, page: number = 0, size: number = 10) {
  return useQuery({
    queryKey: ['admin', 'members', role ?? 'ALL', keyword ?? '', page, size],
    queryFn: () => fetchMembers(role, keyword, page, size),
    staleTime: 1000 * 60 * 5,
  })
}
