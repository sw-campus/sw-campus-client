'use client'

import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'

import { getAdjacentPosts } from '../api/post-api.client'

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
      <div className="flex flex-col gap-3 md:flex-row md:gap-4">
        <div className="h-16 flex-1 rounded-2xl bg-gray-100" />
        <div className="h-16 flex-1 rounded-2xl bg-gray-100" />
      </div>
    )
  }

  if (!data || (!data.previous && !data.next)) {
    return null
  }

  return (
    <nav className="flex flex-col gap-3 md:flex-row md:items-stretch md:gap-4">
      {/* 이전 게시글 */}
      {data.previous ? (
        <Link
          href={`/community/${data.previous.id}`}
          className="group flex flex-1 items-center gap-3 rounded-2xl border border-gray-200/60 bg-white p-4 shadow-sm transition-all active:scale-[0.98] hover:border-primary/30 hover:shadow-md md:active:scale-100"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-100 transition-colors group-hover:bg-primary/10">
            <FiChevronLeft className="h-5 w-5 text-gray-400 transition-all group-hover:-translate-x-0.5 group-hover:text-primary" />
          </div>
          <div className="min-w-0 text-left">
            <span className="text-xs font-medium text-gray-400">이전 글</span>
            <p className="truncate text-sm font-semibold text-gray-700 transition-colors group-hover:text-primary">
              {data.previous.title}
            </p>
          </div>
        </Link>
      ) : (
        <div className="hidden flex-1 md:block" />
      )}

      {/* 다음 게시글 */}
      {data.next ? (
        <Link
          href={`/community/${data.next.id}`}
          className="group flex flex-1 items-center justify-end gap-3 rounded-2xl border border-gray-200/60 bg-white p-4 shadow-sm transition-all active:scale-[0.98] hover:border-primary/30 hover:shadow-md md:active:scale-100"
        >
          <div className="min-w-0 text-right">
            <span className="text-xs font-medium text-gray-400">다음 글</span>
            <p className="truncate text-sm font-semibold text-gray-700 transition-colors group-hover:text-primary">
              {data.next.title}
            </p>
          </div>
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-100 transition-colors group-hover:bg-primary/10">
            <FiChevronRight className="h-5 w-5 text-gray-400 transition-all group-hover:translate-x-0.5 group-hover:text-primary" />
          </div>
        </Link>
      ) : (
        <div className="hidden flex-1 md:block" />
      )}
    </nav>
  )
}
