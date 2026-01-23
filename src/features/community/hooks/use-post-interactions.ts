import { useMutation, useQueryClient } from '@tanstack/react-query'

import { togglePostLike, toggleBookmark } from '../api/interaction-api.client'
import { togglePin } from '../api/post-api.client'
import type { PostDetail } from '../api/post-api.types'
import { postKeys } from './use-posts'

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
            ? Math.max(0, previousPost.likeCount - 1)
            : previousPost.likeCount + 1,
        })
      }

      return { previousPost }
    },
    onSuccess: (data) => {
      // 서버 응답을 기반으로 캐시 확정 (서버가 진실의 원천)
      const currentPost = queryClient.getQueryData<PostDetail>(queryKey)
      if (currentPost && currentPost.isLiked !== data.liked) {
        queryClient.setQueryData<PostDetail>(queryKey, {
          ...currentPost,
          isLiked: data.liked,
          likeCount: data.liked
            ? currentPost.likeCount + 1
            : Math.max(0, currentPost.likeCount - 1),
        })
      }
      // 목록 캐시 갱신
      queryClient.invalidateQueries({ queryKey: postKeys.lists() })
    },
    onError: (_err, _variables, context) => {
      // 에러 시 롤백
      if (context?.previousPost) {
        queryClient.setQueryData(queryKey, context.previousPost)
      }
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
    onSuccess: (data) => {
      // 서버 응답을 기반으로 캐시 확정 (서버가 진실의 원천)
      const currentPost = queryClient.getQueryData<PostDetail>(queryKey)
      if (currentPost && currentPost.isBookmarked !== data.bookmarked) {
        queryClient.setQueryData<PostDetail>(queryKey, {
          ...currentPost,
          isBookmarked: data.bookmarked,
        })
      }
    },
    onError: (_err, _variables, context) => {
      // 에러 시 롤백
      if (context?.previousPost) {
        queryClient.setQueryData(queryKey, context.previousPost)
      }
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
