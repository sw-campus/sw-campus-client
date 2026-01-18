import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import {
  getComments,
  createComment,
  updateComment,
  deleteComment,
} from '../api/commentApi.client'
import type { CreateCommentRequest, UpdateCommentRequest } from '../api/commentApi.types'

// Query Keys
export const commentKeys = {
  all: ['comments'] as const,
  byPost: (postId: number) => [...commentKeys.all, 'post', postId] as const,
}

/**
 * 게시글 댓글 목록 조회 Hook
 */
export function useComments(postId: number) {
  return useQuery({
    queryKey: commentKeys.byPost(postId),
    queryFn: () => getComments(postId),
    enabled: postId > 0,
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
