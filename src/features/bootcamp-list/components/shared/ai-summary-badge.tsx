'use client'

import { Sparkles } from 'lucide-react'

/**
 * AI 요약 배지 컴포넌트
 * 모바일/PC 반응형 자동 적용
 */
export function AISummaryBadge() {
  return (
    <div className="px-3 lg:px-4 py-1 lg:py-1.5 bg-gradient-to-r from-[#FFF4D8] to-[#FACC5A] rounded-full border border-[#FEB706] flex items-center gap-1 lg:gap-1.5">
      <Sparkles className="w-3 h-3 lg:w-4 lg:h-4 text-black" />
      <span className="text-xs lg:text-sm text-[#020202]">AI 요약</span>
    </div>
  )
}
