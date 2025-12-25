import { api } from '@/lib/axios';
import type { OrganizationSummary, OrganizationDetail } from '../types/organization.type';
import type { Lecture } from '@/features/lecture/types/lecture.type';
import type { LectureResponseDto } from '@/features/lecture/types/lecture-response.type';
import { mapLectureResponseToSummary } from '@/features/lecture/utils/mapLectureResponseToSummary';

/**
 * 기관 목록 조회 API
 * @param keyword - 검색 키워드 (기관명)
 */
export async function fetchOrganizationList(keyword?: string): Promise<OrganizationSummary[]> {
    const params = keyword ? { keyword } : undefined;
    const { data } = await api.get<OrganizationSummary[]>('/organizations', { params });
    return data;
}

/**
 * 기관 상세 조회 API
 * @param organizationId - 기관 ID
 */
export async function fetchOrganizationDetail(organizationId: number): Promise<OrganizationDetail> {
    const { data } = await api.get<OrganizationDetail>(`/organizations/${organizationId}`);
    return data;
}

/**
 * 기관별 강의 목록 조회 API
 * @param organizationId - 기관 ID
 */
export async function fetchOrganizationLectures(organizationId: number): Promise<Lecture[]> {
    const { data } = await api.get<LectureResponseDto[]>(`/organizations/${organizationId}/lectures`);
    return data.map(mapLectureResponseToSummary);
}
