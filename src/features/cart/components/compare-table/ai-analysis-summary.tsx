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

export function AiAnalysisSummary({ aiResult, leftTitle, rightTitle, leftId, rightId }: AiAnalysisSummaryProps) {
  if (!aiResult) return null

  // 요약 코멘트 생성 (첫 번째 섹션 코멘트 사용 또는 최종 추천에서 추출)
  const summaryComment = aiResult.sectionComments[0]?.comment ?? aiResult.finalRecommendation

  // 우세한 쪽 계산
  const advantageCounts = aiResult.sectionComments.reduce(
    (acc, comment) => {
      if (comment.advantage === 'left') acc.left++
      else if (comment.advantage === 'right') acc.right++
      else acc.equal++
      return acc
    },
    { left: 0, right: 0, equal: 0 },
  )

  const getAdvantageText = () => {
    if (advantageCounts.left > advantageCounts.right) {
      return `${leftTitle}이(가) ${advantageCounts.left}개 항목에서 유리합니다.`
    } else if (advantageCounts.right > advantageCounts.left) {
      return `${rightTitle}이(가) ${advantageCounts.right}개 항목에서 유리합니다.`
    }
    return '두 과정이 비슷한 수준입니다.'
  }

  // 추천 강의 정보
  const isLeftRecommended = aiResult.finalRecommendation.recommended === 'left'
  const recommendedId = isLeftRecommended ? leftId : rightId
  const isPrecise = aiResult.recommendationLevel === 'precise'

  return (
    <>
      {/* 모바일: Figma 스타일 - 흰색 배경 + 노란 테두리 */}
      <div className="overflow-hidden rounded-[8px] border border-[#feb706] bg-white p-3 md:hidden">
        {/* Header - "AI로 분석 완료!" */}
        <div className="mb-2 flex items-center gap-2">
          <div className="flex size-6 items-center justify-center rounded-full bg-yellow-400">
            <PiRobotDuotone className="size-4 text-yellow-900" />
          </div>
          <span className="text-xs font-bold text-foreground">AI로 분석 완료!</span>
        </div>

        {/* 배지: AI 추천 / 정밀 추천 */}
        <div className="mb-2 flex items-center gap-1.5">
          <span className="rounded-full bg-purple-100 px-2 py-0.5 text-[10px] font-semibold text-purple-700">
            AI 추천
          </span>
          <span
            className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
              isPrecise ? 'bg-purple-100 text-purple-700' : 'bg-amber-100 text-amber-700'
            }`}
          >
            {isPrecise ? '정밀 추천' : '기본 추천'}
          </span>
        </div>

        {/* 추천 이유 */}
        <p className="mb-3 text-xs leading-relaxed text-muted-foreground">{summaryComment}</p>

        {/* AI 추천 강의 자세히 보기 버튼 - 노란색 */}
        {recommendedId ? (
          <Button asChild className="h-8 w-full bg-yellow-400 text-xs font-semibold text-yellow-900 hover:bg-yellow-500">
            <Link href={`/lectures/${recommendedId}`}>
              AI 추천 강의 자세히 보기
              <FiArrowRight className="ml-1 size-3.5" />
            </Link>
          </Button>
        ) : (
          <Button disabled className="h-8 w-full bg-yellow-400 text-xs font-semibold text-yellow-900">
            AI 추천 강의 자세히 보기
            <FiArrowRight className="ml-1 size-3.5" />
          </Button>
        )}
      </div>

      {/* 데스크톱: 기존 노란색 배경 스타일 유지 */}
      <div className="hidden rounded-xl bg-yellow-50 p-6 md:block">
        {/* Header */}
        <div className="mb-3 flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-full bg-yellow-400">
            <PiRobotDuotone className="size-5 text-yellow-900" />
          </div>
          <span className="text-base font-bold text-yellow-900">AI의 분석 결과</span>
        </div>

        {/* Summary */}
        <p className="mb-3 text-base leading-relaxed text-gray-800">{summaryComment}</p>

        {/* Advantage Summary */}
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <span className="rounded-full bg-yellow-200 px-3 py-1 font-medium text-yellow-900">{getAdvantageText()}</span>
          <span className="text-gray-500">
            ({leftTitle}: {advantageCounts.left}개 / {rightTitle}: {advantageCounts.right}개 / 비슷: {advantageCounts.equal}
            개)
          </span>
        </div>
      </div>
    </>
  )
}
