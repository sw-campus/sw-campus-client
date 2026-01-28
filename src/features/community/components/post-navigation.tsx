'use client'

import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
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
          className="group hover:border-primary/30 flex flex-1 items-center gap-3 rounded-2xl border border-gray-200/60 bg-white p-4 shadow-sm transition-all hover:shadow-md active:scale-[0.98] sm:active:scale-100"
        >
          <div className="group-hover:bg-primary/10 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-100 transition-colors">
            <FiChevronLeft className="group-hover:text-primary h-5 w-5 text-gray-400 transition-all group-hover:-translate-x-0.5" />
          </div>
          <div className="min-w-0 text-left">
            <span className="text-xs font-medium text-gray-400">이전 글</span>
            <p className="group-hover:text-primary truncate text-sm font-semibold text-gray-700 transition-colors">
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
          className="group hover:border-primary/30 flex flex-1 items-center justify-end gap-3 rounded-2xl border border-gray-200/60 bg-white p-4 shadow-sm transition-all hover:shadow-md active:scale-[0.98] sm:active:scale-100"
        >
          <div className="min-w-0 text-right">
            <span className="text-xs font-medium text-gray-400">다음 글</span>
            <p className="group-hover:text-primary truncate text-sm font-semibold text-gray-700 transition-colors">
              {data.next.title}
            </p>
          </div>
          <div className="group-hover:bg-primary/10 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-100 transition-colors">
            <FiChevronRight className="group-hover:text-primary h-5 w-5 text-gray-400 transition-all group-hover:translate-x-0.5" />
          </div>
        </Link>
      ) : (
        <div className="hidden flex-1 md:block" />
      )}
    </nav>
  )
}
