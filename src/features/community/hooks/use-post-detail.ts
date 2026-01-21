'use client'

import React from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'

import { useAuthStore } from '@/store/auth-store'

import { getPost } from '../api/post-api.client'
import type { PostDetail } from '../api/post-api.types'
import { postKeys } from './use-posts'

/**
 * 게시글 상세 조회 훅
 * - hydration 완료 후 게시글을 조회하여 인증 토큰이 포함되도록 함
 * - 로그인 상태가 변경되면 자동으로 다시 조회 (isLiked 등 사용자별 상태 갱신)
 */
export function usePostDetail(postId: number) {
  const queryClient = useQueryClient()
  const hasHydrated = useAuthStore(state => state.hasHydrated)
  const isLoggedIn = useAuthStore(state => state.isLoggedIn)
  const prevIsLoggedIn = React.useRef(isLoggedIn)

  // 로그인 상태 변경 시 게시글 다시 조회
  React.useEffect(() => {
    if (hasHydrated && prevIsLoggedIn.current !== isLoggedIn) {
      prevIsLoggedIn.current = isLoggedIn
      queryClient.invalidateQueries({ queryKey: postKeys.detail(postId) })
    }
  }, [isLoggedIn, hasHydrated, postId, queryClient])

  return useQuery<PostDetail, Error>({
    queryKey: postKeys.detail(postId),
    queryFn: () => getPost(postId),
    enabled: !!postId && hasHydrated,
  })
}
