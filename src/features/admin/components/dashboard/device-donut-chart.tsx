'use client'

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'

import { LuMonitor, LuSmartphone, LuTablet } from 'react-icons/lu'

import { cn } from '@/lib/utils'

import { DeviceStat } from '../../api/analytics-api'

interface DeviceDonutChartProps {
  data?: DeviceStat[]
  isLoading?: boolean
}

const DEVICE_CONFIG = {
  desktop: {
    color: '#3b82f6',
    gradient: 'from-blue-500 to-indigo-600',
    bg: 'bg-blue-500/10',
    text: 'text-blue-600',
    icon: LuMonitor,
    label: '데스크톱',
  },
  mobile: {
    color: '#10b981',
    gradient: 'from-emerald-500 to-teal-600',
    bg: 'bg-emerald-500/10',
    text: 'text-emerald-600',
    icon: LuSmartphone,
    label: '모바일',
  },
  tablet: {
    color: '#f59e0b',
    gradient: 'from-amber-500 to-orange-600',
    bg: 'bg-amber-500/10',
    text: 'text-amber-600',
    icon: LuTablet,
    label: '태블릿',
  },
}

export function DeviceDonutChart({ data, isLoading }: DeviceDonutChartProps) {
  const chartData =
    data?.map(stat => {
      const key = stat.category.toLowerCase() as keyof typeof DEVICE_CONFIG
      const config = DEVICE_CONFIG[key] || DEVICE_CONFIG.desktop
      return {
        name: config.label,
        value: stat.activeUsers,
        color: config.color,
        config,
        key,
      }
    }) ?? []

  const total = chartData.reduce((sum, item) => sum + item.value, 0)

  if (isLoading) {
    return (
      <div className="bento-card relative h-full overflow-hidden p-3 sm:p-5">
        <div className="grid-pattern absolute inset-0 opacity-30" />
        <div className="relative z-10 flex h-full flex-col">
          <div className="bg-muted mb-3 h-4 w-20 animate-pulse rounded sm:mb-4 sm:h-5 sm:w-24" />
          <div className="flex flex-1 items-center justify-center">
            <div className="bg-muted h-28 w-28 animate-pulse rounded-full sm:h-36 sm:w-36" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bento-card group relative h-full overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-emerald-500/5" />
      <div className="grid-pattern absolute inset-0 opacity-30" />

      {/* Decorative glow */}
      <div className="absolute top-1/2 left-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/5 blur-2xl sm:h-32 sm:w-32" />

      <div className="relative z-10 flex h-full flex-col p-3 sm:p-5">
        {/* Header */}
        <div className="mb-2 flex items-center gap-2 sm:mb-3 lg:mb-4">
          <div className="rounded-lg bg-blue-500/10 p-1.5 sm:p-2">
            <LuMonitor className="h-3.5 w-3.5 text-blue-600 sm:h-4 sm:w-4" />
          </div>
          <h3 className="text-foreground text-xs font-bold sm:text-sm lg:text-base">기기별 접속</h3>
        </div>

        {/* Chart and Legend */}
        {chartData.length > 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 sm:gap-4">
            {/* Donut Chart with center label */}
            <div className="relative h-28 w-28 sm:h-36 sm:w-36 lg:h-44 lg:w-44">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <defs>
                    {chartData.map(entry => (
                      <linearGradient key={entry.key} id={`gradient-${entry.key}`} x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor={entry.color} stopOpacity={1} />
                        <stop offset="100%" stopColor={entry.color} stopOpacity={0.6} />
                      </linearGradient>
                    ))}
                    <filter id="donut-shadow">
                      <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.15" />
                    </filter>
                  </defs>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius="60%"
                    outerRadius="85%"
                    paddingAngle={3}
                    dataKey="value"
                    strokeWidth={0}
                    filter="url(#donut-shadow)"
                  >
                    {chartData.map(entry => (
                      <Cell key={entry.key} fill={`url(#gradient-${entry.key})`} />
                    ))}
                  </Pie>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload
                        return (
                          <div className="rounded-lg border border-white/20 bg-popover/95 px-2 py-1.5 shadow-xl backdrop-blur-sm sm:rounded-xl sm:px-3 sm:py-2">
                            <div className="flex items-center gap-1.5 sm:gap-2">
                              <div className="h-2 w-2 rounded-full sm:h-2.5 sm:w-2.5" style={{ backgroundColor: data.color }} />
                              <span className="text-foreground text-xs font-medium sm:text-sm">{data.name}</span>
                            </div>
                            <p className="font-mono-data text-foreground mt-0.5 text-base font-bold sm:mt-1 sm:text-lg">
                              {data.value.toLocaleString()}
                              <span className="text-muted-foreground ml-1 text-[10px] font-normal sm:text-xs">
                                ({total > 0 ? ((data.value / total) * 100).toFixed(1) : 0}%)
                              </span>
                            </p>
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>

              {/* Center label */}
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-mono-data text-foreground text-lg font-bold sm:text-2xl lg:text-3xl">{total.toLocaleString()}</span>
                <span className="text-muted-foreground text-[9px] sm:text-[10px] lg:text-xs">총 접속</span>
              </div>
            </div>

            {/* Legend */}
            <div className="flex w-full flex-col gap-1 sm:gap-1.5 lg:gap-2">
              {chartData.map(item => {
                const percentage = total > 0 ? ((item.value / total) * 100).toFixed(1) : '0'
                const Icon = item.config.icon
                return (
                  <div
                    key={item.key}
                    className="group/item flex items-center justify-between rounded-md bg-card/50 px-2 py-1.5 transition-all hover:bg-card/80 sm:rounded-lg sm:px-3 sm:py-2"
                  >
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      <div className={cn('rounded p-1 sm:rounded-md sm:p-1.5', item.config.bg)}>
                        <Icon className={cn('h-2.5 w-2.5 sm:h-3 sm:w-3 lg:h-3.5 lg:w-3.5', item.config.text)} />
                      </div>
                      <span className="text-foreground text-[10px] font-medium sm:text-xs lg:text-sm">{item.name}</span>
                    </div>
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      <span className="font-mono-data text-foreground text-xs font-bold sm:text-sm lg:text-base">
                        {item.value.toLocaleString()}
                      </span>
                      <span className="text-muted-foreground text-[9px] sm:text-[10px] lg:text-xs">({percentage}%)</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center gap-2">
            <div className="bg-muted rounded-full p-2 sm:p-3">
              <LuMonitor className="text-muted-foreground h-5 w-5 sm:h-6 sm:w-6" />
            </div>
            <span className="text-muted-foreground text-xs sm:text-sm">데이터가 없습니다</span>
          </div>
        )}
      </div>
    </div>
  )
}
