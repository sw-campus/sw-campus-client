'use client'

import { Bar, CartesianGrid, ComposedChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

import { AnalyticsReport } from '../../api/analyticsApi'
import { Period } from './shared/PeriodToggle'

interface VisitorLineChartProps {
  report?: AnalyticsReport
  isLoading: boolean
  period: Period
}

export function VisitorLineChart({ report, isLoading, period }: VisitorLineChartProps) {
  // 일별 데이터를 차트용으로 변환
  const chartData =
    report?.dailyStats?.map(stat => ({
      date:
        period === 7
          ? new Date(stat.date).toLocaleDateString('ko-KR', { weekday: 'short' })
          : new Date(stat.date).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' }),
      visitors: stat.totalUsers,
      newVisitors: stat.newUsers,
    })) ?? []

  const getPeriodLabel = (p: Period) => {
    switch (p) {
      case 1:
        return '일간'
      case 7:
        return '주간'
      case 30:
        return '월간'
      default:
        return '주간'
    }
  }

  const periodLabel = getPeriodLabel(period)

  if (isLoading) {
    return (
      <Card className="bg-card">
        <CardHeader>
          <CardTitle className="text-foreground">{periodLabel} 방문자수</CardTitle>
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
          <CardTitle className="text-foreground whitespace-nowrap">{periodLabel} 방문자수</CardTitle>
        </div>
        <div className="text-muted-foreground flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="h-2.5 w-2.5 rounded-full bg-[hsl(var(--primary))]" />
            <span>
              총 방문자: <strong className="text-foreground">{report?.totalUsers?.toLocaleString() ?? 0}</strong>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2.5 w-2.5 rounded-full bg-[#10b981]" />
            <span>
              신규 방문자: <strong className="text-foreground">{report?.newUsers?.toLocaleString() ?? 0}</strong>
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={200}>
            <ComposedChart data={chartData}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="hsl(var(--border))" />
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
                formatter={(value, name) => {
                  const label = name === 'visitors' ? '방문자' : '신규 방문자'
                  return [`${value ?? 0}`, label]
                }}
              />
              <Bar dataKey="visitors" fill="hsl(var(--primary))" barSize={20} radius={[4, 4, 0, 0]} />
              <Line
                type="monotone"
                dataKey="newVisitors"
                stroke="#10b981" // Emerald-500
                strokeWidth={2}
                dot={period === 7 ? { fill: '#10b981' } : false}
              />
            </ComposedChart>
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
