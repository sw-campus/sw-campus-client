import { useQuery } from '@tanstack/react-query';
import { fetchOrganizationList } from '../api/organizationApi';

/**
 * 기관 목록 조회 Query Hook
 * @param keyword - 검색 키워드 (기관명)
 */
export function useOrganizationsQuery(keyword?: string) {
    return useQuery({
        queryKey: ['organizations', keyword ?? ''],
        queryFn: () => fetchOrganizationList(keyword),
        staleTime: 1000 * 60 * 5, // 5분간 fresh 유지
    });
}
