import { api } from '@/lib/axios'
import type { PageResponse } from '@/types/api.type'

import type { ApprovalStatus, OrganizationDetail, OrganizationSummary } from '../types/organization.type'

export interface ApprovalStats {
  total: number
  pending: number
  approved: number
  rejected: number
}

/**
 * Organization 통계 조회 API
 */
export async function fetchOrganizationStats(): Promise<ApprovalStats> {
  const { data } = await api.get<ApprovalStats>('/admin/organizations/stats')
  return data
}

/**
 * Organization 목록 조회 API (페이징)
 * @param status - 승인 상태 필터 (undefined면 전체)
 * @param keyword - 검색 키워드 (기관명)
 * @param page - 페이지 번호 (0-indexed)
 * @param size - 페이지 크기
 */
export async function fetchOrganizations(
  status?: ApprovalStatus,
  keyword?: string,
  page: number = 0,
  size: number = 10,
): Promise<PageResponse<OrganizationSummary>> {
  const { data } = await api.get<PageResponse<OrganizationSummary>>('/admin/organizations', {
    params: {
      ...(status && { status }),
      ...(keyword && { keyword }),
      page,
      size,
    },
  })
  return data
}

/**
 * Organization 상세 조회 API
 * @param organizationId - Organization ID
 */
export async function fetchOrganizationDetail(organizationId: number): Promise<OrganizationDetail> {
  const { data } = await api.get<OrganizationDetail>(`/admin/organizations/${organizationId}`)
  return data
}

/**
 * Organization 승인 API
 * @param organizationId - Organization ID
 */
export async function approveOrganization(organizationId: number): Promise<void> {
  await api.patch(`/admin/organizations/${organizationId}/approve`)
}

/**
 * Organization 반려 API
 * @param organizationId - Organization ID
 */
export async function rejectOrganization(organizationId: number): Promise<void> {
  await api.patch(`/admin/organizations/${organizationId}/reject`)
}
