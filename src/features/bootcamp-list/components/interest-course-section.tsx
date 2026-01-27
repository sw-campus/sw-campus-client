'use client'

import type { ReactNode } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import type { CartItem } from '@/features/cart/types/cart.type'
import { CourseItem } from './course-item'

interface InterestCourseSectionProps {
  items: CartItem[]
  selectedIds: string[]
  onToggleSelect: (id: string) => void
  onRemove: (id: string) => void
  maxItems?: number
  isOpen: boolean
  onToggleOpen: () => void
  isLoading?: boolean
  closedMessage?: ReactNode
}

export function InterestCourseSection({
  items,
  selectedIds,
  onToggleSelect,
  onRemove,
  maxItems = 10,
  isOpen,
  onToggleOpen,
  isLoading = false,
  closedMessage,
}: InterestCourseSectionProps) {
  return (
    <div className="w-full p-4 bg-white rounded-xl shadow-[4px_4px_20px_rgba(161,161,170,0.25)] flex flex-col gap-4">
      {/* 닫혀있을 때 안내 문구 */}
      {!isOpen && closedMessage && (
        <div className="py-2">
          {closedMessage}
        </div>
      )}

      {/* 헤더 - 클릭하면 토글 */}
      <button
        onClick={onToggleOpen}
        className="w-full flex items-center justify-between"
      >
        <div className="flex items-center gap-2">
          <h3 className="text-base font-semibold text-black">관심 과정</h3>
          {/* 장바구니 스타일 뱃지 */}
          {items.length > 0 && (
            <div className="min-w-[20px] h-5 px-1.5 bg-[#FEB706] rounded-full flex items-center justify-center">
              <span className="text-xs font-bold text-[#020202]">{items.length}</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-[#888888]">{items.length}/{maxItems}</span>
          {isOpen ? (
            <ChevronUp className="w-4 h-4 text-[#888888]" />
          ) : (
            <ChevronDown className="w-4 h-4 text-[#888888]" />
          )}
        </div>
      </button>

      {/* 접었다 펼 수 있는 과정 리스트 */}
      {isOpen && (
        <div className="flex flex-col gap-2 max-h-[160px] overflow-y-auto scrollbar-hide p-2 -m-2">
          {isLoading ? (
            <div className="py-4 text-center text-sm text-[#888888]">
              불러오는 중...
            </div>
          ) : items.length === 0 ? (
            <div className="py-4 text-center text-sm text-[#888888]">
              아래 강의 목록에서 관심등록을 눌러 추가해보세요
            </div>
          ) : (
            items.map((item) => (
              <CourseItem
                key={item.lectureId}
                item={item}
                isSelected={selectedIds.includes(item.lectureId)}
                onClick={() => onToggleSelect(item.lectureId)}
                onRemove={() => onRemove(item.lectureId)}
              />
            ))
          )}
        </div>
      )}
    </div>
  )
}
