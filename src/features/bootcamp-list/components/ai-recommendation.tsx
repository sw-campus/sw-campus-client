'use client'

import { AIComparison } from '../types'
import { ComparisonCard } from './comparison-card'

interface AIRecommendationProps {
  comparison: AIComparison
  onViewDetail: () => void
}

export function AIRecommendation({ comparison, onViewDetail }: AIRecommendationProps) {
  return (
    <div className="w-full flex flex-col gap-4">
      {/* Recommendation Box */}
      <div className="w-full p-4 bg-[#FFFCF4] rounded-xl shadow-[2px_2px_10px_rgba(161,161,170,0.25)] overflow-hidden flex flex-col gap-2">
        <p className="text-sm font-semibold text-[#020202] text-center">
          {comparison.recommendation}
        </p>
        <p className="text-xs text-black">
          {comparison.description}
        </p>
      </div>

      {/* Comparison Cards */}
      <div className="relative flex items-center gap-4">
        <ComparisonCard
          title={comparison.courseA.title}
          imageUrl={comparison.courseA.imageUrl}
        />

        {/* VS Badge */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[45px] h-[45px] p-2.5 bg-[#020202] rounded-full flex items-center justify-center overflow-hidden">
          <span className="text-base font-bold text-[#FEB706]">VS</span>
        </div>

        <ComparisonCard
          title={comparison.courseB.title}
          imageUrl={comparison.courseB.imageUrl}
        />
      </div>

      {/* Detail Button */}
      <button
        onClick={onViewDetail}
        className="w-full h-10 p-4 bg-[#F9F9F9] rounded-xl shadow-[2px_2px_10px_rgba(161,161,170,0.25)] overflow-hidden flex items-center justify-center"
      >
        <span className="text-xs text-[#020202]">AI 비교 분석 자세히 보기</span>
      </button>
    </div>
  )
}
