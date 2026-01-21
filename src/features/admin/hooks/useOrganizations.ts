import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import {
  approveOrganization,
  fetchOrganizationDetail,
  fetchOrganizations,
  fetchOrganizationStats,
  rejectOrganization,
} from '../api/organizationApi'
import type { ApprovalStatus } from '../types/organization.type'

/**
 * Organization 통계 조회 Query Hook
 */
export function useOrganizationStatsQuery() {
  return useQuery({
    queryKey: ['admin', 'organizations', 'stats'],
    queryFn: fetchOrganizationStats,
    staleTime: 1000 * 60 * 5,
  })
}

/**
 * Organization 목록 조회 Query Hook
 * @param status - 승인 상태 필터 (undefined면 전체)
 * @param keyword - 검색 키워드 (기관명)
 * @param page - 페이지 번호 (0-indexed, 기본값: 0)
 */
export function useOrganizationsQuery(status?: ApprovalStatus, keyword?: string, page: number = 0) {
  return useQuery({
    queryKey: ['admin', 'organizations', status ?? 'ALL', keyword ?? '', page],
    queryFn: () => fetchOrganizations(status, keyword, page),
    staleTime: 1000 * 60 * 5, // 5분간 fresh 유지
  })
}

/**
 * Organization 상세 조회 Query Hook
 * @param organizationId - Organization ID
 */
export function useOrganizationDetailQuery(organizationId: number) {
  return useQuery({
    queryKey: ['admin', 'organization', organizationId],
    queryFn: () => fetchOrganizationDetail(organizationId),
    staleTime: 1000 * 60 * 5,
    enabled: !!organizationId,
  })
}

/**
 * Organization 승인 Mutation Hook
 */
export function useApproveOrganizationMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: approveOrganization,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'organizations'] })
      toast.success('승인되었습니다.')
    },
  })
}

/**
 * Organization 반려 Mutation Hook
 */
export function useRejectOrganizationMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: rejectOrganization,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'organizations'] })
      toast.success('반려되었습니다.')
    },
  })
}
