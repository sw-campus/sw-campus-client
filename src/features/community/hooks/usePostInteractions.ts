import { useMutation, useQueryClient } from '@tanstack/react-query'

import { togglePostLike, toggleBookmark } from '../api/interactionApi.client'
import { togglePin } from '../api/postApi.client'
import type { PostDetail } from '../api/postApi.types'
import { postKeys } from './usePosts'

/**
 * 게시글 좋아요 토글 Mutation Hook (Optimistic Update)
 */
export function useToggleLike(postId: number) {
  const queryClient = useQueryClient()
  const queryKey = postKeys.detail(postId)

  return useMutation({
    mutationFn: () => togglePostLike(postId),
    onMutate: async () => {
      // 진행 중인 쿼리 취소
      await queryClient.cancelQueries({ queryKey })

      // 이전 값 스냅샷
      const previousPost = queryClient.getQueryData<PostDetail>(queryKey)

      // Optimistic Update: 즉시 UI 변경
      if (previousPost) {
        queryClient.setQueryData<PostDetail>(queryKey, {
          ...previousPost,
          isLiked: !previousPost.isLiked,
          likeCount: previousPost.isLiked
            ? previousPost.likeCount - 1
            : previousPost.likeCount + 1,
        })
      }

      return { previousPost }
    },
    onError: (_err, _variables, context) => {
      // 에러 시 롤백
      if (context?.previousPost) {
        queryClient.setQueryData(queryKey, context.previousPost)
      }
    },
    onSettled: () => {
      // 성공/실패 후 캐시 갱신 (상세 + 목록)
      queryClient.invalidateQueries({ queryKey })
      queryClient.invalidateQueries({ queryKey: postKeys.lists() })
    },
  })
}

/**
 * 게시글 북마크 토글 Mutation Hook (Optimistic Update)
 */
export function useToggleBookmark(postId: number) {
  const queryClient = useQueryClient()
  const queryKey = postKeys.detail(postId)

  return useMutation({
    mutationFn: () => toggleBookmark(postId),
    onMutate: async () => {
      // 진행 중인 쿼리 취소
      await queryClient.cancelQueries({ queryKey })

      // 이전 값 스냅샷
      const previousPost = queryClient.getQueryData<PostDetail>(queryKey)

      // Optimistic Update: 즉시 UI 변경
      if (previousPost) {
        queryClient.setQueryData<PostDetail>(queryKey, {
          ...previousPost,
          isBookmarked: !previousPost.isBookmarked,
        })
      }

      return { previousPost }
    },
    onError: (_err, _variables, context) => {
      // 에러 시 롤백
      if (context?.previousPost) {
        queryClient.setQueryData(queryKey, context.previousPost)
      }
    },
    onSettled: () => {
      // 성공/실패 후 캐시 갱신 (상세 + 목록)
      queryClient.invalidateQueries({ queryKey })
      queryClient.invalidateQueries({ queryKey: postKeys.lists() })
    },
  })
}

/**
 * 게시글 고정(공지) 토글 Mutation Hook (Optimistic Update)
 */
export function useTogglePin(postId: number) {
  const queryClient = useQueryClient()
  const queryKey = postKeys.detail(postId)

  return useMutation({
    mutationFn: () => togglePin(postId),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey })
      const previousPost = queryClient.getQueryData<PostDetail>(queryKey)

      if (previousPost) {
        queryClient.setQueryData<PostDetail>(queryKey, {
          ...previousPost,
          pinned: !previousPost.pinned,
        })
      }

      return { previousPost }
    },
    onError: (_err, _variables, context) => {
      if (context?.previousPost) {
        queryClient.setQueryData(queryKey, context.previousPost)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey })
      queryClient.invalidateQueries({ queryKey: postKeys.lists() })
    },
  })
}
