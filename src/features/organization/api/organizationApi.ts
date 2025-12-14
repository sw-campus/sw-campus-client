import { api } from '@/lib/axios';
import type { OrganizationSummary } from '../types/organization.type';

/**
 * 기관 목록 조회 API
 * @param keyword - 검색 키워드 (기관명)
 */
export async function fetchOrganizationList(keyword?: string): Promise<OrganizationSummary[]> {
    const params = keyword ? { keyword } : undefined;
    const { data } = await api.get<OrganizationSummary[]>('/organizations', { params });
    return data;
}
