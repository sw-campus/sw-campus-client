import { api } from '@/lib/axios'

import { ApiUserProfileResponse, UserProfile } from './userProfileApi.types'
import {
  ApiPageResponse,
  ApiPostResponse,
  Post,
} from './postApi.types'

// Mapper function
function mapApiUserProfileToUserProfile(apiProfile: ApiUserProfileResponse): UserProfile {
  return {
    userId: apiProfile.userId,
    nickname: apiProfile.nickname,
    joinedAt: new Date(apiProfile.joinedAt),
    postCount: apiProfile.postCount,
  }
}

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
    pinned: apiPost.pinned,
  }
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
