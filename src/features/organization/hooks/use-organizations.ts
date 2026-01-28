import { useQuery } from '@tanstack/react-query'

import {
  fetchOrganizationList,
  fetchOrganizationDetail,
  fetchOrganizationLectures,
  type LectureSortType,
} from '../api/organization-api'

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
 * @param initialData - 서버에서 미리 가져온 데이터 (SSR)
 */
export function useOrganizationDetailQuery(
  organizationId: number,
  initialData?: Awaited<ReturnType<typeof fetchOrganizationDetail>>
) {
  return useQuery({
    queryKey: ['organization', organizationId],
    queryFn: () => fetchOrganizationDetail(organizationId),
    staleTime: 1000 * 60 * 5, // 5분간 fresh 유지
    enabled: !!organizationId,
    initialData,
  })
}

/**
 * 기관별 강의 목록 조회 Query Hook
 * @param organizationId - 기관 ID
 * @param page - 페이지 번호 (0부터 시작)
 * @param size - 페이지 크기
 * @param sort - 정렬 기준
 */
export function useOrganizationLecturesQuery(
  organizationId: number,
  page: number = 0,
  size: number = 6,
  sort: LectureSortType = 'LATEST',
) {
  return useQuery({
    queryKey: ['organization', organizationId, 'lectures', page, size, sort],
    queryFn: () => fetchOrganizationLectures(organizationId, page, size, sort),
    staleTime: 1000 * 60 * 5, // 5분간 fresh 유지
    enabled: !!organizationId,
  })
}
