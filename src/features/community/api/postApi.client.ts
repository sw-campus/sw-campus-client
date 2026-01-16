import { api } from '@/lib/axios'

import {
  ApiPageResponse,
  ApiPostDetailResponse,
  ApiPostResponse,
  CreatePostRequest,
  Post,
  PostDetail,
  PostSearchParams,
  UpdatePostRequest,
} from './postApi.types'

// Mapper functions
function mapApiPostToPost(apiPost: ApiPostResponse): Post {
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
  }
}

function mapApiPostDetailToPostDetail(apiPost: ApiPostDetailResponse): PostDetail {
  return {
    id: apiPost.id,
    title: apiPost.title,
    body: apiPost.body,
    authorId: apiPost.authorId,
    authorNickname: apiPost.authorNickname,
    categoryId: apiPost.categoryId,
    categoryName: apiPost.categoryName,
    images: apiPost.images,
    tags: apiPost.tags,
    viewCount: apiPost.viewCount,
    likeCount: apiPost.likeCount,
    commentCount: apiPost.commentCount,
    selectedCommentId: apiPost.selectedCommentId,
    createdAt: new Date(apiPost.createdAt),
    updatedAt: new Date(apiPost.updatedAt),
    isBookmarked: apiPost.bookmarked,
    isLiked: apiPost.liked,
    isAuthor: apiPost.isAuthor,
  }
}

// API response type
export interface PagedPosts {
  posts: Post[]
  page: {
    size: number
    number: number
    totalElements: number
    totalPages: number
  }
}

/**
 * 게시글 목록 조회 API
 * GET /api/v1/posts
 */
export async function getPosts(params: PostSearchParams = {}): Promise<PagedPosts> {
  const searchParams = new URLSearchParams()

  if (params.categoryId) {
    searchParams.set('categoryId', params.categoryId.toString())
  }
  if (params.tags && params.tags.length > 0) {
    params.tags.forEach(tag => searchParams.append('tags', tag))
  }
  if (params.keyword && params.keyword.trim()) {
    searchParams.set('keyword', params.keyword.trim())
  }
  if (params.page !== undefined) {
    searchParams.set('page', params.page.toString())
  }
  if (params.size !== undefined) {
    searchParams.set('size', params.size.toString())
  }

  const queryString = searchParams.toString()
  const url = queryString ? `/posts?${queryString}` : '/posts'

  const { data } = await api.get<ApiPageResponse<ApiPostResponse>>(url)

  return {
    posts: data.content.map(mapApiPostToPost),
    page: {
      size: data.pageable?.pageSize ?? data.page?.size ?? 10,
      number: data.pageable?.pageNumber ?? data.page?.number ?? 0,
      totalElements: data.totalElements ?? data.page?.totalElements ?? 0,
      totalPages: data.totalPages ?? data.page?.totalPages ?? 1,
    },
  }
}

/**
 * 게시글 상세 조회 API
 * GET /api/v1/posts/:postId
 */
export async function getPost(postId: number): Promise<PostDetail> {
  const { data } = await api.get<ApiPostDetailResponse>(`/posts/${postId}`)
  return mapApiPostDetailToPostDetail(data)
}

/**
 * 게시글 작성 API
 * POST /api/v1/posts
 */
export async function createPost(request: CreatePostRequest): Promise<PostDetail> {
  const { data } = await api.post<ApiPostDetailResponse>('/posts', request)
  return mapApiPostDetailToPostDetail(data)
}

/**
 * 게시글 수정 API
 * PUT /api/v1/posts/:postId
 */
export async function updatePost(postId: number, request: UpdatePostRequest): Promise<PostDetail> {
  const { data } = await api.put<ApiPostDetailResponse>(`/posts/${postId}`, request)
  return mapApiPostDetailToPostDetail(data)
}

/**
 * 게시글 삭제 API
 * DELETE /api/v1/posts/:postId
 */
export async function deletePost(postId: number): Promise<void> {
  await api.delete(`/posts/${postId}`)
}
