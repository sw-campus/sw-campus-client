import { api } from '@/lib/axios';
import type { OrganizationSummary, OrganizationDetail } from '../types/organization.type';
import type { LectureResponseDto } from '@/features/lecture/types/lecture-response.type';

/**
 * 강의 정렬 타입
 */
export type LectureSortType =
    | 'LATEST'           // 최신순
    | 'FEE_ASC'          // 자부담금 낮은순
    | 'FEE_DESC'         // 자부담금 높은순
    | 'START_SOON'       // 개강 빠른순
    | 'DURATION_ASC'     // 교육기간 짧은순
    | 'DURATION_DESC'    // 교육기간 긴순
    | 'REVIEW_COUNT_DESC' // 리뷰 많은순
    | 'SCORE_DESC';       // 별점 높은순

/**
 * 정렬 옵션 라벨 매핑
 */
export const LECTURE_SORT_LABELS: Record<LectureSortType, string> = {
    LATEST: '최신순',
    FEE_ASC: '자부담금 낮은순',
    FEE_DESC: '자부담금 높은순',
    START_SOON: '개강 빠른순',
    DURATION_ASC: '교육기간 짧은순',
    DURATION_DESC: '교육기간 긴순',
    REVIEW_COUNT_DESC: '리뷰 많은순',
    SCORE_DESC: '별점 높은순',
};

/**
 * 기관별 강의 목록 응답 타입
 */
export interface OrganizationLectureListResponse {
    lectures: LectureResponseDto[];
    page: {
        size: number;
        number: number;
        totalElements: number;
        totalPages: number;
    };
}

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
 * 기관별 강의 목록 조회 API (페이지네이션/정렬 지원)
 * @param organizationId - 기관 ID
 * @param page - 페이지 번호 (0부터 시작)
 * @param size - 페이지 크기
 * @param sort - 정렬 기준
 */
export async function fetchOrganizationLectures(
    organizationId: number,
    page: number = 0,
    size: number = 6,
    sort: LectureSortType = 'LATEST',
): Promise<OrganizationLectureListResponse> {
    const { data } = await api.get<OrganizationLectureListResponse>(`/organizations/${organizationId}/lectures`, {
        params: { page, size, sort },
    });
    return data;
}
