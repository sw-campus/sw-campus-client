'use client'

import { Fragment, useState, useEffect } from 'react'

import { FiChevronRight, FiChevronDown, FiFolder, FiFolderPlus } from 'react-icons/fi'

import { cn } from '@/lib/utils'

import type { BoardCategory } from '../api/board-category-api.types'

interface CategorySidebarProps {
  categories: BoardCategory[]
  selectedCategoryId: number | null
  onSelect: (categoryId: number | null) => void
}

/**
 * 카테고리 사이드바 네비게이션 컴포넌트
 * - 재귀적 트리 구조 지원 (무한 깊이)
 * - 모던한 글래스모피즘 디자인
 * - 부드러운 애니메이션
 */
export function CategorySidebar({ categories, selectedCategoryId, onSelect }: CategorySidebarProps) {
  // 선택된 카테고리의 조상들을 펼쳐서 보여주기 위해 초기값을 계산
  const [expandedIds, setExpandedIds] = useState<number[]>(() => {
    if (selectedCategoryId === null) return []

    // 선택된 카테고리의 모든 조상 ID 찾기 (트리 펼침용)
    const findAncestorIds = (categoryId: number | null, list: BoardCategory[]): number[] => {
      if (categoryId === null) return []

      for (const category of list) {
        if (category.id === categoryId) return [category.id]
        if (category.children && category.children.length > 0) {
          const path = findAncestorIds(categoryId, category.children)
          if (path.length > 0) {
            return [category.id, ...path]
          }
        }
      }
      return []
    }

    return findAncestorIds(selectedCategoryId, categories)
  })

  // 선택된 카테고리가 변경되면 조상들을 자동으로 펼침
  useEffect(() => {
    if (selectedCategoryId !== null) {
      // 선택된 카테고리의 모든 조상 ID 찾기
      const findAncestorIds = (categoryId: number | null, list: BoardCategory[]): number[] => {
        if (categoryId === null) return []

        for (const category of list) {
          if (category.id === categoryId) return [category.id]
          if (category.children && category.children.length > 0) {
            const path = findAncestorIds(categoryId, category.children)
            if (path.length > 0) {
              return [category.id, ...path]
            }
          }
        }
        return []
      }

      const ancestors = findAncestorIds(selectedCategoryId, categories)
      // 선택된 카테고리의 조상 노드들을 펼침 상태에 추가 (의도적인 props→state 동기화)
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setExpandedIds(prev => {
        const newIds = new Set([...prev, ...ancestors])
        return Array.from(newIds)
      })
    }
  }, [selectedCategoryId, categories])

  const toggleExpand = (id: number, e: React.MouseEvent) => {
    e.stopPropagation()
    setExpandedIds(prev => (prev.includes(id) ? prev.filter(expandedId => expandedId !== id) : [...prev, id]))
  }

  // 재귀적 카테고리 아이템 렌더링 (데스크탑)
  const renderCategoryItem = (category: BoardCategory, depth: number = 0) => {
    const isSelected = selectedCategoryId === category.id
    const isExpanded = expandedIds.includes(category.id)
    const hasChildren = category.children && category.children.length > 0

    return (
      <div key={category.id}>
        <div
          className={cn(
            'group relative flex w-full cursor-pointer items-center justify-between rounded-xl px-3 py-2.5 text-sm transition-all duration-200',
            isSelected
              ? 'bg-gradient-to-r from-orange-500 to-amber-500 font-medium text-white shadow-md shadow-orange-200/50'
              : 'text-gray-600 hover:bg-gray-50/80 hover:text-gray-900',
            depth > 0 && 'ml-3 border-l-2 border-gray-100 pl-3',
          )}
          onClick={() => onSelect(category.id)}
        >
          <span className="flex flex-1 items-center gap-2.5">
            {depth === 0 && (
              <span className={cn(
                'flex h-6 w-6 items-center justify-center rounded-lg transition-colors',
                isSelected ? 'bg-white/20' : 'bg-gray-100'
              )}>
                {hasChildren ? (
                  <FiFolderPlus className={cn('h-3.5 w-3.5', isSelected ? 'text-white' : 'text-gray-500')} />
                ) : (
                  <FiFolder className={cn('h-3.5 w-3.5', isSelected ? 'text-white' : 'text-gray-500')} />
                )}
              </span>
            )}
            <span className="truncate">{category.name}</span>
          </span>
          {hasChildren && (
            <button
              type="button"
              onClick={e => toggleExpand(category.id, e)}
              className={cn(
                'rounded-md p-1 transition-all hover:scale-110',
                isSelected ? 'hover:bg-white/20' : 'hover:bg-gray-100'
              )}
            >
              {isExpanded ? (
                <FiChevronDown className={cn('h-4 w-4', isSelected ? 'text-white' : 'text-gray-400')} />
              ) : (
                <FiChevronRight className={cn('h-4 w-4', isSelected ? 'text-white' : 'text-gray-400')} />
              )}
            </button>
          )}
        </div>

        {/* 자식 카테고리 재귀 렌더링 */}
        {hasChildren && isExpanded && (
          <div className="mt-1 space-y-1">
            {category.children.map(child => renderCategoryItem(child, depth + 1))}
          </div>
        )}
      </div>
    )
  }

  // 모바일용: 선택된 카테고리의 형제들 + 부모로 돌아가기
  const getMobileTabs = () => {
    // 1. 전체 보기 상태면 최상위 카테고리 노출
    if (selectedCategoryId === null) {
      return {
        parent: null,
        siblings: categories,
      }
    }

    // 2. 선택된 카테고리 찾기
    const findCategoryAndParent = (
      targetId: number,
      list: BoardCategory[],
      parent: BoardCategory | null = null,
    ): { target: BoardCategory; parent: BoardCategory | null } | null => {
      for (const cat of list) {
        if (cat.id === targetId) return { target: cat, parent }
        if (cat.children.length > 0) {
          const found = findCategoryAndParent(targetId, cat.children, cat)
          if (found) return found
        }
      }
      return null
    }

    const current = findCategoryAndParent(selectedCategoryId, categories)

    // 선택된 카테고리가 자식이 있으면 -> 그 자식들을 보여줌 (드릴다운)
    // "← 부모" 버튼은 실제 부모로 이동해야 함
    if (current?.target.children && current.target.children.length > 0) {
      return {
        parent: current.parent, // 실제 부모로 설정 (null이면 최상위로 돌아감)
        siblings: current.target.children,
        currentCategory: current.target, // 현재 선택된 카테고리 정보 유지
      }
    }

    // 자식이 없으면 -> 형제들을 보여줌 (같은 레벨 이동)
    const siblings = current?.parent ? current.parent.children : categories
    return {
      parent: current?.parent ?? null,
      siblings: siblings,
    }
  }

  const mobileTabs = getMobileTabs()

  return (
    <>
      {/* 모바일: 드릴다운 방식 탭 */}
      <div className="scrollbar-hide -mx-4 overflow-x-auto px-4 lg:hidden">
        <div className="flex gap-2 pb-3">
          {/* 상위로 가기 버튼 */}
          {/* currentCategory가 있으면 (자식 카테고리를 보여주는 상태) 해당 카테고리명으로 표시 */}
          {mobileTabs.currentCategory ? (
            <button
              type="button"
              onClick={() => onSelect(mobileTabs.parent?.id ?? null)}
              className="shrink-0 rounded-full border border-gray-200/80 bg-white px-4 py-2 text-sm font-medium text-gray-500 shadow-sm transition-all active:scale-95"
            >
              ← {mobileTabs.currentCategory.name}
            </button>
          ) : mobileTabs.parent ? (
            <button
              type="button"
              onClick={() => onSelect(mobileTabs.parent?.id ?? null)}
              className="shrink-0 rounded-full border border-gray-200/80 bg-white px-4 py-2 text-sm font-medium text-gray-500 shadow-sm transition-all active:scale-95"
            >
              ← {mobileTabs.parent.name}
            </button>
          ) : (
            /* 최상위 레벨의 "전체" */
            <button
              type="button"
              onClick={() => onSelect(null)}
              className={cn(
                'shrink-0 rounded-full px-5 py-2 text-sm font-semibold transition-all active:scale-95',
                selectedCategoryId === null
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-200/50'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200',
              )}
            >
              전체
            </button>
          )}

          {/* 형제/자식 리스트 */}
          {mobileTabs.siblings.map(cat => (
            <button
              key={cat.id}
              type="button"
              onClick={() => onSelect(cat.id)}
              className={cn(
                'shrink-0 rounded-full px-5 py-2 text-sm font-semibold whitespace-nowrap transition-all active:scale-95',
                selectedCategoryId === cat.id
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-200/50'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200',
              )}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* 데스크탑: 사이드바 트리 */}
      <aside className="hidden w-64 shrink-0 lg:block">
        <nav className="sticky top-24 space-y-1 rounded-2xl border border-gray-200/60 bg-white/80 p-4 shadow-sm backdrop-blur-xl">
          <h3 className="mb-4 flex items-center gap-2 px-2 text-xs font-bold tracking-wider text-gray-400 uppercase">
            <span className="h-1.5 w-1.5 rounded-full bg-orange-400" />
            카테고리
          </h3>

          {/* 전체 게시글 */}
          <button
            type="button"
            onClick={() => onSelect(null)}
            className={cn(
              'flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200',
              selectedCategoryId === null
                ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-200/50'
                : 'text-gray-700 hover:bg-gray-50',
            )}
          >
            <span className={cn(
              'flex h-6 w-6 items-center justify-center rounded-lg',
              selectedCategoryId === null ? 'bg-white/20' : 'bg-gray-100'
            )}>
              <FiFolder className={cn('h-3.5 w-3.5', selectedCategoryId === null ? 'text-white' : 'text-gray-500')} />
            </span>
            전체 게시글
          </button>

          {/* 구분선 */}
          <div className="my-3 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

          {/* 재귀 트리 */}
          <div className="space-y-1">{categories.map(category => renderCategoryItem(category))}</div>
        </nav>
      </aside>
    </>
  )
}
