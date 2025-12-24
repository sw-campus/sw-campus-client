'use client'

import { useState } from 'react'

import { LuActivity, LuExternalLink, LuMousePointerClick, LuShare2 } from 'react-icons/lu'
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

import { useEventStatsQuery } from '../hooks/useAnalytics'
import { PeriodToggle, type Period } from './shared/PeriodToggle'

export function EventStatsSection() {
  const [period, setPeriod] = useState<Period>(7)
  const { data: eventStats, isLoading } = useEventStatsQuery(period)

  const bannerData = [
    { name: '대배너', value: eventStats?.bigBannerClicks ?? 0, fill: '#f97316' },
    { name: '중배너', value: eventStats?.middleBannerClicks ?? 0, fill: '#fb923c' },
    { name: '소배너', value: eventStats?.smallBannerClicks ?? 0, fill: '#fdba74' },
  ]

  const actionStats = [
    {
      title: '배너 클릭',
      value: eventStats?.bannerClicks ?? 0,
      icon: LuMousePointerClick,
      color: 'text-orange-500',
      bgColor: 'bg-orange-50',
    },
    {
      title: '수강 신청',
      value: eventStats?.applyButtonClicks ?? 0,
      icon: LuExternalLink,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50',
    },
    {
      title: '공유하기',
      value: eventStats?.shareClicks ?? 0,
      icon: LuShare2,
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-50',
    },
  ]

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card className="animate-pulse">
          <CardHeader>
            <div className="h-6 w-32 rounded bg-gray-200" />
          </CardHeader>
          <CardContent>
            <div className="h-[200px] rounded bg-gray-100" />
          </CardContent>
        </Card>
        <Card className="animate-pulse">
          <CardHeader>
            <div className="h-6 w-32 rounded bg-gray-200" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-16 rounded bg-gray-100" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      {/* 배너 클릭 차트 */}
      <Card className="bg-card">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-foreground flex items-center gap-2">
            <LuActivity className="h-5 w-5 text-orange-500" />
            배너 클릭 통계
          </CardTitle>
          <PeriodToggle period={period} onPeriodChange={setPeriod} />
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={bannerData} layout="vertical">
              <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} allowDecimals={false} />
              <YAxis type="category" dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} width={60} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
                formatter={value => [`${value ?? 0}회`, '클릭']}
              />
              <Bar dataKey="value" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* 주요 액션 통계 */}
      <Card className="bg-card">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-foreground">사용자 액션</CardTitle>
          <span className="text-muted-foreground text-sm">최근 {period}일</span>
        </CardHeader>
        <CardContent className="space-y-4">
          {actionStats.map(stat => (
            <div key={stat.title} className={`flex items-center justify-between rounded-xl ${stat.bgColor} p-4`}>
              <div className="flex items-center gap-3">
                <div className={`rounded-lg bg-white p-2 shadow-sm ${stat.color}`}>
                  <stat.icon className="h-5 w-5" />
                </div>
                <span className="font-medium text-gray-700">{stat.title}</span>
              </div>
              <span className="text-2xl font-bold text-gray-900">{stat.value.toLocaleString()}</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
