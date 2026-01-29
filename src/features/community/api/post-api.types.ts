// Post API Types
// Backend response types from /api/v1/posts

// Backend response types
export interface ApiPostResponse {
  id: number
  title: string
  authorId: number | null  // 탈퇴한 회원의 경우 null
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
  pinned: boolean
}

export interface ApiPostDetailResponse {
  id: number
  title: string
  body: string
  authorId: number | null  // 탈퇴한 회원의 경우 null
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
  pinned: boolean
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

export interface PagedPosts {
  posts: Post[]
  page: {
    size: number
    number: number
    totalElements: number
    totalPages: number
  }
}

// Mapper functions
export function mapApiPostToPost(apiPost: ApiPostResponse): Post {
  return {
    id: apiPost.id,
    title: apiPost.title,
    authorId: apiPost.authorId,
    authorNickname: apiPost.authorNickname,
    categoryId: apiPost.categoryId,
    categoryName: apiPost.categoryName,
    tags: apiPost.tags,
    viewCount: apiPost.viewCount,
    likeCount: apiPost.likeCount,
    commentCount: apiPost.commentCount,
    createdAt: new Date(apiPost.createdAt),
    hasImage: apiPost.hasImage,
    thumbnailUrl: apiPost.thumbnailUrl,
    pinned: apiPost.pinned,
  }
}

// Frontend types
export interface Post {
  id: number
  title: string
  authorId: number | null  // 탈퇴한 회원의 경우 null
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
  pinned: boolean
}

export interface PostDetail {
  id: number
  title: string
  body: string
  authorId: number | null  // 탈퇴한 회원의 경우 null
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
  pinned: boolean
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

// 이전/다음 게시글
export interface AdjacentPostItem {
  id: number
  title: string
  categoryName: string
}

export interface AdjacentPosts {
  previous: AdjacentPostItem | null
  next: AdjacentPostItem | null
}

// 댓글 단 게시글 (내 댓글 포함)
export interface ApiCommentedPostResponse extends ApiPostResponse {
  myComment: string | null
  myCommentCreatedAt: string | null
  myCommentLikeCount: number
  myCommentReplyCount: number
}

export interface CommentedPost extends Post {
  myComment: string | null
  myCommentCreatedAt: Date | null
  myCommentLikeCount: number
  myCommentReplyCount: number
}

export interface PagedCommentedPosts {
  posts: CommentedPost[]
  page: {
    size: number
    number: number
    totalElements: number
    totalPages: number
  }
}

export function mapApiCommentedPostToCommentedPost(apiPost: ApiCommentedPostResponse): CommentedPost {
  return {
    ...mapApiPostToPost(apiPost),
    myComment: apiPost.myComment,
    myCommentCreatedAt: apiPost.myCommentCreatedAt ? new Date(apiPost.myCommentCreatedAt) : null,
    myCommentLikeCount: apiPost.myCommentLikeCount ?? 0,
    myCommentReplyCount: apiPost.myCommentReplyCount ?? 0,
  }
}
