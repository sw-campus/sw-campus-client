'use client'

import { cn } from '@/lib/utils'
import type { CartItem } from '@/features/cart/types/cart.type'
import { InterestLectureItem } from './interest-lecture-item'

interface InterestLectureListProps {
  items: CartItem[]
  selectedIds: string[]
  onToggleSelect: (id: string) => void
  onRemove?: (id: string) => void
  lockedCategory?: string | null
  maxSelections?: number
  variant?: 'sidebar' | 'card'
  title?: string
  emptyMessage?: string
  className?: string
}

export function InterestLectureList({
  items,
  selectedIds,
  onToggleSelect,
  onRemove,
  lockedCategory = null,
  maxSelections = 2,
  variant = 'sidebar',
  title = '관심 과정',
  emptyMessage = '관심 과정이 없습니다',
  className,
}: InterestLectureListProps) {
  const maxReached = selectedIds.length >= maxSelections

  return (
    <div
      className={cn(
        'flex min-h-0 flex-col',
        variant === 'sidebar'
          ? 'shrink-0 rounded-xl bg-white shadow-card'
          : '',
        variant === 'sidebar' ? 'p-3 gap-3' : 'gap-2',
        className,
      )}
    >
      {/* 헤더 */}
      <h3
        className={cn(
          'shrink-0 font-semibold text-foreground',
          variant === 'sidebar' ? 'text-xl' : 'pl-1 text-base',
        )}
      >
        {title}
      </h3>

      {/* 리스트 — @container로 아이템 반응형 지원 */}
      <div
        className={cn(
          '@container flex flex-1 min-h-0 flex-col gap-2 overflow-y-auto',
          variant === 'card' && 'scrollbar-hide overflow-x-visible p-1',
        )}
      >
        {items.length === 0 ? (
          <div className="py-8 text-center">
            <span className="text-sm text-muted-foreground">{emptyMessage}</span>
          </div>
        ) : (
          items.map((item) => {
            const isSelected = selectedIds.includes(item.lectureId)
            const isCategoryLocked =
              lockedCategory !== null &&
              item.categoryName !== lockedCategory &&
              !isSelected
            const isDisabled = isCategoryLocked || (maxReached && !isSelected)

            return (
              <InterestLectureItem
                key={item.lectureId}
                item={item}
                isSelected={isSelected}
                disabled={isDisabled}
                onClick={() => onToggleSelect(item.lectureId)}
                onRemove={onRemove ? () => onRemove(item.lectureId) : undefined}
              />
            )
          })
        )}
      </div>
    </div>
  )
}
