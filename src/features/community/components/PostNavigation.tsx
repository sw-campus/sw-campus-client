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
      <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
        <div className="h-16 flex-1 rounded-2xl bg-gray-100" />
        <div className="h-16 flex-1 rounded-2xl bg-gray-100" />
      </div>
    )
  }

  if (!data || (!data.previous && !data.next)) {
    return null
  }

  return (
    <nav className="flex flex-col gap-3 sm:flex-row sm:items-stretch sm:gap-4">
      {/* 이전 게시글 */}
      {data.previous ? (
        <Link
          href={`/community/${data.previous.id}`}
          className="group flex flex-1 items-center gap-3 rounded-2xl border border-gray-200/60 bg-white p-4 shadow-sm transition-all active:scale-[0.98] hover:border-orange-200 hover:shadow-md sm:active:scale-100"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-100 transition-colors group-hover:bg-orange-100">
            <FiChevronLeft className="h-5 w-5 text-gray-400 transition-all group-hover:-translate-x-0.5 group-hover:text-orange-500" />
          </div>
          <div className="min-w-0 text-left">
            <span className="text-xs font-medium text-gray-400">이전 글</span>
            <p className="truncate text-sm font-semibold text-gray-700 transition-colors group-hover:text-orange-600">
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
          className="group flex flex-1 items-center justify-end gap-3 rounded-2xl border border-gray-200/60 bg-white p-4 shadow-sm transition-all active:scale-[0.98] hover:border-orange-200 hover:shadow-md sm:active:scale-100"
        >
          <div className="min-w-0 text-right">
            <span className="text-xs font-medium text-gray-400">다음 글</span>
            <p className="truncate text-sm font-semibold text-gray-700 transition-colors group-hover:text-orange-600">
              {data.next.title}
            </p>
          </div>
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-100 transition-colors group-hover:bg-orange-100">
            <FiChevronRight className="h-5 w-5 text-gray-400 transition-all group-hover:translate-x-0.5 group-hover:text-orange-500" />
          </div>
        </Link>
      ) : (
        <div className="hidden flex-1 sm:block" />
      )}
    </nav>
  )
}
