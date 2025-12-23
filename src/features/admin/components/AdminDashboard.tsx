'use client'

import { LuAward, LuBookOpen, LuStar, LuUsers } from 'react-icons/lu'

import { useDashboardStats } from '../hooks/useDashboardStats'
import { DistributionDonutChart } from './DistributionDonutChart'
import { FeatureCard } from './FeatureCard'
import { MemberStatusTable } from './MemberStatusTable'
import { StatCard } from './StatCard'
import { VisitorLineChart } from './VisitorLineChart'

const features = [
  {
    title: '회원관리',
    description:
      "Body text for whatever you'd like to say. Add main takeaway points, quotes, anecdotes, or even a very very short story.",
    icon: LuUsers,
  },
  {
    title: '강의관리',
    description:
      "Body text for whatever you'd like to say. Add main takeaway points, quotes, anecdotes, or even a very very short story.",
    icon: LuBookOpen,
  },
  {
    title: '수료증관리',
    description:
      "Body text for whatever you'd like to say. Add main takeaway points, quotes, anecdotes, or even a very very short story.",
    icon: LuAward,
  },
  {
    title: '리뷰관리',
    description:
      "Body text for whatever you'd like to say. Add main takeaway points, quotes, anecdotes, or even a very very short story.",
    icon: LuStar,
  },
]

export function AdminDashboard() {
  const { stats, pendingCounts, memberDistribution, isLoading } = useDashboardStats()

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
    { name: '일반 회원', value: memberDistribution.user, color: 'hsl(var(--chart-1))' },
    { name: '기관 회원', value: memberDistribution.organization, color: 'hsl(var(--chart-2))' },
    { name: '관리자', value: memberDistribution.admin, color: 'hsl(var(--chart-3))' },
  ]

  return (
    <div className="flex flex-col gap-6">
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
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <VisitorLineChart />
        <DistributionDonutChart data={distributionData} isLoading={isLoading} />
      </div>
      Feature Cards
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {features.map(feature => (
          <FeatureCard
            key={feature.title}
            title={feature.title}
            description={feature.description}
            icon={feature.icon}
          />
        ))}
      </div>
      {/* Member Status Table */}
      <MemberStatusTable />
    </div>
  )
}
