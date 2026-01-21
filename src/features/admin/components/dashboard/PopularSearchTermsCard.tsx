'use client'

import { useRouter } from 'next/navigation'
import { LuSearch, LuTrendingUp } from 'react-icons/lu'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

import { usePopularSearchTermsQuery } from '../../hooks/useAnalytics'
import { type Period } from './shared/PeriodToggle'

interface PopularSearchTermsCardProps {
  period?: Period
}

export function PopularSearchTermsCard({ period = 7 }: PopularSearchTermsCardProps) {
  const router = useRouter()
  const { data: terms, isLoading } = usePopularSearchTermsQuery(period, 10)

  const handleTermClick = (term: string) => {
    router.push(`/lectures/search?text=${encodeURIComponent(term)}&size=12`)
  }

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
      <Card className="bg-card h-full">
        <CardHeader>
          <CardTitle className="text-foreground flex items-center gap-2 text-lg font-semibold">
            <LuSearch className="text-primary h-5 w-5" />
            인기 검색어
          </CardTitle>
        </CardHeader>
        <CardContent className="flex h-[200px] items-center justify-center">
          <span className="text-muted-foreground text-sm">로딩 중...</span>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-card flex h-full flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="text-foreground flex items-center gap-2 text-lg font-semibold">
          <LuSearch className="text-primary h-5 w-5" />
          인기 검색어
        </CardTitle>
        <p className="text-muted-foreground text-xs">{periodLabel} 기준 검색 횟수</p>
      </CardHeader>
      <CardContent>
        {terms && terms.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {terms.map((item, index) => (
              <button
                key={item.term}
                onClick={() => handleTermClick(item.term)}
                className="bg-muted hover:bg-primary/10 hover:text-primary flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm transition-colors"
              >
                <span className={`text-xs font-bold ${index < 3 ? 'text-primary' : 'text-muted-foreground'}`}>
                  {index + 1}
                </span>
                <span className="text-foreground">{item.term}</span>
                <span className="text-muted-foreground text-xs">({item.count})</span>
              </button>
            ))}
          </div>
        ) : (
          <div className="text-muted-foreground flex items-center justify-center py-8 text-sm">
            <LuTrendingUp className="mr-2 h-4 w-4" />
            검색 데이터가 없습니다
          </div>
        )}
      </CardContent>
    </Card>
  )
}
