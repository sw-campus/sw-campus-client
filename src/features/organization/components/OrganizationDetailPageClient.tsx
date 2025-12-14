"use client";

import { useOrganizationDetailQuery, useOrganizationLecturesQuery } from '../hooks/useOrganizations';
import { findMockOrgDetail } from '../api/mockOrganizations';
import { OrganizationDetail } from './OrganizationDetail';
import type { Course } from '@/features/course/types/course.type';

interface OrganizationDetailPageClientProps {
    organizationId: number;
    mockCourses?: Course[];
}

/**
 * 기관 상세 페이지 클라이언트 컴포넌트
 * API 연동 성공시 실제 데이터, 실패시 mock 데이터 표시
 */
export function OrganizationDetailPageClient({ organizationId, mockCourses = [] }: OrganizationDetailPageClientProps) {
    // 기관 상세 정보 조회
    const {
        data: orgApiData,
        isLoading: isOrgLoading
    } = useOrganizationDetailQuery(organizationId);

    // 기관별 강의 목록 조회
    const {
        data: lecturesApiData,
        isLoading: isLecturesLoading
    } = useOrganizationLecturesQuery(organizationId);

    // API 데이터가 있으면 사용, 없으면 mock 데이터 fallback
    const mockOrgData = findMockOrgDetail(organizationId);
    const organization = orgApiData ?? mockOrgData;

    // 강의 목록: API 데이터 우선, 없으면 mock fallback
    const courses = lecturesApiData ?? mockCourses;

    // 로딩 중 (기관 정보 로딩 중일 때만 스피너 표시)
    if (isOrgLoading && !organization) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
        );
    }

    // 데이터 없음
    if (!organization) {
        return (
            <div className="py-20 text-center text-muted-foreground">
                <p className="text-lg">기관 정보를 찾을 수 없습니다.</p>
            </div>
        );
    }

    return (
        <OrganizationDetail
            organization={organization}
            courses={courses}
        />
    );
}
