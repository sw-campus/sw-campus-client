'use client'

import { useQuery } from '@tanstack/react-query'

import { getBoardCategories } from '../api/board-category-api.client'
import type { BoardCategory } from '../api/board-category-api.types'

export const boardCategoryKeys = {
  all: ['boardCategories'] as const,
  tree: () => [...boardCategoryKeys.all, 'tree'] as const,
}

/**
 * 게시판 카테고리 트리 조회 훅
 */
export function useBoardCategories() {
  return useQuery<BoardCategory[], Error>({
    queryKey: boardCategoryKeys.tree(),
    queryFn: getBoardCategories,
    staleTime: 1000 * 60 * 10, // 10분간 캐시
  })
}
