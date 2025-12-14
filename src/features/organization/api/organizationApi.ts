import { api } from '@/lib/axios';
import type { OrganizationSummary, OrganizationDetail } from '../types/organization.type';
import type { Course } from '@/features/course/types/course.type';

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
 * LectureResponse API 응답 타입 (간소화)
 */
interface LectureResponse {
    lectureId: number;
    orgId: number;
    orgName: string;
    lectureName: string;
    startAt: string | null;
    endAt: string | null;
    lectureImageUrl: string | null;
    curriculums: { curriculumId: number; curriculumName: string; level: string }[];
}

/**
 * LectureResponse를 Course 타입으로 변환
 */
function mapLectureToCourse(lecture: LectureResponse): Course {
    return {
        id: lecture.lectureId,
        title: lecture.lectureName,
        organization: lecture.orgName,
        periodStart: lecture.startAt?.split('T')[0] ?? '',
        periodEnd: lecture.endAt?.split('T')[0] ?? '',
        tags: lecture.curriculums.slice(0, 3).map(c => ({
            id: c.curriculumId,
            name: c.curriculumName,
        })),
        imageUrl: lecture.lectureImageUrl ?? undefined,
    };
}

/**
 * 기관별 강의 목록 조회 API
 * @param organizationId - 기관 ID
 */
export async function fetchOrganizationLectures(organizationId: number): Promise<Course[]> {
    const { data } = await api.get<LectureResponse[]>(`/organizations/${organizationId}/lectures`);
    return data.map(mapLectureToCourse);
}
