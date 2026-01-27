'use client'

import { LuClock, LuEye, LuMousePointer2, LuZap } from 'react-icons/lu'

import { cn } from '@/lib/utils'

import { Period } from './shared/period-toggle'

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
    return { mins, secs }
  }

  const time = formatTime(averageEngagementTime)

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

  if (isLoading) {
    return (
      <div className="bento-card relative h-full overflow-hidden p-3 sm:p-5">
        <div className="grid-pattern absolute inset-0 opacity-30" />
        <div className="relative z-10 flex h-full flex-col">
          <div className="bg-muted mb-3 h-4 w-20 animate-pulse rounded sm:mb-4 sm:h-5 sm:w-24" />
          <div className="flex flex-1 flex-col items-center justify-center gap-3 sm:gap-4">
            <div className="bg-muted h-12 w-24 animate-pulse rounded-lg sm:h-16 sm:w-32" />
            <div className="grid w-full grid-cols-2 gap-2 sm:gap-3">
              <div className="bg-muted/50 h-14 animate-pulse rounded-lg sm:h-16" />
              <div className="bg-muted/50 h-14 animate-pulse rounded-lg sm:h-16" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bento-card group relative h-full overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 via-transparent to-orange-500/5" />
      <div className="grid-pattern absolute inset-0 opacity-30" />

      {/* Decorative elements */}
      <div className="absolute -top-8 -right-8 h-24 w-24 rounded-full bg-amber-500/10 blur-2xl transition-all duration-500 group-hover:bg-amber-500/20 sm:-top-12 sm:-right-12 sm:h-32 sm:w-32" />
      <div className="absolute -bottom-6 -left-6 h-20 w-20 rounded-full bg-orange-500/10 blur-2xl sm:-bottom-8 sm:-left-8 sm:h-24 sm:w-24" />

      <div className="relative z-10 flex h-full flex-col p-3 sm:p-5">
        {/* Header */}
        <div className="mb-3 flex items-center justify-between sm:mb-4 lg:mb-5">
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-amber-500/10 p-1.5 sm:p-2">
              <LuZap className="h-3.5 w-3.5 text-amber-600 sm:h-4 sm:w-4" />
            </div>
            <div>
              <h3 className="text-foreground text-xs font-bold sm:text-sm lg:text-base">참여 현황</h3>
              <p className="text-muted-foreground text-[9px] sm:text-[10px] lg:text-xs">{getPeriodLabel(period)} 기준</p>
            </div>
          </div>
        </div>

        {/* Main metric - Average Time */}
        <div className="flex flex-1 flex-col items-center justify-center">
          <div className="relative mb-1.5 sm:mb-2">
            <div className="absolute inset-0 animate-pulse rounded-full bg-amber-500/20 blur-md" />
            <div className="relative flex items-baseline justify-center gap-0.5 sm:gap-1">
              <span className="font-mono-data text-foreground text-3xl font-bold tracking-tighter sm:text-4xl lg:text-5xl">
                {time.mins}
              </span>
              <span className="text-muted-foreground text-sm font-medium sm:text-base lg:text-lg">분</span>
              <span className="font-mono-data text-foreground text-3xl font-bold tracking-tighter sm:text-4xl lg:text-5xl">
                {time.secs}
              </span>
              <span className="text-muted-foreground text-sm font-medium sm:text-base lg:text-lg">초</span>
            </div>
          </div>
          <div className="flex items-center gap-1 text-amber-600 sm:gap-1.5">
            <LuClock className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
            <span className="text-[10px] font-medium sm:text-xs">평균 체류 시간</span>
          </div>
        </div>

        {/* Secondary metrics */}
        <div className="mt-3 grid grid-cols-2 gap-2 sm:mt-4 lg:gap-3">
          <div className="group/item rounded-lg bg-card/50 p-2 transition-all hover:bg-card/80 sm:rounded-xl sm:p-3 lg:p-4">
            <div className="mb-0.5 flex items-center gap-1 sm:mb-1 sm:gap-1.5">
              <LuEye className="h-3 w-3 shrink-0 text-blue-500 sm:h-3.5 sm:w-3.5 lg:h-4 lg:w-4" />
              <span className="text-muted-foreground whitespace-nowrap text-[9px] font-medium sm:text-[10px] lg:text-xs">페이지뷰</span>
            </div>
            <span className="font-mono-data text-foreground text-base font-bold sm:text-lg lg:text-2xl">
              {pageViews.toLocaleString()}
            </span>
          </div>

          <div className="group/item rounded-lg bg-card/50 p-2 transition-all hover:bg-card/80 sm:rounded-xl sm:p-3 lg:p-4">
            <div className="mb-0.5 flex items-center gap-1 sm:mb-1 sm:gap-1.5">
              <LuMousePointer2 className="h-3 w-3 shrink-0 text-emerald-500 sm:h-3.5 sm:w-3.5 lg:h-4 lg:w-4" />
              <span className="text-muted-foreground whitespace-nowrap text-[9px] font-medium sm:text-[10px] lg:text-xs">세션</span>
            </div>
            <span className="font-mono-data text-foreground text-base font-bold sm:text-lg lg:text-2xl">
              {sessions.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
