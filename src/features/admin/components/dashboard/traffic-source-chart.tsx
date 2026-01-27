'use client'

import { useState } from 'react'

import { LuChevronDown, LuChevronUp, LuGlobe } from 'react-icons/lu'
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'

import { cn } from '@/lib/utils'

import { useTrafficSourcesQuery } from '../../hooks/use-analytics'

interface TrafficSourceChartProps {
  period: number
}

const COLORS = [
  '#3b82f6',
  '#10b981',
  '#f59e0b',
  '#ef4444',
  '#8b5cf6',
  '#ec4899',
  '#06b6d4',
  '#84cc16',
  '#f97316',
  '#6366f1',
]

function getReadableSourceName(source: string, medium: string): string {
  const key = `${source.toLowerCase()}/${medium.toLowerCase()}`

  const sourceMapping: Record<string, string> = {
    'ig/paid': '인스타그램 광고',
    'instagram/paid': '인스타그램 광고',
    'ig/social': '인스타그램',
    'instagram/social': '인스타그램',
    'fb/paid': '페이스북 광고',
    'facebook/paid': '페이스북 광고',
    'fb/social': '페이스북',
    'facebook/social': '페이스북',
    'google/cpc': '구글 광고',
    'naver/cpc': '네이버 광고',
    'kakao/cpc': '카카오 광고',
    '(direct)/(none)': '직접 유입',
    'direct/(none)': '직접 유입',
    'google/organic': '구글 검색',
    'naver/organic': '네이버 검색',
    'accounts.google.com/referral': '구글 계정',
    'accounts.kakao.com/referral': '카카오 계정',
    'pcmap.place.naver.com/referral': '네이버 지도',
    't1.daumcdn.net/referral': '카카오/다음',
    '(not set)/(not set)': '기타',
    '(data not available)/(data not available)': '기타',
  }

  if (sourceMapping[key]) return sourceMapping[key]

  const sourceLower = source.toLowerCase()
  if (sourceLower.includes('instagram') || sourceLower === 'ig') {
    return medium.toLowerCase() === 'organic' ? '인스타그램' : '인스타그램 광고'
  }
  if (sourceLower.includes('facebook') || sourceLower === 'fb') {
    return medium.toLowerCase() === 'organic' ? '페이스북' : '페이스북 광고'
  }
  if (sourceLower === 'google') {
    if (medium.toLowerCase() === 'cpc') return '구글 광고'
    if (medium.toLowerCase() === 'organic') return '구글 검색'
    return '구글'
  }
  if (sourceLower === 'naver') {
    if (medium.toLowerCase() === 'cpc') return '네이버 광고'
    if (medium.toLowerCase() === 'organic') return '네이버 검색'
    return '네이버'
  }
  if (medium.toLowerCase() === 'referral') {
    if (/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(source)) return '기타'
    return `${source} 추천`
  }

  return `${source} / ${medium}`
}

export function TrafficSourceChart({ period }: TrafficSourceChartProps) {
  const { data, isLoading } = useTrafficSourcesQuery(period, 10)
  const [expanded, setExpanded] = useState(false)

  const chartData = (() => {
    if (!data) return []

    const grouped = new Map<string, { sessions: number; users: number }>()

    for (const item of data) {
      const name = getReadableSourceName(item.source, item.medium)
      const existing = grouped.get(name)
      if (existing) {
        existing.sessions += item.sessions
        existing.users += item.users
      } else {
        grouped.set(name, { sessions: item.sessions, users: item.users })
      }
    }

    return Array.from(grouped.entries())
      .map(([name, stats], index) => ({
        name,
        value: stats.sessions,
        users: stats.users,
        color: COLORS[index % COLORS.length],
      }))
      .sort((a, b) => b.value - a.value)
  })()

  const totalSessions = chartData.reduce((acc, item) => acc + item.value, 0)
  const totalUsers = chartData.reduce((acc, item) => acc + item.users, 0)

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
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-violet-500/5" />
      <div className="grid-pattern absolute inset-0 opacity-30" />

      <div className="absolute top-1/2 left-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-500/5 blur-2xl sm:h-32 sm:w-32" />

      <div className="relative z-10 flex h-full flex-col p-3 sm:p-5">
        <div className="mb-2 flex items-center gap-2 sm:mb-3 lg:mb-4">
          <div className="rounded-lg bg-indigo-500/10 p-1.5 sm:p-2">
            <LuGlobe className="h-3.5 w-3.5 text-indigo-600 sm:h-4 sm:w-4" />
          </div>
          <h3 className="text-foreground text-xs font-bold sm:text-sm lg:text-base">트래픽 소스</h3>
        </div>

        {chartData.length > 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 sm:gap-4">
            <div className="relative h-28 w-28 sm:h-36 sm:w-36 lg:h-44 lg:w-44">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <defs>
                    {chartData.map((entry, index) => (
                      <linearGradient key={index} id={`trafficGrad-${index}`} x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor={entry.color} stopOpacity={1} />
                        <stop offset="100%" stopColor={entry.color} stopOpacity={0.6} />
                      </linearGradient>
                    ))}
                  </defs>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius="55%"
                    outerRadius="85%"
                    paddingAngle={2}
                    dataKey="value"
                    strokeWidth={0}
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={index} fill={`url(#trafficGrad-${index})`} />
                    ))}
                  </Pie>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload
                        const percentage = totalSessions > 0 ? ((data.value / totalSessions) * 100).toFixed(1) : 0
                        return (
                          <div className="rounded-lg border border-white/20 bg-popover/95 px-2 py-1.5 shadow-xl backdrop-blur-sm sm:rounded-xl sm:px-3 sm:py-2">
                            <div className="flex items-center gap-1.5 sm:gap-2">
                              <div className="h-2 w-2 rounded-full sm:h-2.5 sm:w-2.5" style={{ backgroundColor: data.color }} />
                              <span className="text-foreground text-xs font-medium sm:text-sm">{data.name}</span>
                            </div>
                            <div className="mt-0.5 space-y-0.5 sm:mt-1">
                              <p className="font-mono-data text-foreground text-xs sm:text-sm">
                                {data.value.toLocaleString()}회
                                <span className="text-muted-foreground ml-1 text-[10px] sm:text-xs">({percentage}%)</span>
                              </p>
                              <p className="text-muted-foreground text-[10px] sm:text-xs">{data.users.toLocaleString()}명</p>
                            </div>
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>

              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-mono-data text-foreground text-lg font-bold sm:text-2xl lg:text-3xl">{totalSessions.toLocaleString()}</span>
                <span className="text-muted-foreground text-[9px] sm:text-[10px] lg:text-xs">세션</span>
              </div>
            </div>

            <div className="flex w-full flex-col gap-1 lg:gap-1.5">
              {(expanded ? chartData : chartData.slice(0, 4)).map((item, index) => {
                const percentage = totalSessions > 0 ? ((item.value / totalSessions) * 100).toFixed(1) : '0'
                return (
                  <div
                    key={index}
                    className="flex items-center justify-between rounded-md bg-card/50 px-2 py-1 transition-all hover:bg-card/80 sm:rounded-lg sm:px-2.5 sm:py-1.5"
                  >
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      <div className="h-1.5 w-1.5 rounded-full sm:h-2 sm:w-2 lg:h-2.5 lg:w-2.5" style={{ backgroundColor: item.color }} />
                      <span className="text-foreground max-w-[80px] truncate text-[10px] sm:max-w-[100px] sm:text-xs lg:max-w-none lg:text-sm">{item.name}</span>
                    </div>
                    <span className="text-muted-foreground text-[9px] sm:text-[10px] lg:text-xs">{percentage}%</span>
                  </div>
                )
              })}

              {chartData.length > 4 && (
                <button
                  type="button"
                  onClick={() => setExpanded(!expanded)}
                  className="mt-0.5 flex items-center justify-center gap-1 text-[10px] text-indigo-600 transition-colors hover:text-indigo-700 sm:mt-1 sm:text-xs"
                >
                  {expanded ? (
                    <>
                      접기 <LuChevronUp className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                    </>
                  ) : (
                    <>
                      +{chartData.length - 4}개 더보기 <LuChevronDown className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center gap-2">
            <div className="bg-muted rounded-full p-2 sm:p-3">
              <LuGlobe className="text-muted-foreground h-5 w-5 sm:h-6 sm:w-6" />
            </div>
            <span className="text-muted-foreground text-xs sm:text-sm">데이터가 없습니다</span>
          </div>
        )}
      </div>
    </div>
  )
}
