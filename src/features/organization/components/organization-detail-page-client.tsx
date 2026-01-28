'use client'

import { useQuery } from '@tanstack/react-query'

import { getOrganizationReviews } from '@/features/lecture/api/review-api.client'

import { fetchOrganizationLectures } from '../api/organization-api'
import { useOrganizationDetailQuery } from '../hooks/use-organizations'
import type { OrganizationDetail as OrganizationDetailType } from '../types/organization.type'
import { OrganizationDetail } from './organization-detail'

interface OrganizationDetailPageClientProps {
  organizationId: number
  initialData?: OrganizationDetailType
}

/**
 * 기관 상세 페이지 클라이언트 컴포넌트
 * API 연동을 통해 실제 데이터 표시
 */
export function OrganizationDetailPageClient({ organizationId, initialData }: OrganizationDetailPageClientProps) {
  // 기관 상세 정보 조회
  const { data: organization, isLoading: isOrgLoading } = useOrganizationDetailQuery(organizationId, initialData)

  // 기관별 후기 총 개수 조회 (탭 표시용 - 별도 queryKey 사용)
  const { data: reviewData } = useQuery({
    queryKey: ['organizationReviewsCount', organizationId],
    queryFn: () => getOrganizationReviews(organizationId, 0, 1, 'LATEST'),
    staleTime: 1000 * 60,
  })

  // 기관별 강의 총 개수 조회 (탭에 표시용)
  const { data: lectureData } = useQuery({
    queryKey: ['organization', organizationId, 'lectures', 0, 1, 'LATEST'],
    queryFn: () => fetchOrganizationLectures(organizationId, 0, 1, 'LATEST'),
    staleTime: 1000 * 60,
  })

  const totalReviews = reviewData?.totalCount ?? 0
  const totalLectures = lectureData?.page?.totalElements ?? 0

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

  return <OrganizationDetail organization={organization} totalReviews={totalReviews} totalLectures={totalLectures} />
}
