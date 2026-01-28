'use client'

import { LuSearch, LuTrendingUp } from 'react-icons/lu'

import { cn } from '@/lib/utils'

import { usePopularSearchTermsQuery } from '../../hooks/use-analytics'
import { type Period } from './shared/period-toggle'

interface PopularSearchTermsCardProps {
  period?: Period
}

export function PopularSearchTermsCard({ period = 7 }: PopularSearchTermsCardProps) {
  const { data: terms, isLoading } = usePopularSearchTermsQuery(period, 10)

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
      <div className="bento-card relative h-full overflow-hidden p-3 md:p-5">
        <div className="grid-pattern absolute inset-0 opacity-30" />
        <div className="relative z-10 flex h-full flex-col">
          <div className="bg-muted mb-3 h-4 w-24 animate-pulse rounded md:mb-4 md:h-5 md:w-32" />
          <div className="flex flex-1 flex-col gap-1.5 md:gap-2">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="bg-muted/50 h-8 animate-pulse rounded-lg md:h-10 md:rounded-xl" style={{ animationDelay: `${i * 0.1}s` }} />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bento-card group relative h-full overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 via-transparent to-purple-500/5" />
      <div className="grid-pattern absolute inset-0 opacity-30" />

      {/* Decorative elements */}
      <div className="absolute -top-6 -right-6 h-20 w-20 rounded-full bg-violet-500/10 blur-2xl md:-top-8 md:-right-8 md:h-24 md:w-24" />
      <div className="absolute -bottom-4 -left-4 h-16 w-16 rounded-full bg-purple-500/10 blur-2xl md:-bottom-6 md:-left-6 md:h-20 md:w-20" />

      <div className="relative z-10 flex h-full flex-col p-3 md:p-5">
        {/* Header */}
        <div className="mb-3 flex items-center gap-2 md:mb-4">
          <div className="rounded-lg bg-violet-500/10 p-1.5 md:p-2">
            <LuSearch className="h-3.5 w-3.5 text-violet-600 md:h-4 md:w-4" />
          </div>
          <div>
            <h3 className="text-foreground text-xs font-bold md:text-sm lg:text-base">인기 검색어</h3>
            <p className="text-muted-foreground text-[9px] md:text-[10px] lg:text-xs">{periodLabel} 기준</p>
          </div>
        </div>

        {/* Search terms list */}
        {terms && terms.length > 0 ? (
          <div className="flex flex-1 flex-col gap-1 overflow-hidden md:gap-2 lg:gap-2.5">
            {terms.slice(0, 8).map((item, index) => (
              <div
                key={item.term}
                className={cn(
                  'flex items-center justify-between rounded-lg px-2 py-1.5 md:rounded-xl md:px-3 md:py-2.5',
                  'bg-card/50',
                  index < 3 && 'bg-gradient-to-r from-violet-500/10 to-purple-500/10'
                )}
              >
                <div className="flex items-center gap-2 md:gap-3">
                  {/* Rank badge */}
                  <div
                    className={cn(
                      'flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold md:h-6 md:w-6 md:text-xs lg:h-7 lg:w-7 lg:text-sm',
                      index === 0 && 'bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-md shadow-amber-500/30',
                      index === 1 && 'bg-gradient-to-br from-gray-300 to-gray-400 text-white',
                      index === 2 && 'bg-gradient-to-br from-orange-300 to-orange-400 text-white',
                      index > 2 && 'bg-muted text-muted-foreground'
                    )}
                  >
                    {index + 1}
                  </div>

                  {/* Term */}
                  <span className="text-foreground max-w-[100px] truncate text-xs font-medium md:max-w-none md:text-sm lg:text-base">
                    {item.term}
                  </span>
                </div>

                {/* Count */}
                <div className="flex items-center gap-1 md:gap-1.5">
                  <span className="font-mono-data text-muted-foreground text-[10px] md:text-xs lg:text-sm">
                    {item.count.toLocaleString()}
                  </span>
                  {index < 3 && <LuTrendingUp className="h-2.5 w-2.5 text-violet-500 md:h-3 md:w-3 lg:h-3.5 lg:w-3.5" />}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center gap-2">
            <div className="bg-muted rounded-full p-2 md:p-3">
              <LuSearch className="text-muted-foreground h-5 w-5 md:h-6 md:w-6" />
            </div>
            <span className="text-muted-foreground text-xs md:text-sm">검색 데이터가 없습니다</span>
          </div>
        )}
      </div>
    </div>
  )
}
