'use client'

import { useEffect, useRef } from 'react'
import { ChevronDown, ChevronUp, X, ImageOff } from 'lucide-react'
import type { CartItem } from '@/features/cart/types/cart.type'
import { useFloatingBarStore } from '@/store/floating-bar.store'

interface FloatingCartPanelProps {
  items: CartItem[]
  onRemove: (id: string) => void
  onCompare: () => void
  isOpen: boolean
  onToggleOpen: () => void
}

export function FloatingCartPanel({
  items,
  onRemove,
  onCompare,
  isOpen,
  onToggleOpen,
}: FloatingCartPanelProps) {
  const setFloatingBarOpen = useFloatingBarStore((state) => state.setIsOpen)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const dragState = useRef({ isDown: false, startX: 0, scrollLeft: 0 })

  // 로컬 상태를 전역 스토어와 동기화
  useEffect(() => {
    setFloatingBarOpen(isOpen)
  }, [isOpen, setFloatingBarOpen])

  // 마우스 드래그 스크롤 핸들러
  const handleMouseDown = (e: React.MouseEvent) => {
    const el = scrollContainerRef.current
    if (!el) return
    dragState.current = { isDown: true, startX: e.pageX - el.offsetLeft, scrollLeft: el.scrollLeft }
    el.style.cursor = 'grabbing'
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    const el = scrollContainerRef.current
    if (!dragState.current.isDown || !el) return
    e.preventDefault()
    const x = e.pageX - el.offsetLeft
    el.scrollLeft = dragState.current.scrollLeft - (x - dragState.current.startX)
  }

  const handleMouseUpOrLeave = () => {
    const el = scrollContainerRef.current
    if (!el) return
    dragState.current.isDown = false
    el.style.cursor = 'grab'
  }

  if (items.length === 0) return null

  return (
    <>
      {/* ===== Mobile: 하단 플로팅 바 (md 미만) ===== */}
      <div className="md:hidden fixed -bottom-48 left-0 right-0 z-40 max-w-[360px] mx-auto pb-48 bg-[#FFFCF4]">
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
              <span className="text-xs text-black font-medium">관심 과정</span>
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
              {/* 썸네일 리스트 - 터치 스와이프 / 마우스 드래그 가로 스크롤 */}
              <div
                ref={scrollContainerRef}
                className="overflow-x-auto scrollbar-hide"
                style={{ cursor: 'grab' }}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUpOrLeave}
                onMouseLeave={handleMouseUpOrLeave}
              >
                <div
                  className="flex items-center gap-1"
                  style={{ width: `${items.length * (56 + 4)}px`, minWidth: '100%' }}
                >
                  {items.map((item) => (
                    <div
                      key={item.lectureId}
                      className="relative shrink-0 w-14 h-16 rounded-lg overflow-hidden"
                      style={{
                        background: item.thumbnailUrl
                          ? `url(${item.thumbnailUrl}) center/cover`
                          : '#E5E5E5',
                      }}
                    >
                      <button
                        onClick={() => onRemove(item.lectureId)}
                        className="absolute top-1 right-1 w-4 h-4 rounded-full bg-white flex items-center justify-center"
                        style={{ border: '1px solid black' }}
                      >
                        <X className="w-2.5 h-2.5 text-black" />
                      </button>
                      {!item.thumbnailUrl && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-xs text-[#888888] text-center px-1 line-clamp-2">
                            {item.title?.slice(0, 10)}
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
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

      {/* ===== Desktop: 우측 사이드 바 (md 이상) ===== */}
      {/* 사이드바 왼쪽이 컨테이너(1448px) 오른쪽에 붙음, 좁으면 right:16px */}
      <div
        className="hidden md:block fixed top-[140px] z-40"
        style={{ right: 'max(16px, calc(50vw - 796px))' }}
      >
        <div className="w-[72px] bg-[#FFFCF4] rounded-lg border border-[#FEB706] p-2 flex flex-col items-center gap-2 shadow-[2px_2px_10px_rgba(161,161,170,0.25)]">
          {/* Header */}
          <span className="text-[10px] text-black text-center font-medium">관심 과정</span>

          {/* Cart Items - 최대 10개 */}
          <div className="flex flex-col gap-1.5 w-full">
            {items.map((item) => (
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
                <button
                  onClick={() => onRemove(item.lectureId)}
                  className="absolute top-0.5 right-0.5 w-3.5 h-3.5 bg-white rounded-sm flex items-center justify-center border border-black"
                >
                  <X className="w-2.5 h-2.5 text-black" />
                </button>
              </div>
            ))}
          </div>

          {/* AI Compare Button */}
          <button
            onClick={onCompare}
            className="w-full h-6 rounded flex items-center justify-center gap-1"
            style={{
              background: 'linear-gradient(135deg, #FFF4D8 0%, #FEB706 100%)',
            }}
          >
            <span className="text-[10px] text-[#262626] font-medium">AI 비교</span>
          </button>
        </div>
      </div>
    </>
  )
}
