'use client'

import Link from 'next/link'
import { FiArrowRight } from 'react-icons/fi'

import type { ComparisonResult } from '@/features/lecture/actions/gemini'

interface AiAnalysisSummaryProps {
  aiResult: ComparisonResult | null
  leftTitle: string
  rightTitle: string
  leftId?: string | null
  rightId?: string | null
}

const BADGE_GRADIENT = 'linear-gradient(105deg, #fff4d8 5%, #ffd979 100%)'
const CTA_GRADIENT =
  'radial-gradient(ellipse at center, #fefdf6 0%, #ffe8b0 50%, #ffe494 75%, #ffdc74 87.5%, #ffd453 100%)'

export function AiAnalysisSummary({ aiResult, leftTitle, rightTitle, leftId, rightId }: AiAnalysisSummaryProps) {
  if (!aiResult) return null

  // 요약 코멘트 생성 (첫 번째 섹션 코멘트 사용 또는 최종 추천에서 추출)
  const summaryComment = aiResult.sectionComments[0]?.comment ?? aiResult.finalRecommendation

  // 추천 강의 정보
  const isLeftRecommended = aiResult.finalRecommendation.recommended === 'left'
  const recommendedId = isLeftRecommended ? leftId : rightId
  const recommendedTitle = isLeftRecommended ? leftTitle : rightTitle
  const isPrecise = aiResult.recommendationLevel === 'precise'

  return (
    <div className="flex flex-col gap-2.5 overflow-hidden rounded-xl border border-brand-gold bg-brand-gold-light p-3">
      {/* Header - "AI로 분석 완료!" + 배지 */}
      <div className="flex items-center gap-2.5">
        <span className="text-sm font-semibold text-foreground md:text-lg">AI로 분석 완료!</span>
        <span
          className="rounded border-[0.5px] border-brand-gold px-3 py-1 text-xs text-[#bd8700]"
          style={{ background: BADGE_GRADIENT }}
        >
          AI 추천
        </span>
        <span
          className="rounded border-[0.5px] border-brand-gold px-3 py-1 text-xs text-[#bd8700]"
          style={{ background: BADGE_GRADIENT }}
        >
          {isPrecise ? '정밀 추천' : '기본 추천'}
        </span>
      </div>

      {/* 추천 이유 */}
      <p className="whitespace-pre-wrap text-sm text-foreground md:text-base">{summaryComment}</p>

      {/* AI 추천 강의 자세히 보기 버튼 */}
      {recommendedId ? (
        <Link
          href={`/lectures/${recommendedId}`}
          className="flex h-10 w-full items-center justify-center gap-2.5 overflow-hidden rounded-lg border border-brand-gold p-2.5 text-xs text-foreground md:h-[50px] md:text-base"
          style={{ background: CTA_GRADIENT }}
        >
          {/* 데스크톱: 추천 강의 제목 포함 */}
          <span className="hidden md:inline">&lsquo;{recommendedTitle}&rsquo; 강의 자세히 보기</span>
          {/* 모바일: 간략 텍스트 */}
          <span className="md:hidden">AI 추천 강의 자세히 보기</span>
          <FiArrowRight className="size-4 shrink-0 md:size-6" />
        </Link>
      ) : (
        <div
          className="flex h-10 w-full items-center justify-center gap-2.5 overflow-hidden rounded-lg border border-brand-gold p-2.5 text-xs text-foreground opacity-50 md:h-[50px] md:text-base"
          style={{ background: CTA_GRADIENT }}
        >
          AI 추천 강의 자세히 보기
          <FiArrowRight className="size-4 shrink-0 md:size-6" />
        </div>
      )}
    </div>
  )
}
