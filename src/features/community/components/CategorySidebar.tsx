'use client'

import { Fragment } from 'react'

import { FiChevronRight, FiChevronDown } from 'react-icons/fi'

import { cn } from '@/lib/utils'

import type { BoardCategory } from '../api/boardCategoryApi.types'

interface CategorySidebarProps {
  categories: BoardCategory[]
  selectedCategoryId: number | null
  onSelect: (categoryId: number | null) => void
}

/**
 * 카테고리 사이드바 네비게이션 컴포넌트
 * - 재귀적 트리 구조 지원 (무한 깊이)
 * - 데스크탑: 사이드바 트리
 * - 모바일: 가로 스크롤 탭
 */
export function CategorySidebar({ categories, selectedCategoryId, onSelect }: CategorySidebarProps) {
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

  const ancestorIds = findAncestorIds(selectedCategoryId, categories)

  // 재귀적 카테고리 아이템 렌더링 (데스크탑)
  const renderCategoryItem = (category: BoardCategory, depth: number = 0) => {
    const isSelected = selectedCategoryId === category.id
    const isExpanded = ancestorIds.includes(category.id) || isSelected
    const hasChildren = category.children && category.children.length > 0

    return (
      <div key={category.id}>
        <button
          type="button"
          onClick={() => onSelect(category.id)}
          className={cn(
            'flex w-full items-center justify-between rounded-lg px-2 py-1.5 text-sm transition-colors',
            isSelected
              ? 'bg-orange-50 font-medium text-orange-600'
              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
            depth > 0 && 'ml-3 border-l border-gray-100 pl-3',
          )}
        >
          <span className="flex items-center gap-2">
            {depth === 0 && <span className="h-1.5 w-1.5 rounded-full bg-current opacity-60" />}
            {category.name}
          </span>
          {hasChildren &&
            (isExpanded ? (
              <FiChevronDown className="h-3.5 w-3.5 opacity-50" />
            ) : (
              <FiChevronRight className="h-3.5 w-3.5 opacity-50" />
            ))}
        </button>

        {/* 자식 카테고리 재귀 렌더링 */}
        {hasChildren && isExpanded && (
          <div className="mt-0.5 space-y-0.5">
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
        <div className="flex gap-2 pb-2">
          {/* 상위로 가기 버튼 */}
          {/* currentCategory가 있으면 (자식 카테고리를 보여주는 상태) 해당 카테고리명으로 표시 */}
          {mobileTabs.currentCategory ? (
            <button
              type="button"
              onClick={() => onSelect(mobileTabs.parent?.id ?? null)}
              className="shrink-0 rounded-full border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-500 shadow-sm"
            >
              ← {mobileTabs.currentCategory.name}
            </button>
          ) : mobileTabs.parent ? (
            <button
              type="button"
              onClick={() => onSelect(mobileTabs.parent?.id ?? null)}
              className="shrink-0 rounded-full border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-500 shadow-sm"
            >
              ← {mobileTabs.parent.name}
            </button>
          ) : (
            /* 최상위 레벨의 "전체" */
            <button
              type="button"
              onClick={() => onSelect(null)}
              className={cn(
                'shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-all',
                selectedCategoryId === null
                  ? 'bg-orange-500 text-white shadow-md'
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
                'shrink-0 rounded-full px-4 py-2 text-sm font-medium whitespace-nowrap transition-all',
                selectedCategoryId === cat.id
                  ? 'bg-orange-500 text-white shadow-md'
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
        <nav className="sticky top-24 space-y-1 rounded-xl border border-gray-200 bg-white p-3 shadow-sm">
          <h3 className="mb-3 px-3 text-xs font-semibold tracking-wider text-gray-400 uppercase">카테고리</h3>

          {/* 전체 게시글 */}
          <button
            type="button"
            onClick={() => onSelect(null)}
            className={cn(
              'flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
              selectedCategoryId === null ? 'bg-orange-50 text-orange-600' : 'text-gray-700 hover:bg-gray-50',
            )}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-current opacity-60" />
            전체 게시글
          </button>

          {/* 재귀 트리 */}
          <div className="mt-2 space-y-1">{categories.map(category => renderCategoryItem(category))}</div>
        </nav>
      </aside>
    </>
  )
}
