import { useLecturesQuery } from './useLectures'
import { useMembersQuery } from './useMembers'
import { useOrganizationsQuery } from './useOrganizations'
import { useReviewsQuery } from './useReviews'

export interface DashboardStats {
  members: number
  lectures: number
  certificates: number
  reviews: number
}

export interface PendingCounts {
  organizations: number
  lectures: number
  certificates: number
  reviews: number
}

export interface MemberDistribution {
  user: number
  organization: number
  admin: number
}

/**
 * 대시보드 통계 조회 Hook
 * 회원/강의/리뷰 총 개수, 승인 대기 건수, 회원 역할별 분포 반환
 */
export function useDashboardStats() {
  // 회원 - 역할 분포 계산을 위해 전체 조회
  const membersQuery = useMembersQuery('', 0, 1000)

  // 강의 - 전체
  const lecturesQuery = useLecturesQuery(undefined, undefined, 0)
  // 강의 - 승인 대기
  const lecturesPendingQuery = useLecturesQuery('PENDING', undefined, 0)

  // 리뷰 - 전체 (수료증 카운트도 여기서 추출)
  const reviewsQuery = useReviewsQuery(undefined, undefined, 0)
  // 리뷰 - 승인 대기
  const reviewsPendingQuery = useReviewsQuery('PENDING', undefined, 0)

  // 기관 - 승인 대기
  const organizationsPendingQuery = useOrganizationsQuery('PENDING', undefined, 0)

  const members = membersQuery.data?.content ?? []
  const memberCount = members.length
  const lectureCount = lecturesQuery.data?.page?.totalElements ?? 0

  // 수료증 카운트 - 모든 리뷰 행 기준
  const reviews = reviewsQuery.data?.content ?? []
  const certificateCount = reviews.length
  const certificatePendingCount = reviews.filter(r => r.certificateApprovalStatus === 'PENDING').length

  // 리뷰 카운트 - 수료증 승인된 리뷰만 (리뷰 관리는 수료증 승인 후에 진행)
  const reviewsWithApprovedCert = reviews.filter(r => r.certificateApprovalStatus === 'APPROVED')
  const reviewCount = reviewsWithApprovedCert.length
  const reviewPendingCount = reviewsWithApprovedCert.filter(r => r.reviewApprovalStatus === 'PENDING').length

  // 승인 대기 건수
  const pendingCounts: PendingCounts = {
    organizations: organizationsPendingQuery.data?.page?.totalElements ?? 0,
    lectures: lecturesPendingQuery.data?.page?.totalElements ?? 0,
    certificates: certificatePendingCount,
    reviews: reviewPendingCount,
  }

  // 회원 역할별 분포 계산
  const memberDistribution: MemberDistribution = {
    user: members.filter(m => m.role === 'USER').length,
    organization: members.filter(m => m.role === 'ORGANIZATION').length,
    admin: members.filter(m => m.role === 'ADMIN').length,
  }

  const stats: DashboardStats = {
    members: memberCount,
    lectures: lectureCount,
    certificates: certificateCount,
    reviews: reviewCount,
  }

  const isLoading =
    membersQuery.isLoading ||
    lecturesQuery.isLoading ||
    reviewsQuery.isLoading ||
    lecturesPendingQuery.isLoading ||
    reviewsPendingQuery.isLoading ||
    organizationsPendingQuery.isLoading

  return {
    stats,
    pendingCounts,
    memberDistribution,
    isLoading,
  }
}
