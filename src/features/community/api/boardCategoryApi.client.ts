import { api } from '@/lib/axios'

import { ApiBoardCategory, BoardCategory, mapApiBoardCategoryToBoardCategory } from './boardCategoryApi.types'

/**
 * 게시판 카테고리 트리 조회 API
 * GET /api/v1/board-categories/tree
 */
export async function getBoardCategories(): Promise<BoardCategory[]> {
  const { data } = await api.get<ApiBoardCategory[]>('/board-categories/tree')
  return data.map(mapApiBoardCategoryToBoardCategory)
}
