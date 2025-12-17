'use client'

import { MOCK_REVIEWS } from '../api/mockReviews'
import { useOrganizationDetailQuery, useOrganizationLecturesQuery } from '../hooks/useOrganizations'
import { OrganizationDetail } from './OrganizationDetail'

interface OrganizationDetailPageClientProps {
  organizationId: number
}

/**
 * 기관 상세 페이지 클라이언트 컴포넌트
 * API 연동을 통해 실제 데이터 표시, 리뷰는 mock 데이터 사용
 */
export function OrganizationDetailPageClient({ organizationId }: OrganizationDetailPageClientProps) {
  // 기관 상세 정보 조회
  const { data: organization, isLoading: isOrgLoading } = useOrganizationDetailQuery(organizationId)

  // 기관별 강의 목록 조회
  const { data: courses = [] } = useOrganizationLecturesQuery(organizationId)

  // 로딩 중
  if (isOrgLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="border-primary h-8 w-8 animate-spin rounded-full border-4 border-t-transparent" />
      </div>
    )
  }

  // 데이터 없음
  if (!organization) {
    return (
      <div className="text-muted-foreground py-20 text-center">
        <p className="text-lg">기관 정보를 찾을 수 없습니다.</p>
      </div>
    )
  }

  return <OrganizationDetail organization={organization} lectures={courses} reviews={MOCK_REVIEWS} />
}
