import { api } from '@/lib/axios'

// 북마크 목록 응답 타입
export interface BookmarkWithPost {
  bookmarkId: number
  postId: number
  title: string
  authorNickname: string
  categoryName: string
  thumbnailUrl: string | null
  commentCount: number
  likeCount: number
  viewCount: number
  postCreatedAt: string
  bookmarkedAt: string
}

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

/**
 * 내 북마크 목록 조회 API
 * GET /api/v1/bookmarks
 */
export async function getMyBookmarks(): Promise<BookmarkWithPost[]> {
  const { data } = await api.get<BookmarkWithPost[]>('/bookmarks')
  return data
}

// 좋아요 누른 사용자 정보
export interface Liker {
  id: number
  nickname: string
}

/**
 * 게시글 좋아요 목록 조회 API
 * GET /api/v1/posts/:postId/likers
 */
export async function getPostLikers(postId: number): Promise<Liker[]> {
  const { data } = await api.get<Liker[]>(`/posts/${postId}/likers`)
  return data
}
