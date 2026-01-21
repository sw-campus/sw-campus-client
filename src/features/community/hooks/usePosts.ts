'use client'

import { useQuery, useQueryClient } from '@tanstack/react-query'

import { getPosts } from '../api/postApi.client'
import type { PagedPosts, PostSearchParams } from '../api/postApi.types'

export const postKeys = {
  all: ['posts'] as const,
  lists: () => [...postKeys.all, 'list'] as const,
  list: (params: PostSearchParams) => [...postKeys.lists(), params] as const,
  details: () => [...postKeys.all, 'detail'] as const,
  detail: (id: number) => [...postKeys.details(), id] as const,
}

/**
 * 게시글 목록 조회 훅
 */
export function usePosts(params: PostSearchParams = {}) {
  return useQuery<PagedPosts, Error>({
    queryKey: postKeys.list(params),
    queryFn: () => getPosts(params),
    staleTime: 1000 * 60, // 1분간 캐시
  })
}

/**
 * 게시글 목록 캐시 무효화 훅
 */
export function useInvalidatePosts() {
  const queryClient = useQueryClient()

  return () => {
    queryClient.invalidateQueries({ queryKey: postKeys.lists() })
  }
}
