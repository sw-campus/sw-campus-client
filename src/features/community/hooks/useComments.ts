import React from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { useAuthStore } from '@/store/authStore'

import { getComments, createComment, updateComment, deleteComment, toggleCommentLike } from '../api/commentApi.client'
import type { Comment, CreateCommentRequest, UpdateCommentRequest } from '../api/commentApi.types'

// Query Keys
export const commentKeys = {
  all: ['comments'] as const,
  byPost: (postId: number) => [...commentKeys.all, 'post', postId] as const,
}

/**
 * 게시글 댓글 목록 조회 Hook
 * - hydration 완료 후 댓글을 조회하여 인증 토큰이 포함되도록 함
 * - 로그인 상태가 변경되면 자동으로 다시 조회 (isLiked 등 사용자별 상태 갱신)
 */
export function useComments(postId: number) {
  const queryClient = useQueryClient()
  const hasHydrated = useAuthStore(state => state.hasHydrated)
  const isLoggedIn = useAuthStore(state => state.isLoggedIn)
  const prevIsLoggedIn = React.useRef(isLoggedIn)

  // 로그인 상태 변경 시 댓글 다시 조회
  React.useEffect(() => {
    if (hasHydrated && prevIsLoggedIn.current !== isLoggedIn) {
      prevIsLoggedIn.current = isLoggedIn
      queryClient.invalidateQueries({ queryKey: commentKeys.byPost(postId) })
    }
  }, [isLoggedIn, hasHydrated, postId, queryClient])

  return useQuery({
    queryKey: commentKeys.byPost(postId),
    queryFn: () => getComments(postId),
    enabled: postId > 0 && hasHydrated,
  })
}

/**
 * 댓글 작성 Mutation Hook
 */
export function useCreateComment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (request: CreateCommentRequest) => createComment(request),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: commentKeys.byPost(variables.postId) })
      // 게시글 댓글 수도 갱신
      queryClient.invalidateQueries({ queryKey: ['post', variables.postId] })
    },
  })
}

/**
 * 댓글 수정 Mutation Hook
 */
export function useUpdateComment(postId: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ commentId, request }: { commentId: number; request: UpdateCommentRequest }) =>
      updateComment(commentId, request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: commentKeys.byPost(postId) })
    },
  })
}

/**
 * 댓글 삭제 Mutation Hook
 */
export function useDeleteComment(postId: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (commentId: number) => deleteComment(commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: commentKeys.byPost(postId) })
      // 게시글 댓글 수도 갱신
      queryClient.invalidateQueries({ queryKey: ['post', postId] })
    },
  })
}

/**
 * 댓글 좋아요 토글 Mutation Hook
 */
export function useToggleCommentLike(postId: number) {
  const queryClient = useQueryClient()
  const queryKey = commentKeys.byPost(postId)

  return useMutation({
    mutationFn: (commentId: number) => toggleCommentLike(commentId).then(res => ({ commentId, liked: res.liked })),
    onMutate: async commentId => {
      // 1. 진행 중인 쿼리 취소
      await queryClient.cancelQueries({ queryKey })

      // 2. 이전 상태 스냅샷 저장
      const previousComments = queryClient.getQueryData(queryKey)

      // 3. 낙관적 업데이트 적용
      queryClient.setQueryData(queryKey, (old: Comment[] | undefined) => {
        if (!old) return []

        const updateLike = (comments: Comment[]): Comment[] => {
          return comments.map(comment => {
            if (comment.id === commentId) {
              const isLiked = !comment.isLiked
              return {
                ...comment,
                isLiked,
                likeCount: isLiked ? comment.likeCount + 1 : Math.max(0, comment.likeCount - 1),
              }
            }
            if (comment.replies && comment.replies.length > 0) {
              return {
                ...comment,
                replies: updateLike(comment.replies),
              }
            }
            return comment
          })
        }

        return updateLike(old)
      })

      return { previousComments }
    },
    onSuccess: (data) => {
      // 서버 응답을 기반으로 캐시 업데이트 (서버가 진실의 원천)
      queryClient.setQueryData(queryKey, (old: Comment[] | undefined) => {
        if (!old) return []

        const updateLike = (comments: Comment[]): Comment[] => {
          return comments.map(comment => {
            if (comment.id === data.commentId) {
              // 서버 응답의 liked 값으로 확정
              const prevLiked = comment.isLiked
              const newLiked = data.liked
              // 이미 optimistic update가 적용되었으므로, 서버와 다를 때만 보정
              if (prevLiked !== newLiked) {
                return {
                  ...comment,
                  isLiked: newLiked,
                  likeCount: newLiked ? comment.likeCount + 1 : Math.max(0, comment.likeCount - 1),
                }
              }
              return comment
            }
            if (comment.replies && comment.replies.length > 0) {
              return {
                ...comment,
                replies: updateLike(comment.replies),
              }
            }
            return comment
          })
        }

        return updateLike(old)
      })
    },
    onError: (err, commentId, context) => {
      // 에러 발생 시 롤백
      if (context?.previousComments) {
        queryClient.setQueryData(queryKey, context.previousComments)
      }
    },
  })
}
