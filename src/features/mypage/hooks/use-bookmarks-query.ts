'use client'

import { useQuery } from '@tanstack/react-query'

import { getMyBookmarks, type BookmarkWithPost } from '@/features/community/api/interaction-api.client'

export const bookmarksQueryKey = ['mypage', 'bookmarks'] as const

interface UseBookmarksQueryOptions {
  enabled?: boolean
}

export function useBookmarksQuery(options: UseBookmarksQueryOptions = {}) {
  const { enabled = true } = options

  return useQuery<BookmarkWithPost[]>({
    queryKey: bookmarksQueryKey,
    queryFn: getMyBookmarks,
    enabled,
  })
}
