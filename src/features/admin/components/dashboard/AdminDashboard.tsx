'use client'

import { useState } from 'react'

import { LuAward, LuBookOpen, LuStar, LuUsers } from 'react-icons/lu'

import { useAnalyticsReportQuery } from '../../hooks/useAnalytics'
import { useDashboardStats } from '../../hooks/useDashboardStats'
import { ClickRankingSection } from './ClickRankingSection'
import { DeviceDonutChart } from './DeviceDonutChart'
import { DistributionDonutChart } from './DistributionDonutChart'
import { EngagementCard } from './EngagementCard'
import { EventStatsSection } from './EventStatsSection'
import { PopularSearchTermsCard } from './PopularSearchTermsCard'
import { StatCard } from './StatCard'
import { VisitorLineChart } from './VisitorLineChart'
import { PeriodToggle, type Period } from './shared/PeriodToggle'

export function AdminDashboard() {
  const [period, setPeriod] = useState<Period>(7)
  const { stats, pendingCounts, memberDistribution, isLoading } = useDashboardStats()
  const { data: analyticsReport, isLoading: isAnalyticsLoading } = useAnalyticsReportQuery(period)

  // 동적 stats 데이터 (서브텍스트로 승인 대기 건수 표시)
  const statCards = [
    {
      title: '회원관리',
      value: stats.members,
      icon: LuUsers,
      subtext: pendingCounts.organizations > 0 ? `기관 승인 대기: ${pendingCounts.organizations}` : undefined,
    },
    {
      title: '강의관리',
      value: stats.lectures,
      icon: LuBookOpen,
      subtext: pendingCounts.lectures > 0 ? `승인 대기: ${pendingCounts.lectures}` : undefined,
    },
    {
      title: '수료증관리',
      value: stats.certificates,
      icon: LuAward,
      subtext: pendingCounts.certificates > 0 ? `승인 대기: ${pendingCounts.certificates}` : undefined,
    },
    {
      title: '리뷰관리',
      value: stats.reviews,
      icon: LuStar,
      subtext: pendingCounts.reviews > 0 ? `승인 대기: ${pendingCounts.reviews}` : undefined,
    },
  ]

  // 회원 분포 차트 데이터
  const distributionData = [
    { name: '일반 회원', value: memberDistribution.user, color: '#3b82f6' },
    { name: '기관 회원', value: memberDistribution.organization, color: '#10b981' },
    { name: '관리자', value: memberDistribution.admin, color: '#f59e0b' },
  ]

  return (
    <div className="flex flex-1 flex-col gap-6">
      {/* Header with Global Period Selector */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-foreground text-2xl font-bold">대시보드</h1>
        <PeriodToggle period={period} onPeriodChange={setPeriod} />
      </div>

      {/* Section 1: 핵심 지표 - 4열 그리드 */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {statCards.map(stat => (
          <StatCard
            key={stat.title}
            title={stat.title}
            value={isLoading ? 0 : stat.value}
            icon={stat.icon}
            subtext={isLoading ? undefined : stat.subtext}
          />
        ))}
      </div>

      {/* Section 2: 트렌드 - 방문자 차트 (전체 너비) */}
      <VisitorLineChart report={analyticsReport} isLoading={isAnalyticsLoading} period={period} />

      {/* Section 3: 참여도 & 분포 - 3열 그리드 */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* 참여도 카드 */}
        <EngagementCard
          period={period}
          averageEngagementTime={analyticsReport?.averageEngagementTime || 0}
          pageViews={analyticsReport?.pageViews || 0}
          sessions={analyticsReport?.sessions || 0}
          isLoading={isAnalyticsLoading}
        />
        {/* 디바이스 분포 */}
        <DeviceDonutChart data={analyticsReport?.deviceStats} isLoading={isAnalyticsLoading} />
        {/* 회원 분포 */}
        <DistributionDonutChart data={distributionData} isLoading={isLoading} />
      </div>

      {/* Section 4: 랭킹 - 배너/강의 클릭 순위 (전체 너비) */}
      <ClickRankingSection period={period} />

      {/* Section 5: 인기 검색어 + 이벤트 통계 */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <PopularSearchTermsCard period={period} />
        <EventStatsSection period={period} />
      </div>
    </div>
  )
}
