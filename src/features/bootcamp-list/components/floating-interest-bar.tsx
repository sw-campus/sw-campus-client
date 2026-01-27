'use client'

import { useEffect } from 'react'
import { ChevronDown, ChevronUp, X } from 'lucide-react'
import type { CartItem } from '@/features/cart/types/cart.type'
import { useFloatingBarStore } from '@/store/floating-bar.store'

interface FloatingInterestBarProps {
  items: CartItem[]
  onRemove: (id: string) => void
  onCompare: () => void
  isOpen: boolean
  onToggleOpen: () => void
}

export function FloatingInterestBar({
  items,
  onRemove,
  onCompare,
  isOpen,
  onToggleOpen,
}: FloatingInterestBarProps) {
  const setFloatingBarOpen = useFloatingBarStore((state) => state.setIsOpen)

  // 로컬 상태를 전역 스토어와 동기화
  useEffect(() => {
    setFloatingBarOpen(isOpen)
  }, [isOpen, setFloatingBarOpen])
  if (items.length === 0) return null

  // 최대 5개까지만 표시
  const displayItems = items.slice(0, 5)

  return (
    <div className="fixed -bottom-48 left-0 right-0 z-40 max-w-[360px] mx-auto pb-48 bg-[#FFFCF4]">
      <div
        className="p-3 flex flex-col gap-3"
        style={{
          background: '#FFFCF4',
          boxShadow: '2px 2px 10px rgba(161, 161, 170, 0.25)',
          borderTopLeftRadius: 12,
          borderTopRightRadius: 12,
          border: '1px solid #FEB706',
          borderBottom: 'none',
        }}
      >
        {/* 헤더 - 클릭하면 토글 */}
        <button
          onClick={onToggleOpen}
          className="w-full flex items-center justify-between"
        >
          <div className="flex items-center gap-2">
            <span className="text-xs text-black font-medium">관심 항목</span>
            {/* 뱃지 */}
            <div className="min-w-[20px] h-5 px-1.5 bg-[#FEB706] rounded-full flex items-center justify-center">
              <span className="text-xs font-bold text-[#020202]">{items.length}</span>
            </div>
          </div>
          {isOpen ? (
            <ChevronDown className="w-4 h-4 text-[#888888]" />
          ) : (
            <ChevronUp className="w-4 h-4 text-[#888888]" />
          )}
        </button>

        {/* 펼쳐진 상태에서만 내용 표시 */}
        {isOpen && (
          <>
            {/* 썸네일 리스트 */}
            <div className="flex items-center gap-1">
              {displayItems.map((item) => (
                <div
                  key={item.lectureId}
                  className="relative flex-1 h-16 rounded-lg overflow-hidden"
                  style={{
                    background: item.thumbnailUrl
                      ? `url(${item.thumbnailUrl}) center/cover`
                      : '#E5E5E5',
                  }}
                >
                  {/* X 버튼 */}
                  <button
                    onClick={() => onRemove(item.lectureId)}
                    className="absolute top-1 right-1 w-4 h-4 rounded-full bg-white flex items-center justify-center"
                    style={{ border: '1px solid black' }}
                  >
                    <X className="w-2.5 h-2.5 text-black" />
                  </button>

                  {/* 썸네일이 없을 때 플레이스홀더 */}
                  {!item.thumbnailUrl && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xs text-[#888888] text-center px-1 line-clamp-2">
                        {item.title?.slice(0, 10)}
                      </span>
                    </div>
                  )}
                </div>
              ))}

              {/* 빈 슬롯 (5개 미만일 때) */}
              {Array.from({ length: Math.max(0, 5 - displayItems.length) }).map((_, i) => (
                <div
                  key={`empty-${i}`}
                  className="flex-1 h-16 rounded-lg bg-[#F0F0F0]"
                />
              ))}
            </div>

            {/* AI 비교 버튼 */}
            <button
              onClick={onCompare}
              className="w-full h-10 bg-[#262626] rounded-lg flex items-center justify-center"
            >
              <span className="text-xs text-[#FEB706] font-medium">
                AI 비교분석
              </span>
            </button>
          </>
        )}
      </div>
    </div>
  )
}
