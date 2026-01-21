'use client'

import Image from 'next/image'
import { FiEye, FiHeart, FiMessageCircle } from 'react-icons/fi'
import { LuFileText } from 'react-icons/lu'

import { BookmarkWithPost } from '@/features/community/api/interactionApi.client'
import { formatRelativeTime } from '@/lib/formatRelativeTime'

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
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onClick()
        }
      }}
      className="group relative box-border h-[120px] max-h-[120px] min-h-[120px] w-full cursor-pointer overflow-hidden rounded-2xl border border-gray-100 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-orange-200 hover:shadow-lg hover:shadow-orange-100/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 active:scale-[0.98] sm:h-[136px] sm:max-h-[136px] sm:min-h-[136px]"
    >
      <div className="absolute inset-0 flex gap-4 p-4">
        {/* 썸네일 */}
        <div className="relative h-[88px] w-[88px] flex-shrink-0 overflow-hidden rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 sm:h-[104px] sm:w-[104px]">
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
          <div className="mb-1 flex flex-shrink-0 items-center gap-2">
            <span className="flex-shrink-0 rounded-full bg-orange-100 px-2.5 py-0.5 text-xs font-medium text-orange-600">
              {bookmark.categoryName}
            </span>
            <span className="flex-shrink-0 text-xs text-gray-400">
              {formatRelativeTime(new Date(bookmark.postCreatedAt))}
            </span>
          </div>
          <div className="h-[44px] flex-shrink-0 overflow-hidden sm:h-[52px]">
            <h3 className="line-clamp-2 text-base font-semibold leading-[22px] text-gray-900 transition-colors group-hover:text-orange-600 sm:text-lg sm:leading-[26px]">
              {bookmark.title}
            </h3>
          </div>
          <div className="mt-auto flex flex-shrink-0 items-center gap-4 text-sm text-gray-500">
            <span className="flex items-center gap-1.5">
              <FiEye className="h-4 w-4 flex-shrink-0" />
              <span>{formatNumber(bookmark.viewCount)}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <FiHeart className="h-4 w-4 flex-shrink-0" />
              <span>{formatNumber(bookmark.likeCount)}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <FiMessageCircle className="h-4 w-4 flex-shrink-0" />
              <span>{formatNumber(bookmark.commentCount)}</span>
            </span>
          </div>
        </div>
      </div>

      {/* 호버 효과 그라데이션 */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-orange-500/0 via-orange-500/0 to-orange-500/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
    </article>
  )
}
