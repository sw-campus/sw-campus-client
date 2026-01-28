'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp, X } from 'lucide-react'
import { useRouter, usePathname } from 'next/navigation'

import { useUnifiedCart } from '@/features/cart/hooks/use-unified-cart'
import { useUnifiedRemoveFromCart } from '@/features/cart/hooks/use-unified-remove-from-cart'

export default function FloatingCart() {
  const router = useRouter()
  const pathname = usePathname()

  const { items, hasHydrated } = useUnifiedCart()
  const { mutate: remove } = useUnifiedRemoveFromCart()

  const [isOpen, setIsOpen] = useState(false)

  // bootcamp-list, lecture 상세/검색 페이지에서는 자체 FloatingInterestBar 사용
  if (pathname === '/bootcamp-list' || pathname.startsWith('/lectures/')) return null

  // hydration 완료 전에는 렌더링하지 않음 (flash 방지)
  if (!hasHydrated) return null

  // 비교 페이지에서는 FloatingCart 숨김 (CartItemSidebar가 동일 기능 제공)
  if (pathname === '/cart/compare') return null

  // 아이템이 없으면 표시하지 않음
  if (items.length === 0) return null

  // 최대 10개까지만 표시
  const displayItems = items.slice(0, 10)

  return (
    <div className="fixed -bottom-48 left-0 right-0 z-40 max-w-[360px] mx-auto pb-48 bg-[#FFFCF4] lg:hidden">
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
          onClick={() => setIsOpen(!isOpen)}
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
            {/* 썸네일 리스트 - 가로 스크롤 */}
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-1">
              {displayItems.map((item) => (
                <div
                  key={item.lectureId}
                  className="relative w-14 h-14 shrink-0 rounded-lg overflow-hidden"
                  style={{
                    background: item.thumbnailUrl
                      ? `url(${item.thumbnailUrl}) center/cover`
                      : '#E5E5E5',
                  }}
                >
                  {/* X 버튼 */}
                  <button
                    onClick={() => remove(item.lectureId)}
                    className="absolute top-1 right-1 w-4 h-4 rounded-full bg-white flex items-center justify-center"
                    style={{ border: '1px solid black' }}
                  >
                    <X className="w-2.5 h-2.5 text-black" />
                  </button>

                  {/* 썸네일이 없을 때 플레이스홀더 */}
                  {!item.thumbnailUrl && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-[10px] text-[#888888] text-center px-1 line-clamp-2">
                        {item.title?.slice(0, 6)}
                      </span>
                    </div>
                  )}
                </div>
              ))}

              {/* 빈 슬롯 (최소 5개까지만 표시) */}
              {Array.from({ length: Math.max(0, 5 - displayItems.length) }).map((_, i) => (
                <div
                  key={`empty-${i}`}
                  className="w-14 h-14 shrink-0 rounded-lg bg-[#F0F0F0]"
                />
              ))}
            </div>

            {/* AI 비교 버튼 */}
            <button
              onClick={() => router.push('/cart/compare')}
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
