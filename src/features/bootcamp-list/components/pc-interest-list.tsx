'use client'

import { ImageOff } from 'lucide-react'
import type { CartItem } from '@/features/cart/types/cart.type'

interface PCInterestListProps {
  items: CartItem[]
  selectedIds: string[]
  onToggleSelect: (id: string) => void
  isFilterOpen?: boolean
}

export function PCInterestList({
  items,
  selectedIds,
  onToggleSelect,
  isFilterOpen = true,
}: PCInterestListProps) {
  // 필터 열림: 작은 사이즈, 닫힘: 큰 사이즈
  const containerClass = isFilterOpen
    ? 'w-[280px] h-[380px] p-3 gap-3'
    : 'w-[360px] h-[480px] p-4 gap-4'

  const headerClass = isFilterOpen ? 'text-base' : 'text-xl'
  const itemPadding = isFilterOpen ? 'p-2 gap-2' : 'p-3 gap-3'
  const thumbnailSize = isFilterOpen ? 'w-9 h-9' : 'w-12 h-12'
  const titleClass = isFilterOpen ? 'text-xs' : 'text-sm'
  const subTextClass = isFilterOpen ? 'text-[10px]' : 'text-xs'

  return (
    <div className={`${containerClass} flex-shrink-0 bg-white rounded-xl flex flex-col shadow-[4px_4px_20px_rgba(161,161,170,0.25)]`}>
      {/* Header */}
      <h2 className={`${headerClass} font-semibold text-black`}>관심 과정</h2>

      {/* Content - 스크롤 가능 */}
      <div className="flex-1 overflow-y-auto flex flex-col gap-2">
        {items.length === 0 ? (
          <div className="py-8 text-center">
            <span className={`${titleClass} text-[#888888]`}>관심 과정이 없습니다</span>
          </div>
        ) : (
          items.map((item) => {
            const isSelected = selectedIds.includes(item.lectureId)
            // 2개 선택됐고 현재 아이템이 선택되지 않은 경우 비활성화
            const isDisabled = selectedIds.length >= 2 && !isSelected

            return (
              <button
                key={item.lectureId}
                onClick={() => !isDisabled && onToggleSelect(item.lectureId)}
                disabled={isDisabled}
                className={`w-full ${itemPadding} rounded-lg flex items-center text-left transition-all shadow-[2px_2px_10px_rgba(161,161,170,0.15)] ${
                  isSelected
                    ? 'bg-[#FFFCF4] border border-[#FEB706]'
                    : isDisabled
                    ? 'bg-[#F5F5F5] border border-transparent opacity-50 cursor-not-allowed'
                    : 'bg-white border border-transparent hover:bg-[#FAFAFA]'
                }`}
              >
                {/* Thumbnail */}
                <div className={`${thumbnailSize} rounded flex-shrink-0 overflow-hidden`}>
                  {item.thumbnailUrl ? (
                    <div
                      className="w-full h-full bg-cover bg-center"
                      style={{ backgroundImage: `url(${item.thumbnailUrl})` }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-[#E5E5E5]">
                      <ImageOff className="w-4 h-4 text-[#888888]" />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0 flex flex-col gap-0.5">
                  <span className={`${titleClass} text-black font-semibold line-clamp-2 leading-tight`}>
                    {item.title}
                  </span>
                  <span className={`${subTextClass} text-[#888888]`}>풀스텍 개발</span>
                </div>
              </button>
            )
          })
        )}
      </div>
    </div>
  )
}
