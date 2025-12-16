/**
 * API 응답과 매핑되는 기관 요약 정보 타입
 * 서버: OrganizationSummaryResponse
 */
export interface OrganizationSummary {
  id: number
  name: string
  logoUrl: string | null
  description: string
  recruitingLectureCount: number
}

/**
 * API 응답과 매핑되는 기관 상세 정보 타입
 * 서버: OrganizationResponse
 */
export interface OrganizationDetail {
  id: number
  userId: number
  name: string
  description: string | null
  certificateUrl: string | null
  govAuth: string | null
  facilityImageUrl: string | null
  facilityImageUrl2: string | null
  facilityImageUrl3: string | null
  facilityImageUrl4: string | null
  logoUrl: string | null
  homepage?: string | null // 기관 홈페이지 URL (optional)
}
