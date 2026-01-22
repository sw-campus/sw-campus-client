'use client'

import { cn } from '@/lib/utils'

import type { BoardCategory } from '../api/board-category-api.types'

interface CategoryTabsProps {
  categories: BoardCategory[]
  selectedCategoryId: number | null
  onSelect: (categoryId: number | null) => void
}

/**
 * 카테고리 탭 네비게이션 컴포넌트
 * - 부모/자식 카테고리 2단계 표시
 * - 가로 스크롤 지원
 */
export function CategoryTabs({ categories, selectedCategoryId, onSelect }: CategoryTabsProps) {
  // 선택된 카테고리의 부모 찾기
  const findParentCategory = () => {
    if (selectedCategoryId === null) return null

    // 최상위 카테고리인지 확인
    const topLevel = categories.find(c => c.id === selectedCategoryId)
    if (topLevel) return topLevel

    // 자식 카테고리인지 확인
    for (const parent of categories) {
      const child = parent.children.find(c => c.id === selectedCategoryId)
      if (child) return parent
    }
    return null
  }

  const selectedParent = findParentCategory()
  const childCategories = selectedParent?.children ?? []

  // 선택된 부모 카테고리 ID (자식 선택 시에도 부모 하이라이트)
  const activeParentId = selectedParent?.id ?? null

  return (
    <div className="space-y-3">
      {/* 부모 카테고리 (1단계) */}
      <div className="scrollbar-hide -mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => onSelect(null)}
            className={cn(
              'shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-all',
              selectedCategoryId === null
                ? 'bg-primary text-primary-foreground shadow-md'
                : 'bg-muted text-muted-foreground hover:bg-muted/80',
            )}
          >
            전체
          </button>
          {categories.map(category => (
            <button
              key={category.id}
              type="button"
              onClick={() => onSelect(category.id)}
              className={cn(
                'shrink-0 rounded-full px-4 py-2 text-sm font-medium whitespace-nowrap transition-all',
                activeParentId === category.id
                  ? 'bg-primary text-primary-foreground shadow-md'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80',
              )}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* 자식 카테고리 (2단계) */}
      {childCategories.length > 0 && (
        <div className="scrollbar-hide -mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
          <div className="flex gap-2 pl-2">
            <span className="flex shrink-0 items-center text-sm text-gray-400">└</span>
            <button
              type="button"
              onClick={() => onSelect(selectedParent!.id)}
              className={cn(
                'shrink-0 rounded-lg border px-3 py-1.5 text-sm whitespace-nowrap transition-all',
                selectedCategoryId === selectedParent!.id
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border bg-background text-muted-foreground hover:border-border/80 hover:bg-muted/50',
              )}
            >
              전체
            </button>
            {childCategories.map(child => (
              <button
                key={child.id}
                type="button"
                onClick={() => onSelect(child.id)}
                className={cn(
                  'shrink-0 rounded-lg border px-3 py-1.5 text-sm whitespace-nowrap transition-all',
                  selectedCategoryId === child.id
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border bg-background text-muted-foreground hover:border-border/80 hover:bg-muted/50',
                )}
              >
                {child.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
