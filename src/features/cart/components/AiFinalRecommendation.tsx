'use client'

import Link from 'next/link'
import { FiAward, FiArrowRight } from 'react-icons/fi'

import { Card, CardContent } from '@/components/ui/card'
import type { FinalRecommendation } from '@/features/lecture/actions/gemini'

interface AiFinalRecommendationProps {
  recommendation: FinalRecommendation
  leftTitle: string
  rightTitle: string
  leftId: string | null
  rightId: string | null
}

export function AiFinalRecommendation({
  recommendation,
  leftTitle,
  rightTitle,
  leftId,
  rightId,
}: AiFinalRecommendationProps) {
  const isLeftRecommended = recommendation.recommended === 'left'
  const recommendedTitle = isLeftRecommended ? leftTitle : rightTitle
  const recommendedId = isLeftRecommended ? leftId : rightId

  return (
    <Card className="overflow-hidden border-0 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-500 shadow-xl">
      <CardContent className="p-6">
        <div className="flex flex-col gap-4 text-white md:flex-row md:items-center md:gap-6">
          {/* 아이콘 */}
          <div className="flex-shrink-0">
            <div className="flex size-14 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
              <FiAward className="size-7 text-yellow-200" />
            </div>
          </div>

          {/* 추천 내용 */}
          <div className="min-w-0 flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold tracking-wide uppercase">
                AI 추천
              </span>
            </div>
            <h3 className="text-lg font-bold md:text-xl">{recommendation.summary}</h3>
            <p className="text-sm leading-relaxed text-white/90">{recommendation.reason}</p>
          </div>

          {/* 추천 강의 - 클릭 시 상세 페이지로 이동 */}
          <div className="flex-shrink-0">
            {recommendedId ? (
              <Link
                href={`/lectures/${recommendedId}`}
                className="flex items-center gap-2 rounded-xl bg-white px-5 py-3 font-semibold text-orange-600 shadow-lg transition-transform hover:scale-105"
              >
                <span className="max-w-[180px] truncate text-sm md:max-w-none">{recommendedTitle}</span>
                <FiArrowRight className="size-4" />
              </Link>
            ) : (
              <div className="flex items-center gap-2 rounded-xl bg-white px-5 py-3 font-semibold text-orange-600 shadow-lg">
                <span className="max-w-[180px] truncate text-sm md:max-w-none">{recommendedTitle}</span>
                <FiArrowRight className="size-4" />
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
