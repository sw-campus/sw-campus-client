'use client'

import { useState } from 'react'

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

import { useTrafficSourcesQuery } from '../../hooks/useAnalytics'

interface TrafficSourceChartProps {
  period: number
}

// 트래픽 소스별 색상 팔레트
const COLORS = [
  '#3b82f6', // Blue
  '#10b981', // Emerald
  '#f59e0b', // Amber
  '#ef4444', // Red
  '#8b5cf6', // Violet
  '#ec4899', // Pink
  '#06b6d4', // Cyan
  '#84cc16', // Lime
  '#f97316', // Orange
  '#6366f1', // Indigo
]

// 트래픽 소스를 사용자 친화적인 이름으로 변환
function getReadableSourceName(source: string, medium: string): string {
  const key = `${source.toLowerCase()}/${medium.toLowerCase()}`

  const sourceMapping: Record<string, string> = {
    // 소셜 미디어 광고
    'ig/paid': '인스타그램 광고',
    'instagram/paid': '인스타그램 광고',
    'fb/paid': '페이스북 광고',
    'facebook/paid': '페이스북 광고',

    // 검색 광고
    'google/cpc': '구글 광고',
    'naver/cpc': '네이버 광고',
    'kakao/cpc': '카카오 광고',

    // 직접 유입
    '(direct)/(none)': '직접 유입',
    'direct/(none)': '직접 유입',

    // 오가닉 검색
    'google/organic': '구글 검색',
    'naver/organic': '네이버 검색',

    // 레퍼럴
    'accounts.google.com/referral': '구글 계정',

    // 미설정
    '(not set)/(not set)': '기타',
    '(data not available)/(data not available)': '기타',
  }

  // 정확히 일치하는 경우
  if (sourceMapping[key]) {
    return sourceMapping[key]
  }

  // 부분 매칭 (소스 기반)
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

  // 레퍼럴 처리
  if (medium.toLowerCase() === 'referral') {
    // IP 주소 형태는 기타로 처리
    if (/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(source)) {
      return '기타'
    }
    return `${source} 추천`
  }

  // 기본값: 원본 표시
  return `${source} / ${medium}`
}

export function TrafficSourceChart({ period }: TrafficSourceChartProps) {
  const { data, isLoading } = useTrafficSourcesQuery(period, 10)
  const [expanded, setExpanded] = useState(false)

  // 같은 이름의 소스끼리 합산
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
      .sort((a, b) => b.value - a.value) // 세션 수로 내림차순 정렬
  })()

  if (isLoading) {
    return (
      <Card className="bg-card h-full">
        <CardHeader>
          <CardTitle className="text-foreground">트래픽 소스</CardTitle>
        </CardHeader>
        <CardContent className="flex h-[200px] items-center justify-center">
          <span className="text-muted-foreground text-sm">로딩 중...</span>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-card flex h-full flex-col">
      <CardHeader>
        <CardTitle className="text-foreground">트래픽 소스</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center gap-4">
        {chartData.length > 0 ? (
          <>
            <div className="h-[200px] w-[200px] shrink-0">
              <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                    formatter={(value, name, props) => {
                      const sessions = typeof value === 'number' ? value : 0
                      const users = props?.payload?.users ?? 0
                      return [`${sessions.toLocaleString()}회 (${users.toLocaleString()}명)`, name]
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-col gap-1">
              {(expanded ? chartData : chartData.slice(0, 5)).map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="h-3 w-3 shrink-0 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-muted-foreground truncate text-xs" title={item.name}>
                    {item.name}: {item.value.toLocaleString()}
                  </span>
                </div>
              ))}
              {chartData.length > 5 && (
                <button
                  type="button"
                  onClick={() => setExpanded(!expanded)}
                  className="text-primary hover:text-primary/80 cursor-pointer text-left text-xs"
                >
                  {expanded ? '접기 ▲' : `...외 ${chartData.length - 5}개 더보기 ▼`}
                </button>
              )}
            </div>
            {/* 요약 정보 */}
            {(() => {
              const totalSessions = chartData.reduce((acc, item) => acc + item.value, 0)
              const totalUsers = chartData.reduce((acc, item) => acc + item.users, 0)
              const avgSessions = totalUsers > 0 ? (totalSessions / totalUsers).toFixed(2) : '0'
              return (
                <div className="border-border mt-2 border-t pt-2">
                  <span className="text-muted-foreground text-xs">평균 {avgSessions}회 방문</span>
                </div>
              )
            })()}
          </>
        ) : (
          <span className="text-muted-foreground text-sm">데이터가 없습니다</span>
        )}
      </CardContent>
    </Card>
  )
}
