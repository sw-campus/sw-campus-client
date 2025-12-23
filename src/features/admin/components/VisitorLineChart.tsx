'use client'

import { useState } from 'react'

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

import { useAnalyticsReportQuery } from '../hooks/useAnalytics'

type Period = 7 | 30

export function VisitorLineChart() {
  const [period, setPeriod] = useState<Period>(7)
  const { data: report, isLoading } = useAnalyticsReportQuery(period)

  // 일별 데이터를 차트용으로 변환
  const chartData =
    report?.dailyStats?.map(stat => ({
      date:
        period === 7
          ? new Date(stat.date).toLocaleDateString('ko-KR', { weekday: 'short' })
          : new Date(stat.date).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' }),
      visitors: stat.activeUsers,
      pageViews: stat.pageViews,
    })) ?? []

  if (isLoading) {
    return (
      <Card className="bg-card">
        <CardHeader>
          <CardTitle className="text-foreground">{period === 7 ? '주간' : '월간'} 방문자수</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex h-[200px] items-center justify-center">
            <div className="text-muted-foreground">로딩 중...</div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-card">
      <CardHeader className="flex flex-col gap-3 pb-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <CardTitle className="text-foreground whitespace-nowrap">{period === 7 ? '주간' : '월간'} 방문자수</CardTitle>
          <div className="flex rounded-lg bg-gray-100 p-1">
            <button
              onClick={() => setPeriod(7)}
              className={`rounded-md px-3 py-1 text-sm font-medium transition-colors ${
                period === 7 ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              7일
            </button>
            <button
              onClick={() => setPeriod(30)}
              className={`rounded-md px-3 py-1 text-sm font-medium transition-colors ${
                period === 30 ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              30일
            </button>
          </div>
        </div>
        <div className="text-muted-foreground flex items-center gap-4 text-sm">
          <span>
            총 방문자: <strong className="text-foreground">{report?.totalUsers?.toLocaleString() ?? 0}</strong>
          </span>
          <span>
            페이지뷰: <strong className="text-foreground">{report?.pageViews?.toLocaleString() ?? 0}</strong>
          </span>
        </div>
      </CardHeader>
      <CardContent>
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={chartData}>
              <XAxis
                dataKey="date"
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                allowDecimals={false}
                domain={[0, 'auto']}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
                formatter={(value, name) => [`${value ?? 0}`, name === 'visitors' ? '방문자' : '페이지뷰']}
              />
              <Line
                type="monotone"
                dataKey="visitors"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={period === 7 ? { fill: 'hsl(var(--primary))' } : false}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex h-[200px] items-center justify-center">
            <div className="text-muted-foreground">데이터가 없습니다</div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
