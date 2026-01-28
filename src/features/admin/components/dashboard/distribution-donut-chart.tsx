'use client'

import { LuUsers } from 'react-icons/lu'
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'

import { cn } from '@/lib/utils'

export interface DonutChartDataItem {
  name: string
  value: number
  color: string
  [key: string]: string | number
}

interface DistributionDonutChartProps {
  data: DonutChartDataItem[]
  isLoading?: boolean
}

const MEMBER_ICONS: Record<string, { bg: string; text: string }> = {
  '일반 회원': { bg: 'bg-blue-500/10', text: 'text-blue-600' },
  '기관 회원': { bg: 'bg-emerald-500/10', text: 'text-emerald-600' },
  관리자: { bg: 'bg-amber-500/10', text: 'text-amber-600' },
}

export function DistributionDonutChart({ data, isLoading }: DistributionDonutChartProps) {
  const totalValue = data.reduce((sum, item) => sum + item.value, 0)

  if (isLoading || totalValue === 0) {
    return (
      <div className="bento-card relative h-full overflow-hidden p-3 sm:p-5">
        <div className="grid-pattern absolute inset-0 opacity-30" />
        <div className="relative z-10 flex h-full flex-col">
          <div className="bg-muted mb-3 h-4 w-20 animate-pulse rounded sm:mb-4 sm:h-5 sm:w-24" />
          <div className="flex flex-1 items-center justify-center">
            {isLoading ? (
              <div className="bg-muted h-28 w-28 animate-pulse rounded-full sm:h-36 sm:w-36" />
            ) : (
              <div className="flex flex-col items-center gap-2">
                <div className="bg-muted rounded-full p-2 sm:p-3">
                  <LuUsers className="text-muted-foreground h-5 w-5 sm:h-6 sm:w-6" />
                </div>
                <span className="text-muted-foreground text-xs sm:text-sm">데이터가 없습니다</span>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bento-card group relative h-full overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 via-transparent to-cyan-500/5" />
      <div className="grid-pattern absolute inset-0 opacity-30" />

      <div className="absolute top-1/2 left-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full bg-teal-500/5 blur-2xl sm:h-32 sm:w-32" />

      <div className="relative z-10 flex h-full flex-col p-3 sm:p-5">
        <div className="mb-2 flex items-center gap-2 sm:mb-3 lg:mb-4">
          <div className="rounded-lg bg-teal-500/10 p-1.5 sm:p-2">
            <LuUsers className="h-3.5 w-3.5 text-teal-600 sm:h-4 sm:w-4" />
          </div>
          <h3 className="text-foreground text-xs font-bold sm:text-sm lg:text-base">회원 분포</h3>
        </div>

        <div className="flex flex-1 flex-col items-center justify-center gap-3 sm:gap-4">
          <div className="relative h-28 w-28 sm:h-36 sm:w-36 lg:h-44 lg:w-44">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <defs>
                  {data.map((entry, index) => (
                    <linearGradient key={index} id={`memberGrad-${index}`} x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor={entry.color} stopOpacity={1} />
                      <stop offset="100%" stopColor={entry.color} stopOpacity={0.6} />
                    </linearGradient>
                  ))}
                  <filter id="member-shadow">
                    <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.15" />
                  </filter>
                </defs>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius="60%"
                  outerRadius="85%"
                  paddingAngle={3}
                  dataKey="value"
                  strokeWidth={0}
                  filter="url(#member-shadow)"
                >
                  {data.map((entry, index) => (
                    <Cell key={entry.name} fill={`url(#memberGrad-${index})`} />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload
                      const percentage = totalValue > 0 ? ((data.value / totalValue) * 100).toFixed(1) : 0
                      return (
                        <div className="rounded-lg border border-white/20 bg-popover/95 px-2 py-1.5 shadow-xl backdrop-blur-sm sm:rounded-xl sm:px-3 sm:py-2">
                          <div className="flex items-center gap-1.5 sm:gap-2">
                            <div className="h-2 w-2 rounded-full sm:h-2.5 sm:w-2.5" style={{ backgroundColor: data.color }} />
                            <span className="text-foreground text-xs font-medium sm:text-sm">{data.name}</span>
                          </div>
                          <p className="font-mono-data text-foreground mt-0.5 text-base font-bold sm:mt-1 sm:text-lg">
                            {data.value.toLocaleString()}
                            <span className="text-muted-foreground ml-1 text-[10px] font-normal sm:text-xs">명 ({percentage}%)</span>
                          </p>
                        </div>
                      )
                    }
                    return null
                  }}
                />
              </PieChart>
            </ResponsiveContainer>

            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-mono-data text-foreground text-lg font-bold sm:text-2xl lg:text-3xl">{totalValue.toLocaleString()}</span>
              <span className="text-muted-foreground text-[9px] sm:text-[10px] lg:text-xs">총 회원</span>
            </div>
          </div>

          <div className="flex w-full flex-col gap-1 sm:gap-1.5 lg:gap-2">
            {data.map(item => {
              const percentage = totalValue > 0 ? ((item.value / totalValue) * 100).toFixed(1) : '0'
              const style = MEMBER_ICONS[item.name] || { bg: 'bg-gray-100', text: 'text-gray-600' }
              return (
                <div
                  key={item.name}
                  className="group/item flex items-center justify-between rounded-md bg-card/50 px-2 py-1.5 transition-all hover:bg-card/80 sm:rounded-lg sm:px-3 sm:py-2"
                >
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <div className={cn('rounded p-1 sm:rounded-md sm:p-1.5', style.bg)}>
                      <div className="h-1.5 w-1.5 rounded-full sm:h-2 sm:w-2 lg:h-2.5 lg:w-2.5" style={{ backgroundColor: item.color }} />
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
      </div>
    </div>
  )
}
