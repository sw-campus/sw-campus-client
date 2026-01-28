'use client'

import { ImageOff } from 'lucide-react'
import { useRouter } from 'next/navigation'

import type { CartItem } from '@/features/cart/types/cart.type'
import { useCartCompareStore } from '@/store/cart-compare.store'

interface AiComparePreviewProps {
  selectedItems: (CartItem | null)[]
  compact?: boolean
}

export function AiComparePreview({ selectedItems, compact = false }: AiComparePreviewProps) {
  const router = useRouter()
  const { setLeftId, setRightId } = useCartCompareStore()

  const item1 = selectedItems[0] ?? undefined
  const item2 = selectedItems[1] ?? undefined

  const handleGoToCompare = () => {
    if (!item1 || !item2) return
    setLeftId(item1.lectureId)
    setRightId(item2.lectureId)
    router.push('/cart/compare')
  }

  return (
    <div className="flex h-full w-full flex-col gap-3">
      {/* AI 추천 텍스트 배너 */}
      <div className={`w-full shrink-0 rounded-xl bg-[#FFFCF4] shadow-[2px_2px_10px_rgba(161,161,170,0.25)] flex flex-col gap-1.5 ${compact ? 'p-3' : 'p-4'}`}>
        <h3 className={`font-semibold text-[#020202] text-center ${compact ? 'text-sm' : 'text-base'}`}>
          <span className="text-[#FEB706]">AI 비교분석 기능</span>으로 최적의 강의를 한 눈에 비교해보세요.
        </h3>
        <p className={`text-black leading-relaxed text-center ${compact ? 'text-xs' : 'text-sm'}`}>
          관심 과정에서 비교할 강의를 선택하면 AI가 자동으로 분석하여 최적의 강의를 추천해 드립니다.
        </p>
      </div>

      {/* VS Comparison — flex-1로 남은 공간 채움 */}
      <div className="relative flex min-h-0 flex-1 items-stretch gap-4">
        {/* Card 1 */}
        <CompareCard item={item1} compact={compact} />

        {/* VS Badge */}
        <div className={`absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#020202] flex items-center justify-center ${compact ? 'size-[50px]' : 'size-[60px]'}`}>
          <span className={`font-bold text-[#FEB706] ${compact ? 'text-lg' : 'text-xl'}`}>VS</span>
        </div>

        {/* Card 2 */}
        <CompareCard item={item2} compact={compact} />
      </div>

      {/* AI 비교 분석 서비스로 이동하기 */}
      <button
        onClick={handleGoToCompare}
        className={`w-full shrink-0 rounded-xl border border-[#D1D5DB] bg-[#F9F9F9] shadow-[4px_4px_12px_rgba(0,0,0,0.15)] flex items-center justify-center ${compact ? 'h-9' : 'h-11'} ${(!item1 || !item2) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#FEB706] hover:border-[#FEB706] transition-colors'}`}
        disabled={!item1 || !item2}
      >
        <span className={`text-[#020202] ${compact ? 'text-sm' : 'text-base'}`}>비교 결과 확인하기</span>
      </button>
    </div>
  )
}

function CompareCard({ item, compact }: { item?: CartItem; compact: boolean }) {
  return (
    <div className={`flex flex-1 flex-col gap-2 rounded-xl bg-white shadow-[4px_4px_20px_rgba(161,161,170,0.25)] ${compact ? 'p-3' : 'p-4'}`}>
      {/* 썸네일 */}
      <div className={`w-full shrink-0 overflow-hidden rounded-lg bg-[#E5E5E5] ${compact ? 'h-[80px]' : 'h-[120px]'}`}>
        {item ? (
          item.thumbnailUrl ? (
            <div
              className="h-full w-full bg-cover bg-center"
              style={{ backgroundImage: `url(${item.thumbnailUrl})` }}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-[#E5E5E5]">
              <ImageOff className="size-6 text-[#888888]" />
            </div>
          )
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-[#E5E5E5]">
            <span className="text-xs text-[#888888]">이미지 없음</span>
          </div>
        )}
      </div>

      {/* 타이틀 */}
      <div className="flex flex-1 items-center justify-center">
        <h4 className={`font-bold text-[#020202] text-center ${compact ? 'text-sm line-clamp-1' : 'text-base line-clamp-2'}`}>
          {item ? item.title : <span className={`font-normal text-[#888888] ${compact ? 'text-xs' : 'text-sm'}`}>강의를 선택해주세요</span>}
        </h4>
      </div>

      {/* 자세히 보기 */}
      <button
        className={`w-full shrink-0 rounded-lg bg-[#F9F9F9] flex items-center justify-center ${compact ? 'h-8' : 'h-10'} ${!item ? 'opacity-50 cursor-not-allowed' : ''}`}
        disabled={!item}
      >
        <span className={`text-[#020202] ${compact ? 'text-xs' : 'text-sm'}`}>자세히 보기</span>
      </button>
    </div>
  )
}
