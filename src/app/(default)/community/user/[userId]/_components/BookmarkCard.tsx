'use client'

import Image from 'next/image'
import { FiEye, FiHeart, FiMessageCircle } from 'react-icons/fi'
import { LuFileText } from 'react-icons/lu'

import { BookmarkWithPost } from '@/features/community/api/interaction-api.client'
import { formatRelativeTime } from '@/lib/format-relative-time'

interface BookmarkCardProps {
  bookmark: BookmarkWithPost
  onClick: () => void
}

const formatNumber = (num: number) => {
  return new Intl.NumberFormat('ko-KR').format(num)
}

export function BookmarkCard({ bookmark, onClick }: BookmarkCardProps) {
  return (
    <article
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onClick()
        }
      }}
      className="group hover:border-primary/30 hover:shadow-primary/20 focus-visible:ring-primary relative box-border h-[120px] max-h-[120px] min-h-[120px] w-full cursor-pointer overflow-hidden rounded-2xl border border-gray-100 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-lg focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none active:scale-[0.98] sm:h-[136px] sm:max-h-[136px] sm:min-h-[136px]"
    >
      <div className="absolute inset-0 flex gap-4 p-4">
        {/* 썸네일 */}
        <div className="relative h-[88px] w-[88px] shrink-0 overflow-hidden rounded-xl bg-linear-to-br from-gray-50 to-gray-100 md:h-[104px] md:w-[104px]">
          {bookmark.thumbnailUrl ? (
            <Image
              src={bookmark.thumbnailUrl}
              alt={bookmark.title}
              fill
              sizes="104px"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <LuFileText className="h-10 w-10 text-gray-300" />
            </div>
          )}
        </div>

        {/* 컨텐츠 */}
        <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
          <div className="mb-1 flex shrink-0 items-center gap-2">
            <span className="bg-primary/10 text-primary shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium">
              {bookmark.categoryName}
            </span>
            <span className="shrink-0 text-xs text-gray-400">
              {formatRelativeTime(new Date(bookmark.postCreatedAt))}
            </span>
          </div>
          <div className="h-[44px] shrink-0 overflow-hidden sm:h-[52px]">
            <h3 className="group-hover:text-primary line-clamp-2 text-base leading-[22px] font-semibold text-gray-900 transition-colors sm:text-lg sm:leading-[26px]">
              {bookmark.title}
            </h3>
          </div>
          <div className="mt-auto flex shrink-0 items-center gap-4 text-sm text-gray-500">
            <span className="flex items-center gap-1.5">
              <FiEye className="h-4 w-4 shrink-0" />
              <span>{formatNumber(bookmark.viewCount)}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <FiHeart className="h-4 w-4 shrink-0" />
              <span>{formatNumber(bookmark.likeCount)}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <FiMessageCircle className="h-4 w-4 shrink-0" />
              <span>{formatNumber(bookmark.commentCount)}</span>
            </span>
          </div>
        </div>
      </div>

      {/* 호버 효과 그라데이션 */}
      <div className="from-primary/0 via-primary/0 to-primary/5 pointer-events-none absolute inset-0 bg-linear-to-r opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
    </article>
  )
}
