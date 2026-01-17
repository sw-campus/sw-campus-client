'use client'

import { useQuery } from '@tanstack/react-query'

import { getPost } from '../api/postApi.client'
import type { PostDetail } from '../api/postApi.types'
import { postKeys } from './usePosts'

/**
 * 게시글 상세 조회 훅
 */
export function usePostDetail(postId: number) {
  return useQuery<PostDetail, Error>({
    queryKey: postKeys.detail(postId),
    queryFn: () => getPost(postId),
    enabled: !!postId,
  })
}
