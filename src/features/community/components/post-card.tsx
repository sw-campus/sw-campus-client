'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { FiHeart, FiMessageCircle, FiMapPin, FiTrendingUp } from 'react-icons/fi'

import { formatRelativeTime } from '@/lib/format-relative-time'

import type { Post } from '../api/post-api.types'
import { BOOTCAMP_DIARY_CATEGORY_NAME } from '../constants'
import { ClickableTag } from './clickable-tag'

interface PostCardProps {
  post: Post
}

// 인기글 기준
const POPULAR_THRESHOLD = 10

/**
 * 게시글 카드 컴포넌트
 * - 세로 레이아웃 (썸네일 위, 텍스트 아래)
 * - 썸네일은 있을 때만 표시
 */
export function PostCard({ post }: PostCardProps) {
  const router = useRouter()
  const relativeTime = formatRelativeTime(post.createdAt)
  const isPopular = post.likeCount >= POPULAR_THRESHOLD

  return (
    <div
      onClick={() => router.push(`/community/${post.id}`)}
      className="group cursor-pointer active:scale-[0.98] sm:active:scale-100"
    >
      <div className="relative flex h-full flex-col overflow-hidden rounded-xl border border-gray-200/40 bg-white shadow-sm transition-all duration-300 ease-out hover:border-gray-300/60 hover:shadow-xl hover:shadow-gray-100/50 sm:rounded-2xl">
        {/* 호버 효과 */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-orange-500/[0.03] via-transparent to-amber-500/[0.03] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

        {/* 썸네일 영역 (위) */}
        <div className="relative aspect-[16/10] w-full shrink-0 overflow-hidden">
          {post.thumbnailUrl ? (
            <Image
              src={post.thumbnailUrl}
              alt={post.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              quality={85}
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100 transition-all duration-500 group-hover:from-orange-100 group-hover:via-amber-100 group-hover:to-orange-150">
              <div className="flex flex-col items-center gap-2 text-orange-300">
                <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                </svg>
              </div>
            </div>
          )}
          {/* 배지 오버레이 */}
          <div className="absolute top-3 left-3 flex gap-1.5">
            {post.pinned && (
              <span className="inline-flex items-center gap-1 rounded-md bg-white/95 px-2 py-1 text-xs font-bold text-orange-600 shadow-sm backdrop-blur-sm">
                <FiMapPin className="h-3 w-3" />
                공지
              </span>
            )}
            {isPopular && !post.pinned && (
              <span className="inline-flex items-center gap-1 rounded-md bg-gradient-to-r from-rose-500 to-pink-500 px-2 py-1 text-xs font-bold text-white shadow-sm">
                <FiTrendingUp className="h-3 w-3" />
                인기
              </span>
            )}
          </div>
        </div>

        {/* 컨텐츠 영역 (아래) */}
        <div className="relative flex min-w-0 flex-1 flex-col p-4">
          {/* 카테고리 + 주차 정보 */}
          <div className="mb-2 flex items-center gap-1.5 overflow-hidden">
            <span className="shrink-0 rounded-md bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
              {post.categoryName}
            </span>
            {post.categoryName === BOOTCAMP_DIARY_CATEGORY_NAME && post.tags.length > 0 && post.tags[0].match(/^\d+월 \d+주차$/) && (
              <span className="shrink-0 rounded-md bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-600">
                {post.tags[0]}
              </span>
            )}
          </div>

          {/* 제목 */}
          <h3 className="line-clamp-2 text-sm font-bold leading-snug text-gray-900 transition-colors duration-200 group-hover:text-orange-600 sm:text-[15px]">
            {post.title}
          </h3>

          {/* 태그 영역 - 모바일에서 숨김 */}
          <div className="mt-2 hidden h-6 flex-nowrap gap-1.5 overflow-hidden sm:flex">
            {post.categoryName === BOOTCAMP_DIARY_CATEGORY_NAME &&
              post.tags
                .filter(tag => !tag.match(/^\d+월 \d+주차$/))
                .slice(0, 2)
                .map(tag => (
                  <ClickableTag key={tag} tag={tag} maxLength={8} />
                ))}
          </div>

          {/* 푸터 영역 */}
          <div className="mt-auto flex items-center justify-between pt-3 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="max-w-[80px] truncate font-medium text-gray-700">
                {post.authorNickname ?? '익명'}
              </span>
              <span className="h-1 w-1 rounded-full bg-gray-300" />
              <span className="text-gray-500">{relativeTime}</span>
            </div>

            <div className="flex items-center gap-3 text-gray-500">
              <span className="flex items-center gap-1 transition-colors group-hover:text-rose-500">
                <FiHeart className="h-3.5 w-3.5" />
                <span className="tabular-nums">{post.likeCount}</span>
              </span>
              <span className="flex items-center gap-1 transition-colors group-hover:text-blue-500">
                <FiMessageCircle className="h-3.5 w-3.5" />
                <span className="tabular-nums">{post.commentCount}</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
