'use client'

import { LuAward, LuBookOpen, LuStar, LuUsers } from 'react-icons/lu'

import { DistributionDonutChart } from './DistributionDonutChart'
import { FeatureCard } from './FeatureCard'
import { MemberStatusTable } from './MemberStatusTable'
import { StatCard } from './StatCard'
import { VisitorLineChart } from './VisitorLineChart'

const stats = [
  { title: '회원관리', value: 2500, icon: LuUsers },
  { title: '강의관리', value: 382, icon: LuBookOpen },
  { title: '수료증관리', value: 156, icon: LuAward },
  { title: '리뷰관리', value: 94, icon: LuStar },
]

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
  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <h1 className="text-foreground text-2xl font-bold">대시보드</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(stat => (
          <StatCard key={stat.title} title={stat.title} value={stat.value} icon={stat.icon} />
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <VisitorLineChart />
        <DistributionDonutChart />
      </div>

      {/* Feature Cards */}
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
