import { api } from '@/lib/axios'

/**
 * 게시글 좋아요 토글 API
 * POST /api/v1/posts/:postId/like
 */
export async function togglePostLike(postId: number): Promise<{ liked: boolean }> {
  const { data } = await api.post<{ liked: boolean }>(`/posts/${postId}/like`)
  return data
}

/**
 * 게시글 북마크 토글 API
 * POST /api/v1/bookmarks/:postId
 */
export async function toggleBookmark(postId: number): Promise<{ bookmarked: boolean }> {
  const { data } = await api.post<{ bookmarked: boolean }>(`/bookmarks/${postId}`)
  return data
}
