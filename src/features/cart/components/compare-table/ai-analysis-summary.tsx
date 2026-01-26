'use client'

import Link from 'next/link'
import { FiArrowRight } from 'react-icons/fi'
import { PiRobotDuotone } from 'react-icons/pi'

import { Button } from '@/components/ui/button'
import type { ComparisonResult } from '@/features/lecture/actions/gemini'

interface AiAnalysisSummaryProps {
  aiResult: ComparisonResult | null
  leftTitle: string
  rightTitle: string
  leftId?: string | null
  rightId?: string | null
}

export function AiAnalysisSummary({ aiResult, leftId, rightId }: AiAnalysisSummaryProps) {
  if (!aiResult) return null

  // 요약 코멘트 생성 (첫 번째 섹션 코멘트 사용 또는 최종 추천에서 추출)
  const summaryComment = aiResult.sectionComments[0]?.comment ?? aiResult.finalRecommendation

  // 추천 강의 정보
  const isLeftRecommended = aiResult.finalRecommendation.recommended === 'left'
  const recommendedId = isLeftRecommended ? leftId : rightId
  const isPrecise = aiResult.recommendationLevel === 'precise'

  return (
    <div className="overflow-hidden rounded-[8px] border border-brand-gold bg-white p-3 md:rounded-xl md:p-6">
      {/* Header - "AI로 분석 완료!" */}
      <div className="mb-2 flex items-center gap-2 md:mb-3">
        <div className="flex size-6 items-center justify-center rounded-full bg-yellow-400 md:size-8">
          <PiRobotDuotone className="size-4 text-yellow-900 md:size-5" />
        </div>
        <span className="text-xs font-bold text-foreground md:text-base">AI로 분석 완료!</span>
      </div>

      {/* 배지: AI 추천 / 정밀 추천 */}
      <div className="mb-2 flex items-center gap-1.5 md:mb-3 md:gap-2">
        <span className="rounded-full bg-purple-100 px-2 py-0.5 text-[10px] font-semibold text-purple-700 md:px-3 md:py-1 md:text-xs">
          AI 추천
        </span>
        <span
          className={`rounded-full px-2 py-0.5 text-[10px] font-semibold md:px-3 md:py-1 md:text-xs ${
            isPrecise ? 'bg-purple-100 text-purple-700' : 'bg-amber-100 text-amber-700'
          }`}
        >
          {isPrecise ? '정밀 추천' : '기본 추천'}
        </span>
      </div>

      {/* 추천 이유 */}
      <p className="mb-3 text-xs leading-relaxed text-muted-foreground md:mb-4 md:text-sm">{summaryComment}</p>

      {/* AI 추천 강의 자세히 보기 버튼 */}
      {recommendedId ? (
        <Button
          asChild
          className="h-8 w-full bg-yellow-400 text-xs font-semibold text-yellow-900 hover:bg-yellow-500 md:h-10 md:text-sm"
        >
          <Link href={`/lectures/${recommendedId}`}>
            AI 추천 강의 자세히 보기
            <FiArrowRight className="ml-1 size-3.5 md:ml-1.5 md:size-4" />
          </Link>
        </Button>
      ) : (
        <Button disabled className="h-8 w-full bg-yellow-400 text-xs font-semibold text-yellow-900 md:h-10 md:text-sm">
          AI 추천 강의 자세히 보기
          <FiArrowRight className="ml-1 size-3.5 md:ml-1.5 md:size-4" />
        </Button>
      )}
    </div>
  )
}
