'use client'

import { LuActivity, LuExternalLink, LuMousePointerClick, LuShare2 } from 'react-icons/lu'
import { Bar, BarChart, LabelList, ResponsiveContainer, XAxis, YAxis } from 'recharts'

import { cn } from '@/lib/utils'

import { useEventStatsQuery } from '../../hooks/use-analytics'
import { type Period } from './shared/period-toggle'

interface EventStatsSectionProps {
  period?: Period
}

export function EventStatsSection({ period = 7 }: EventStatsSectionProps) {
  const { data: eventStats, isLoading } = useEventStatsQuery(period)

  const bannerData = [
    { name: '대배너', value: eventStats?.bigBannerClicks ?? 0, fill: 'url(#barGrad1)' },
    { name: '중배너', value: eventStats?.middleBannerClicks ?? 0, fill: 'url(#barGrad2)' },
    { name: '소배너', value: eventStats?.smallBannerClicks ?? 0, fill: 'url(#barGrad3)' },
  ]

  const actionStats = [
    {
      title: '배너 클릭',
      value: eventStats?.bannerClicks ?? 0,
      icon: LuMousePointerClick,
      color: 'text-orange-600',
      bg: 'bg-orange-500/10',
      gradient: 'from-orange-500/20 to-amber-500/10',
    },
    {
      title: '수강 신청',
      value: eventStats?.applyButtonClicks ?? 0,
      icon: LuExternalLink,
      color: 'text-blue-600',
      bg: 'bg-blue-500/10',
      gradient: 'from-blue-500/20 to-indigo-500/10',
    },
    {
      title: '공유하기',
      value: eventStats?.shareClicks ?? 0,
      icon: LuShare2,
      color: 'text-emerald-600',
      bg: 'bg-emerald-500/10',
      gradient: 'from-emerald-500/20 to-teal-500/10',
    },
  ]

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
      <>
        <div className="bento-card relative h-full overflow-hidden p-3 sm:p-5">
          <div className="grid-pattern absolute inset-0 opacity-30" />
          <div className="relative z-10 flex h-full flex-col">
            <div className="bg-muted mb-3 h-4 w-24 animate-pulse rounded sm:mb-4 sm:h-5 sm:w-32" />
            <div className="flex flex-1 items-center justify-center">
              <div className="bg-muted/50 h-32 w-full animate-pulse rounded-lg sm:h-48" />
            </div>
          </div>
        </div>
        <div className="bento-card relative h-full overflow-hidden p-3 sm:p-5">
          <div className="grid-pattern absolute inset-0 opacity-30" />
          <div className="relative z-10 flex h-full flex-col">
            <div className="bg-muted mb-3 h-4 w-24 animate-pulse rounded sm:mb-4 sm:h-5 sm:w-32" />
            <div className="flex flex-1 flex-col gap-2 sm:gap-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-muted/50 h-12 animate-pulse rounded-lg sm:h-16 sm:rounded-xl" />
              ))}
            </div>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      {/* 배너 클릭 차트 */}
      <div className="bento-card group relative h-full overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-orange-500/5 via-transparent to-amber-500/5" />
        <div className="grid-pattern absolute inset-0 opacity-30" />

        <div className="absolute -top-6 -right-6 h-20 w-20 rounded-full bg-orange-500/10 blur-2xl sm:-top-10 sm:-right-10 sm:h-28 sm:w-28" />

        <div className="relative z-10 flex h-full flex-col p-3 sm:p-5">
          <div className="mb-3 flex items-center justify-between sm:mb-4">
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-orange-500/10 p-1.5 sm:p-2">
                <LuActivity className="h-3.5 w-3.5 text-orange-600 sm:h-4 sm:w-4" />
              </div>
              <div>
                <h3 className="text-foreground text-xs font-bold sm:text-sm lg:text-base">배너 클릭 통계</h3>
                <p className="text-muted-foreground text-[9px] sm:text-[10px] lg:text-xs">{periodLabel} 기준</p>
              </div>
            </div>
          </div>

          <div className="flex-1">
            <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={100}>
              <BarChart data={bannerData} layout="vertical" margin={{ left: 0, right: 45 }}>
                <defs>
                  <linearGradient id="barGrad1" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#f97316" stopOpacity={1} />
                    <stop offset="100%" stopColor="#f97316" stopOpacity={0.6} />
                  </linearGradient>
                  <linearGradient id="barGrad2" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#fb923c" stopOpacity={1} />
                    <stop offset="100%" stopColor="#fb923c" stopOpacity={0.6} />
                  </linearGradient>
                  <linearGradient id="barGrad3" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#fdba74" stopOpacity={1} />
                    <stop offset="100%" stopColor="#fdba74" stopOpacity={0.6} />
                  </linearGradient>
                  <filter id="bar-shadow">
                    <feDropShadow dx="0" dy="1" stdDeviation="2" floodOpacity="0.1" />
                  </filter>
                </defs>
                <XAxis type="number" hide />
                <YAxis
                  type="category"
                  dataKey="name"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={13}
                  width={65}
                  tickLine={false}
                  axisLine={false}
                />
                <Bar dataKey="value" radius={[0, 8, 8, 0]} barSize={24} filter="url(#bar-shadow)">
                  <LabelList
                    dataKey="value"
                    position="right"
                    formatter={value => (typeof value === 'number' ? value.toLocaleString() : String(value))}
                    style={{
                      fill: 'hsl(var(--foreground))',
                      fontSize: 13,
                      fontWeight: 600,
                    }}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 사용자 액션 통계 */}
      <div className="bento-card group relative h-full overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-blue-500/5 via-transparent to-emerald-500/5" />
        <div className="grid-pattern absolute inset-0 opacity-30" />

        <div className="absolute -bottom-4 -left-4 h-16 w-16 rounded-full bg-blue-500/10 blur-2xl sm:-bottom-8 sm:-left-8 sm:h-24 sm:w-24" />

        <div className="relative z-10 flex h-full flex-col p-3 sm:p-5">
          <div className="mb-3 flex items-center justify-between sm:mb-4">
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-blue-500/10 p-1.5 sm:p-2">
                <LuMousePointerClick className="h-3.5 w-3.5 text-blue-600 sm:h-4 sm:w-4" />
              </div>
              <div>
                <h3 className="text-foreground text-xs font-bold sm:text-sm lg:text-base">사용자 액션</h3>
                <p className="text-muted-foreground text-[9px] sm:text-[10px] lg:text-xs">{periodLabel} 합계</p>
              </div>
            </div>
          </div>

          <div className="flex flex-1 flex-col gap-2 sm:gap-3 lg:gap-4">
            {actionStats.map((stat, index) => (
              <div
                key={stat.title}
                className={cn(
                  'group/item relative overflow-hidden rounded-lg p-2.5 transition-all sm:rounded-xl sm:p-4 lg:p-5',
                  'bg-card/50 hover:bg-card/80 hover:shadow-md',
                )}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Gradient overlay */}
                <div className={cn('absolute inset-0 bg-linear-to-r opacity-50', stat.gradient)} />

                <div className="relative flex items-center justify-between">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className={cn('rounded-md p-1.5 sm:rounded-lg sm:p-2', stat.bg)}>
                      <stat.icon className={cn('h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5', stat.color)} />
                    </div>
                    <span className="text-foreground text-xs font-medium sm:text-sm lg:text-base">{stat.title}</span>
                  </div>
                  <span className="font-mono-data text-foreground text-base font-bold sm:text-xl lg:text-2xl">
                    {stat.value.toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
