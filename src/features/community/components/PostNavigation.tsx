'use client'

import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'

import { getAdjacentPosts } from '../api/postApi.client'

interface PostNavigationProps {
  postId: number
}

export function PostNavigation({ postId }: PostNavigationProps) {
  const { data, isLoading } = useQuery({
    queryKey: ['post', postId, 'adjacent'],
    queryFn: () => getAdjacentPosts(postId),
    enabled: postId > 0,
  })

  if (isLoading) {
    return (
      <div className="mt-8 flex items-center justify-between border-t border-gray-100 pt-6">
        <div className="h-14 w-40 animate-pulse rounded-lg bg-gray-100" />
        <div className="h-14 w-40 animate-pulse rounded-lg bg-gray-100" />
      </div>
    )
  }

  if (!data || (!data.previous && !data.next)) {
    return null
  }

  return (
    <nav className="mt-6 flex flex-col gap-3 border-t border-gray-100 pt-4 sm:mt-8 sm:flex-row sm:items-stretch sm:justify-between sm:gap-4 sm:pt-6">
      {/* 이전 게시글 */}
      {data.previous ? (
        <Link
          href={`/community/${data.previous.id}`}
          className="group flex flex-1 items-center gap-3 rounded-lg border border-gray-100 bg-white p-4 transition-all active:scale-[0.99] hover:border-orange-200 hover:bg-orange-50/30"
        >
          <FiChevronLeft className="h-5 w-5 shrink-0 text-gray-400 transition-transform group-hover:-translate-x-1 group-hover:text-orange-500" />
          <div className="min-w-0 text-left">
            <span className="text-xs text-gray-400">이전 글</span>
            <p className="truncate text-sm font-medium text-gray-700 group-hover:text-orange-600">
              {data.previous.title}
            </p>
          </div>
        </Link>
      ) : (
        <div className="hidden flex-1 sm:block" />
      )}

      {/* 다음 게시글 */}
      {data.next ? (
        <Link
          href={`/community/${data.next.id}`}
          className="group flex flex-1 items-center justify-end gap-3 rounded-lg border border-gray-100 bg-white p-4 transition-all active:scale-[0.99] hover:border-orange-200 hover:bg-orange-50/30"
        >
          <div className="min-w-0 text-right">
            <span className="text-xs text-gray-400">다음 글</span>
            <p className="truncate text-sm font-medium text-gray-700 group-hover:text-orange-600">
              {data.next.title}
            </p>
          </div>
          <FiChevronRight className="h-5 w-5 shrink-0 text-gray-400 transition-transform group-hover:translate-x-1 group-hover:text-orange-500" />
        </Link>
      ) : (
        <div className="hidden flex-1 sm:block" />
      )}
    </nav>
  )
}
