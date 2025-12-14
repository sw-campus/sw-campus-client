/**
 * API 응답과 매핑되는 기관 요약 정보 타입
 * 서버: OrganizationSummaryResponse
 */
export interface OrganizationSummary {
    id: number;
    name: string;
    logoUrl: string | null;
    description: string;
    recruitingLectureCount: number;
}

/**
 * API 응답과 매핑되는 기관 상세 정보 타입
 * 서버: OrganizationResponse
 */
export interface OrganizationDetail {
    id: number;
    name: string;
    logoUrl: string | null;
    description: string;
    websiteUrl: string | null;
    facilityImages: string[];
    desc: string;  // Short description for list
    description?: string;  // Full description for detail
    activeCourseCount?: number;
    imageUrl?: string;  // Image for list card
    logoUrl?: string;  // Logo for detail page
    govAuth?: string;  // Government certification (e.g., "K-DIGITAL")
    facilityImageUrl?: string;
    facilityImageUrl2?: string;
    facilityImageUrl3?: string;
    facilityImageUrl4?: string;
}
