'use client'

import { useEffect, useState } from 'react'
import { X, ImageOff } from 'lucide-react'
import type { CartItem } from '@/features/cart/types/cart.type'

interface PCCartSidebarProps {
  items: CartItem[]
  onRemove: (id: string) => void
  onCompare: () => void
}

export function PCCartSidebar({
  items,
  onRemove,
  onCompare,
}: PCCartSidebarProps) {
  const [leftPosition, setLeftPosition] = useState<number | null>(null)
  const topPosition = 140 // 히어로 배너 상단에 맞춤

  // [data-main-content] 요소를 찾아서 위치 계산
  // bootcamp-list와 동일한 위치에 표시되도록 max-w-[1448px] 기준으로 계산
  useEffect(() => {
    const CART_WIDTH = 72
    const GAP = 12
    const MAX_CONTENT_WIDTH = 1448
    const PADDING = 24

    const updatePosition = () => {
      const windowWidth = window.innerWidth

      // max-w-[1448px] 컨테이너 기준으로 위치 계산
      // 컨테이너가 화면 중앙에 위치하므로, 컨테이너 오른쪽 끝 위치 계산
      const contentWidth = Math.min(windowWidth, MAX_CONTENT_WIDTH)
      const containerLeft = (windowWidth - contentWidth) / 2
      const containerRight = containerLeft + contentWidth - PADDING // padding 제외

      // 장바구니 위치: 컨테이너 오른쪽 끝 + gap
      const desiredLeft = containerRight + GAP

      // 화면 밖으로 나가지 않도록 제한
      const maxLeft = windowWidth - CART_WIDTH - GAP
      const finalLeft = Math.min(desiredLeft, maxLeft)

      // 화면에 표시할 공간이 있을 때만 위치 설정
      if (finalLeft > containerRight - 100) {
        setLeftPosition(finalLeft)
      } else {
        setLeftPosition(null)
      }
    }

    updatePosition()
    window.addEventListener('resize', updatePosition)

    return () => {
      window.removeEventListener('resize', updatePosition)
    }
  }, [])

  // 최대 5개까지만 표시
  const maxDisplay = 5
  const limitedItems = items.slice(0, maxDisplay)

  // 위치가 계산되지 않으면 렌더링하지 않음
  if (leftPosition === null) return null

  return (
    <div
      className="hidden xl:block fixed z-40"
      style={{ left: leftPosition, top: topPosition }}
    >
      <div className="w-[72px] bg-[#FFFCF4] rounded-lg border border-[#FEB706] p-2 flex flex-col items-center gap-2 shadow-[2px_2px_10px_rgba(161,161,170,0.25)]">
        {/* Header */}
        <span className="text-[10px] text-black text-center font-medium">관심 항목</span>

        {/* Cart Items */}
        {items.length === 0 ? (
          <div className="py-2 px-1">
            <span className="text-[8px] text-[#888888] text-center">비어있음</span>
          </div>
        ) : (
          <div className="flex flex-col gap-1.5 w-full">
            {limitedItems.map((item) => (
              <div
                key={item.lectureId}
                className="relative w-[56px] h-[56px] mx-auto rounded-md overflow-hidden"
              >
                {item.thumbnailUrl ? (
                  <div
                    className="w-full h-full bg-cover bg-center"
                    style={{ backgroundImage: `url(${item.thumbnailUrl})` }}
                  />
                ) : (
                  <div className="w-full h-full bg-[#E5E5E5] flex items-center justify-center">
                    <ImageOff className="w-4 h-4 text-[#888888]" />
                  </div>
                )}
                {/* Remove button - 오른쪽 상단 */}
                <button
                  onClick={() => onRemove(item.lectureId)}
                  className="absolute top-0.5 right-0.5 w-3.5 h-3.5 bg-white rounded-sm flex items-center justify-center border border-black"
                >
                  <X className="w-2.5 h-2.5 text-black" />
                </button>
              </div>
            ))}
            {items.length > maxDisplay && (
              <span className="text-[8px] text-[#888888] text-center">+{items.length - maxDisplay}개 더</span>
            )}
          </div>
        )}

        {/* AI Compare Button */}
        {items.length >= 2 && (
          <button
            onClick={onCompare}
            className="w-full h-6 rounded flex items-center justify-center gap-1"
            style={{
              background: 'linear-gradient(135deg, #FFF4D8 0%, #FEB706 100%)',
            }}
          >
            <span className="text-[10px]">✨</span>
            <span className="text-[10px] text-[#262626] font-medium">AI 비교</span>
          </button>
        )}
      </div>
    </div>
  )
}
