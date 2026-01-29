import { api } from '@/lib/axios'

import { ApiUserProfileResponse, UserProfile } from './user-profile-api.types'
import {
  ApiPageResponse,
  ApiPostResponse,
  ApiCommentedPostResponse,
  PagedPosts,
  PagedCommentedPosts,
  mapApiPostToPost,
  mapApiCommentedPostToCommentedPost,
} from './post-api.types'

// Mapper function
function mapApiUserProfileToUserProfile(apiProfile: ApiUserProfileResponse): UserProfile {
  return {
    userId: apiProfile.userId,
    nickname: apiProfile.nickname,
    joinedAt: new Date(apiProfile.joinedAt),
    postCount: apiProfile.postCount,
    commentedPostCount: apiProfile.commentedPostCount,
  }
}



/**
 * 유저 프로필 조회 API
 * GET /api/v1/users/:userId/profile
 */
export async function getUserProfile(userId: number): Promise<UserProfile> {
  const { data } = await api.get<ApiUserProfileResponse>(`/users/${userId}/profile`)
  return mapApiUserProfileToUserProfile(data)
}

/**
 * 유저 게시글 목록 조회 API
 * GET /api/v1/users/:userId/posts
 */
export async function getUserPosts(
  userId: number,
  params: { page?: number; size?: number; sort?: string } = {}
): Promise<PagedPosts> {
  const searchParams = new URLSearchParams()

  if (params.page !== undefined) {
    searchParams.set('page', params.page.toString())
  }
  if (params.size !== undefined) {
    searchParams.set('size', params.size.toString())
  }
  if (params.sort) {
    searchParams.set('sort', params.sort)
  }

  const queryString = searchParams.toString()
  const url = queryString ? `/users/${userId}/posts?${queryString}` : `/users/${userId}/posts`

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
 * 유저가 댓글 단 게시글 목록 조회 API
 * GET /api/v1/users/:userId/commented-posts
 */
export async function getUserCommentedPosts(
  userId: number,
  params: { page?: number; size?: number; sort?: string } = {}
): Promise<PagedCommentedPosts> {
  const searchParams = new URLSearchParams()

  if (params.page !== undefined) {
    searchParams.set('page', params.page.toString())
  }
  if (params.size !== undefined) {
    searchParams.set('size', params.size.toString())
  }
  if (params.sort) {
    searchParams.set('sort', params.sort)
  }

  const queryString = searchParams.toString()
  const url = queryString ? `/users/${userId}/commented-posts?${queryString}` : `/users/${userId}/commented-posts`

  const { data } = await api.get<ApiPageResponse<ApiCommentedPostResponse>>(url)

  return {
    posts: data.content.map(mapApiCommentedPostToCommentedPost),
    page: {
      size: data.pageable?.pageSize ?? data.page?.size ?? 10,
      number: data.pageable?.pageNumber ?? data.page?.number ?? 0,
      totalElements: data.totalElements ?? data.page?.totalElements ?? 0,
      totalPages: data.totalPages ?? data.page?.totalPages ?? 1,
    },
  }
}
