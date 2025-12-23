import { useCertificateStats } from './useCertificates'
import { useLectureStatsQuery } from './useLectures'
import { useMemberStatsQuery } from './useMembers'
import { useOrganizationStatsQuery } from './useOrganizations'
import { useReviewStats } from './useReviews'

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
 * 서버 API를 사용하여 각 통계를 조회
 */
export function useDashboardStats() {
  // 회원 통계 (서버 API)
  const memberStatsQuery = useMemberStatsQuery()

  // 강의 통계 (서버 API)
  const lectureStatsQuery = useLectureStatsQuery()

  // 기관 통계 (서버 API)
  const organizationStatsQuery = useOrganizationStatsQuery()

  // 수료증 통계 (서버 API)
  const certificateStatsQuery = useCertificateStats()

  // 리뷰 통계 (서버 API)
  const reviewStatsQuery = useReviewStats()

  // 총 개수
  const stats: DashboardStats = {
    members: memberStatsQuery.data?.total ?? 0,
    lectures: lectureStatsQuery.data?.total ?? 0,
    certificates: certificateStatsQuery.data?.total ?? 0,
    reviews: reviewStatsQuery.data?.total ?? 0,
  }

  // 승인 대기 건수
  const pendingCounts: PendingCounts = {
    organizations: organizationStatsQuery.data?.pending ?? 0,
    lectures: lectureStatsQuery.data?.pending ?? 0,
    certificates: certificateStatsQuery.data?.pending ?? 0,
    reviews: reviewStatsQuery.data?.pending ?? 0,
  }

  // 회원 역할별 분포
  const memberDistribution: MemberDistribution = {
    user: memberStatsQuery.data?.user ?? 0,
    organization: memberStatsQuery.data?.organization ?? 0,
    admin: memberStatsQuery.data?.admin ?? 0,
  }

  const isLoading =
    memberStatsQuery.isLoading ||
    lectureStatsQuery.isLoading ||
    organizationStatsQuery.isLoading ||
    certificateStatsQuery.isLoading ||
    reviewStatsQuery.isLoading

  return {
    stats,
    pendingCounts,
    memberDistribution,
    isLoading,
  }
}
