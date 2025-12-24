'use client'

import { useState } from 'react'

import { LuAward, LuBookOpen, LuStar, LuUsers } from 'react-icons/lu'

import { useAnalyticsReportQuery } from '../hooks/useAnalytics'
import { useDashboardStats } from '../hooks/useDashboardStats'
import { ClickRankingSection } from './ClickRankingSection'
import { DeviceDonutChart } from './DeviceDonutChart'
import { DistributionDonutChart } from './DistributionDonutChart'
import { EngagementCard } from './EngagementCard'
import { EventStatsSection } from './EventStatsSection'
import { StatCard } from './StatCard'
import { VisitorLineChart } from './VisitorLineChart'

export function AdminDashboard() {
  const [period, setPeriod] = useState<7 | 30>(7)
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
    { name: '일반 회원', value: memberDistribution.user, color: '#3b82f6' }, // Blue
    { name: '기관 회원', value: memberDistribution.organization, color: '#10b981' }, // Emerald
    { name: '관리자', value: memberDistribution.admin, color: '#f59e0b' }, // Amber
  ]

  return (
    <div className="flex flex-1 flex-col gap-6">
      {/* Header */}
      <h1 className="text-foreground text-2xl font-bold">대시보드</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
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

      {/* Charts Section */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* 상단: 방문자 차트 (전체 너비) */}
        <div className="col-span-1 lg:col-span-3">
          <VisitorLineChart
            report={analyticsReport}
            isLoading={isAnalyticsLoading}
            period={period}
            setPeriod={setPeriod}
          />
        </div>

        {/* 하단: 통계 및 도넛 차트들 (3열) */}
        <EngagementCard
          period={period}
          averageEngagementTime={analyticsReport?.averageEngagementTime || 0}
          pageViews={analyticsReport?.pageViews || 0}
          sessions={analyticsReport?.sessions || 0}
          isLoading={isAnalyticsLoading}
        />
        <DeviceDonutChart data={analyticsReport?.deviceStats} isLoading={isAnalyticsLoading} />
        <DistributionDonutChart data={distributionData} isLoading={isLoading} />
      </div>

      {/* Event Stats Section - 이벤트 통계 */}
      <EventStatsSection />

      {/* Click Ranking Section - 클릭 순위 */}
      <ClickRankingSection />
    </div>
  )
}
