'use client'

import { Area, Bar, CartesianGrid, ComposedChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

import { AnalyticsReport } from '../../api/analytics-api'
import { Period } from './shared/period-toggle'

interface VisitorLineChartProps {
  report?: AnalyticsReport
  isLoading: boolean
  period: Period
}

export function VisitorLineChart({ report, isLoading, period }: VisitorLineChartProps) {
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
        return '오늘'
      case 7:
        return '이번 주'
      case 30:
        return '이번 달'
      default:
        return '이번 주'
    }
  }

  const periodLabel = getPeriodLabel(period)

  if (isLoading) {
    return (
      <div className="bento-card relative h-full overflow-hidden p-4 md:p-6">
        <div className="grid-pattern absolute inset-0 opacity-30" />
        <div className="relative z-10">
          <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="bg-muted h-5 w-28 animate-pulse rounded-lg md:h-6 md:w-32" />
            <div className="flex gap-2 md:gap-4">
              <div className="bg-muted h-4 w-20 animate-pulse rounded md:w-24" />
              <div className="bg-muted h-4 w-20 animate-pulse rounded md:w-24" />
            </div>
          </div>
          <div className="flex h-[200px] items-center justify-center md:h-[280px]">
            <div className="flex flex-col items-center gap-3">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-lime-500 border-t-transparent md:h-8 md:w-8" />
              <span className="text-muted-foreground text-xs md:text-sm">데이터 로딩 중...</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Calculate bar size based on period and screen (will use smaller on mobile via CSS)
  const getBarSize = () => {
    if (period === 7) return 20
    if (period === 30) return 8
    return 16
  }

  return (
    <div className="bento-card group relative h-full overflow-hidden p-3 md:p-4 lg:p-6">
      {/* Gradient overlay on hover */}
      <div className="absolute inset-0 bg-linear-to-br from-lime-500/5 to-cyan-500/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      <div className="grid-pattern absolute inset-0 opacity-30" />

      <div className="relative z-10 flex h-full flex-col">
        {/* Header */}
        <div className="mb-3 flex flex-col gap-2 md:mb-4 md:flex-row md:items-center md:justify-between lg:mb-6">
          <div className="flex items-center gap-2 md:gap-3">
            <div className="relative">
              <div className="absolute inset-0 animate-ping rounded-full bg-lime-500/30" />
              <div className="relative h-2 w-2 rounded-full bg-lime-500 md:h-3 md:w-3" />
            </div>
            <div>
              <h3 className="text-foreground text-sm font-bold tracking-tight md:text-lg lg:text-xl">{periodLabel} 방문자 현황</h3>
              <p className="text-muted-foreground hidden text-xs md:block">실시간 트래픽 모니터링</p>
            </div>
          </div>

          {/* Stats badges */}
          <div className="flex flex-wrap items-center gap-2 md:gap-3">
            <div className="flex items-center gap-1.5 rounded-full bg-lime-500/10 px-2 py-1 md:gap-2 md:px-3 md:py-1.5">
              <div className="h-2 w-2 rounded-full bg-lime-500 md:h-2.5 md:w-2.5" />
              <span className="text-muted-foreground text-[10px] md:text-xs">총 방문자</span>
              <span className="font-mono-data text-foreground text-xs font-bold md:text-sm">
                {report?.totalUsers?.toLocaleString() ?? 0}
              </span>
            </div>
            <div className="flex items-center gap-1.5 rounded-full bg-cyan-500/10 px-2 py-1 md:gap-2 md:px-3 md:py-1.5">
              <div className="h-2 w-2 rounded-full bg-cyan-500 md:h-2.5 md:w-2.5" />
              <span className="text-muted-foreground text-[10px] md:text-xs">신규 방문자</span>
              <span className="font-mono-data text-foreground text-xs font-bold md:text-sm">
                {report?.newUsers?.toLocaleString() ?? 0}
              </span>
            </div>
          </div>
        </div>

        {/* Chart */}
        {chartData.length > 0 ? (
          <div className="min-h-0 flex-1">
            <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={180}>
              <ComposedChart data={chartData} margin={{ top: 5, right: 5, left: -15, bottom: 0 }}>
                <defs>
                  {/* Gradient for bars */}
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#84cc16" stopOpacity={0.9} />
                    <stop offset="100%" stopColor="#84cc16" stopOpacity={0.4} />
                  </linearGradient>
                  {/* Gradient for area */}
                  <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#06b6d4" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#06b6d4" stopOpacity={0} />
                  </linearGradient>
                  {/* Glow filter */}
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                    <feMerge>
                      <feMergeNode in="coloredBlur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.5} />

                <XAxis
                  dataKey="date"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                  dy={5}
                  interval="preserveStartEnd"
                />

                <YAxis
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                  allowDecimals={false}
                  domain={[0, 'auto']}
                  dx={-5}
                  width={35}
                />

                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="rounded-lg border border-white/20 bg-popover/95 p-2 shadow-xl backdrop-blur-sm md:rounded-xl md:p-3">
                          <p className="text-muted-foreground mb-1 text-[10px] font-medium md:mb-2 md:text-xs">{label}</p>
                          <div className="space-y-0.5 md:space-y-1">
                            <div className="flex items-center gap-1.5 md:gap-2">
                              <div className="h-1.5 w-1.5 rounded-full bg-lime-500 md:h-2 md:w-2" />
                              <span className="text-foreground text-xs md:text-sm">
                                방문자: <span className="font-mono-data font-bold">{payload[0]?.value?.toLocaleString()}</span>
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5 md:gap-2">
                              <div className="h-1.5 w-1.5 rounded-full bg-cyan-500 md:h-2 md:w-2" />
                              <span className="text-foreground text-xs md:text-sm">
                                신규: <span className="font-mono-data font-bold">{payload[1]?.value?.toLocaleString()}</span>
                              </span>
                            </div>
                          </div>
                        </div>
                      )
                    }
                    return null
                  }}
                />

                <Bar dataKey="visitors" fill="url(#barGradient)" radius={[4, 4, 0, 0]} barSize={getBarSize()} />

                <Area
                  type="monotone"
                  dataKey="newVisitors"
                  stroke="#06b6d4"
                  strokeWidth={2}
                  fill="url(#areaGradient)"
                  dot={false}
                  activeDot={{
                    fill: '#06b6d4',
                    strokeWidth: 2,
                    stroke: '#ffffff',
                    r: 4,
                  }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center gap-2 md:gap-3">
            <div className="bg-muted rounded-full p-3 md:p-4">
              <svg className="text-muted-foreground h-6 w-6 md:h-8 md:w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <span className="text-muted-foreground text-xs md:text-sm">데이터가 없습니다</span>
          </div>
        )}
      </div>
    </div>
  )
}
