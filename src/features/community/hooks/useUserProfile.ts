'use client'

import { useQuery } from '@tanstack/react-query'

import { getUserProfile, getUserPosts, PagedPosts } from '../api/userProfileApi.client'
import { UserProfile } from '../api/userProfileApi.types'

export const userProfileKeys = {
  all: ['userProfiles'] as const,
  profile: (userId: number) => [...userProfileKeys.all, 'profile', userId] as const,
  posts: (userId: number, params: { page?: number; size?: number; sort?: string }) =>
    [...userProfileKeys.all, 'posts', userId, params] as const,
}

/**
 * 유저 프로필 조회 훅
 */
export function useUserProfile(userId: number) {
  return useQuery<UserProfile, Error>({
    queryKey: userProfileKeys.profile(userId),
    queryFn: () => getUserProfile(userId),
    staleTime: 1000 * 60 * 5, // 5분간 캐시
    enabled: !!userId,
  })
}

/**
 * 유저 게시글 목록 조회 훅
 */
export function useUserPosts(
  userId: number,
  params: { page?: number; size?: number; sort?: string } = {}
) {
  return useQuery<PagedPosts, Error>({
    queryKey: userProfileKeys.posts(userId, params),
    queryFn: () => getUserPosts(userId, params),
    staleTime: 1000 * 60, // 1분간 캐시
    enabled: !!userId,
  })
}
