'use client'

import { useState } from 'react'

import { LuAward, LuBookOpen, LuStar, LuUsers } from 'react-icons/lu'

import { useAnalyticsReportQuery } from '../../hooks/use-analytics'
import { useDashboardStats } from '../../hooks/use-dashboard-stats'
import { ClickRankingSection } from './click-ranking-section'
import { DeviceDonutChart } from './device-donut-chart'
import { DistributionDonutChart } from './distribution-donut-chart'
import { EngagementCard } from './engagement-card'
import { EventStatsSection } from './event-stats-section'
import { PopularSearchTermsCard } from './popular-search-terms-card'
import { PeriodToggle, type Period } from './shared/period-toggle'
import { StatCard } from './stat-card'
import { TrafficSourceChart } from './traffic-source-chart'
import { VisitorLineChart } from './visitor-line-chart'

export function AdminDashboard() {
  const [period, setPeriod] = useState<Period>(7)
  const { stats, pendingCounts, memberDistribution, isLoading } = useDashboardStats()
  const { data: analyticsReport, isLoading: isAnalyticsLoading } = useAnalyticsReportQuery(period)

  // Stat cards configuration with accent colors
  const statCards = [
    {
      title: '회원관리',
      value: stats.members,
      icon: LuUsers,
      subtext: pendingCounts.organizations > 0 ? `기관 대기중: ${pendingCounts.organizations}` : undefined,
      accentColor: 'lime' as const,
    },
    {
      title: '강의관리',
      value: stats.lectures,
      icon: LuBookOpen,
      subtext: pendingCounts.lectures > 0 ? `대기중: ${pendingCounts.lectures}` : undefined,
      accentColor: 'cyan' as const,
    },
    {
      title: '수료증관리',
      value: stats.certificates,
      icon: LuAward,
      subtext: pendingCounts.certificates > 0 ? `대기중: ${pendingCounts.certificates}` : undefined,
      accentColor: 'magenta' as const,
    },
    {
      title: '리뷰관리',
      value: stats.reviews,
      icon: LuStar,
      subtext: pendingCounts.reviews > 0 ? `대기중: ${pendingCounts.reviews}` : undefined,
      accentColor: 'amber' as const,
    },
  ]

  // Member distribution chart data
  const distributionData = [
    { name: '일반 회원', value: memberDistribution.user, color: '#3b82f6' },
    { name: '기관 회원', value: memberDistribution.organization, color: '#10b981' },
    { name: '관리자', value: memberDistribution.admin, color: '#f59e0b' },
  ]

  return (
    <div className="dashboard-terminal flex flex-1 flex-col gap-4 sm:gap-6">
      {/* Header with Period Selector */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-foreground text-xl font-bold tracking-tight sm:text-2xl lg:text-3xl">대시보드</h1>
          <p className="text-muted-foreground mt-0.5 text-xs sm:mt-1 sm:text-sm">
            SW Campus 운영 현황을 한눈에 확인하세요
          </p>
        </div>
        <PeriodToggle period={period} onPeriodChange={setPeriod} />
      </div>

      {/* Bento Grid Layout */}
      <div className="grid auto-rows-[minmax(100px,auto)] grid-cols-2 gap-3 sm:auto-rows-[minmax(120px,auto)] sm:gap-4 lg:grid-cols-4">
        {/* Row 1: 4 Stat Cards (2x2 on mobile, 4 on desktop) */}
        {statCards.map((stat, index) => (
          <div key={stat.title} className="stagger-1" style={{ animationDelay: `${index * 0.1}s` }}>
            <StatCard
              title={stat.title}
              value={isLoading ? 0 : stat.value}
              icon={stat.icon}
              subtext={isLoading ? undefined : stat.subtext}
              accentColor={stat.accentColor}
            />
          </div>
        ))}

        {/* Row 2: Visitor Chart (full width on mobile) + Engagement Card */}
        <div className="col-span-2 lg:col-span-3 lg:row-span-2">
          <VisitorLineChart report={analyticsReport} isLoading={isAnalyticsLoading} period={period} />
        </div>

        <div className="col-span-2 sm:col-span-1 lg:row-span-2">
          <EngagementCard
            period={period}
            averageEngagementTime={analyticsReport?.averageEngagementTime || 0}
            pageViews={analyticsReport?.pageViews || 0}
            sessions={analyticsReport?.sessions || 0}
            isLoading={isAnalyticsLoading}
          />
        </div>

        {/* Row 3: Distribution Charts (1 col on mobile, 2 on tablet, 4 on desktop) */}
        <div className="col-span-2 min-h-[280px] sm:col-span-1 sm:min-h-[320px]">
          <DeviceDonutChart data={analyticsReport?.deviceStats} isLoading={isAnalyticsLoading} />
        </div>

        <div className="col-span-2 min-h-[280px] sm:col-span-1 sm:min-h-[320px]">
          <TrafficSourceChart period={period} />
        </div>

        <div className="col-span-2 min-h-[280px] sm:col-span-1 sm:min-h-[320px]">
          <DistributionDonutChart data={distributionData} isLoading={isLoading} />
        </div>

        <div className="col-span-2 min-h-[280px] sm:col-span-1 sm:min-h-[320px]">
          <PopularSearchTermsCard period={period} />
        </div>

        {/* Row 4: Click Rankings (full width) */}
        <div className="col-span-2 lg:col-span-4">
          <ClickRankingSection period={period} />
        </div>

        {/* Row 5: Event Stats (stacked on mobile, side by side on tablet+) */}
        <div className="col-span-2 lg:col-span-4">
          <div className="grid h-full grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
            <EventStatsSection period={period} />
          </div>
        </div>
      </div>
    </div>
  )
}
