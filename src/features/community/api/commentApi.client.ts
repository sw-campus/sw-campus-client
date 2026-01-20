import { api } from '@/lib/axios'

import {
  ApiCommentResponse,
  Comment,
  CreateCommentRequest,
  UpdateCommentRequest,
  mapApiComment,
} from './commentApi.types'

/**
 * 게시글 댓글 목록 조회 API
 * GET /api/v1/posts/:postId/comments
 */
export async function getComments(postId: number): Promise<Comment[]> {
  const { data } = await api.get<ApiCommentResponse[]>(`/posts/${postId}/comments`)
  return data.map(mapApiComment)
}

/**
 * 댓글 작성 API
 * POST /api/v1/comments
 */
export async function createComment(request: CreateCommentRequest): Promise<Comment> {
  const { data } = await api.post<ApiCommentResponse>('/comments', request)
  return mapApiComment(data)
}

/**
 * 댓글 수정 API
 * PUT /api/v1/comments/:commentId
 */
export async function updateComment(commentId: number, request: UpdateCommentRequest): Promise<Comment> {
  const { data } = await api.put<ApiCommentResponse>(`/comments/${commentId}`, request)
  return mapApiComment(data)
}

/**
 * 댓글 삭제 API
 * DELETE /api/v1/comments/:commentId
 */
export async function deleteComment(commentId: number): Promise<void> {
  await api.delete(`/comments/${commentId}`)
}

/**
 * 댓글 좋아요 토글 API
 * POST /api/v1/comments/:commentId/like
 * @returns liked - true: 좋아요 추가됨, false: 좋아요 취소됨
 */
export async function toggleCommentLike(commentId: number): Promise<{ liked: boolean }> {
  const { data } = await api.post<{ liked: boolean }>(`/comments/${commentId}/like`)
  return data
}
