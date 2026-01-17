// Post API Types
// Backend response types from /api/v1/posts

// Backend response types
export interface ApiPostResponse {
  id: number
  title: string
  authorId: number
  authorNickname: string
  categoryId: number
  categoryName: string
  tags: string[]
  viewCount: number
  likeCount: number
  commentCount: number
  createdAt: string
  hasImage: boolean
  thumbnailUrl: string | null
}

export interface ApiPostDetailResponse {
  id: number
  title: string
  body: string
  authorId: number
  authorNickname: string
  categoryId: number
  categoryName: string
  images: string[]
  tags: string[]
  viewCount: number
  likeCount: number
  commentCount: number
  selectedCommentId: number | null
  createdAt: string
  updatedAt: string
  bookmarked: boolean
  liked: boolean
  isAuthor: boolean
}

export interface ApiPageResponse<T> {
  content: T[]
  pageable?: {
    pageNumber: number
    pageSize: number
  }
  page?: {
    size: number
    number: number
    totalElements: number
    totalPages: number
  }
  totalElements: number
  totalPages: number
  last: boolean
  first: boolean
  empty: boolean
}

// Frontend types
export interface Post {
  id: number
  title: string
  authorId: number
  authorNickname: string
  categoryId: number
  categoryName: string
  tags: string[]
  viewCount: number
  likeCount: number
  commentCount: number
  createdAt: Date
  hasImage: boolean
  thumbnailUrl: string | null
}

export interface PostDetail {
  id: number
  title: string
  body: string
  authorId: number
  authorNickname: string
  categoryId: number
  categoryName: string
  images: string[]
  tags: string[]
  viewCount: number
  likeCount: number
  commentCount: number
  selectedCommentId: number | null
  createdAt: Date
  updatedAt: Date
  isBookmarked: boolean
  isLiked: boolean
  isAuthor: boolean
}

// Request types
export interface CreatePostRequest {
  boardCategoryId: number
  title: string
  body: string
  images?: string[]
  tags?: string[]
}

export interface UpdatePostRequest {
  title: string
  body: string
  images?: string[]
  tags?: string[]
}

export interface PostSearchParams {
  categoryId?: number
  tags?: string[]
  keyword?: string
  page?: number
  size?: number
  sort?: string // 예: 'created_at,desc' 또는 'like_count,desc'
}

// 정렬 옵션
export const POST_SORT_OPTIONS = [
  { label: '최신순', value: 'created_at,desc' },
  { label: '오래된순', value: 'created_at,asc' },
  { label: '좋아요순', value: 'like_count,desc' },
  { label: '조회수순', value: 'view_count,desc' },
  { label: '댓글순', value: 'comment_count,desc' },
] as const

export const DEFAULT_POST_SORT = 'created_at,desc'
