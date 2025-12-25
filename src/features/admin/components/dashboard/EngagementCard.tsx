'use client'

import { LuClock, LuEye, LuMousePointer2 } from 'react-icons/lu'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

import { Period } from './shared/PeriodToggle'

interface EngagementCardProps {
  averageEngagementTime: number
  pageViews: number
  sessions: number
  period: Period
  isLoading?: boolean
}

export function EngagementCard({ averageEngagementTime, pageViews, sessions, period, isLoading }: EngagementCardProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}분 ${secs}초`
  }

  if (isLoading) {
    return (
      <Card className="bg-card h-full">
        <CardHeader>
          <CardTitle className="text-foreground">참여 현황</CardTitle>
        </CardHeader>
        <CardContent className="flex h-[200px] items-center justify-center">
          <span className="text-muted-foreground text-sm">로딩 중...</span>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-card flex h-full flex-col justify-between">
      <CardHeader className="pb-2">
        <CardTitle className="text-foreground flex items-center gap-2 text-lg font-semibold">
          <LuClock className="text-primary h-5 w-5" />
          참여 현황
        </CardTitle>
        <p className="text-muted-foreground text-xs">
          {period === 1 ? '일간' : period === 7 ? '주간' : period === 30 ? '월간' : '주간'} 기준
        </p>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col justify-center gap-6 pb-6">
        {/* Main Metric: Average Time */}
        <div className="flex flex-col items-center justify-center">
          <span className="text-foreground text-4xl font-bold tracking-tight">{formatTime(averageEngagementTime)}</span>
          <span className="text-muted-foreground mt-1 text-sm font-medium">평균 체류 시간</span>
        </div>

        {/* Secondary Metrics: Page Views & Sessions */}
        <div className="grid grid-cols-2 gap-4 border-t pt-4">
          <div className="flex flex-col items-center justify-center gap-1">
            <div className="text-muted-foreground flex items-center gap-1.5">
              <LuEye className="h-4 w-4" />
              <span className="text-xs">누적 페이지뷰</span>
            </div>
            <span className="text-foreground text-xl font-semibold">{pageViews.toLocaleString()}</span>
          </div>
          <div className="flex flex-col items-center justify-center gap-1 border-l">
            <div className="text-muted-foreground flex items-center gap-1.5">
              <LuMousePointer2 className="h-4 w-4" />
              <span className="text-xs">누적 세션</span>
            </div>
            <span className="text-foreground text-xl font-semibold">{sessions.toLocaleString()}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
