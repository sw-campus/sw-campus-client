import { useQuery } from '@tanstack/react-query'

import { fetchOrganizationList, fetchOrganizationDetail, fetchOrganizationLectures } from '../api/organizationApi'

/**
 * 기관 목록 조회 Query Hook
 * @param keyword - 검색 키워드 (기관명)
 */
export function useOrganizationsQuery(keyword?: string) {
  return useQuery({
    queryKey: ['organizations', keyword ?? ''],
    queryFn: () => fetchOrganizationList(keyword),
    staleTime: 1000 * 60 * 5, // 5분간 fresh 유지
  })
}

/**
 * 기관 상세 조회 Query Hook
 * @param organizationId - 기관 ID
 */
export function useOrganizationDetailQuery(organizationId: number) {
  return useQuery({
    queryKey: ['organization', organizationId],
    queryFn: () => fetchOrganizationDetail(organizationId),
    staleTime: 1000 * 60 * 5, // 5분간 fresh 유지
    enabled: !!organizationId,
  })
}

/**
 * 기관별 강의 목록 조회 Query Hook
 * @param organizationId - 기관 ID
 */
export function useOrganizationLecturesQuery(organizationId: number) {
  return useQuery({
    queryKey: ['organization', organizationId, 'lectures'],
    queryFn: () => fetchOrganizationLectures(organizationId),
    staleTime: 1000 * 60 * 5, // 5분간 fresh 유지
    enabled: !!organizationId,
  })
}
