'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FiEye, FiHeart, FiMessageCircle, FiTrendingUp, FiMapPin, FiClock } from 'react-icons/fi'

import { UserAvatar } from '@/components/ui/user-avatar'
import { formatRelativeTime } from '@/lib/format-relative-time'

import type { Post } from '../api/post-api.types'
import { BOOTCAMP_DIARY_CATEGORY_NAME } from '../constants'
import { ClickableTag } from './clickable-tag'

interface PostListRowProps {
  post: Post
}

// 인기글 기준: 좋아요 10개 이상
const POPULAR_THRESHOLD = 10

/**
 * 게시글 줄형 아이템 컴포넌트
 * - 좌측 컬러 악센트 바
 * - 향상된 호버 인터랙션
 * - 모바일 최적화 레이아웃
 */
export function PostListRow({ post }: PostListRowProps) {
  const router = useRouter()
  const relativeTime = formatRelativeTime(post.createdAt)
  const isPopular = post.likeCount >= POPULAR_THRESHOLD

  // 주차 태그와 일반 태그 분리
  const weekTag = post.tags.find(tag => tag.match(/^\d+월 \d+주차$/))
  const otherTags = post.tags.filter(tag => !tag.match(/^\d+월 \d+주차$/))

  return (
    <article
      onClick={() => router.push(`/community/${post.id}`)}
      className={`group relative flex w-full cursor-pointer overflow-hidden rounded-xl border transition-all duration-200 active:scale-[0.98] active:shadow-inner md:rounded-2xl ${
        post.pinned
          ? 'border-primary/30 bg-primary/5 active:bg-primary/10'
          : 'border-gray-100 bg-white hover:border-primary/30 hover:shadow-lg hover:shadow-primary/10 active:bg-gray-50/80'
      }`}
    >
      {/* 좌측 악센트 바 */}
      <div className={`w-1 shrink-0 transition-all duration-300 ${
        post.pinned
          ? 'bg-primary'
          : isPopular
            ? 'bg-linear-to-b from-rose-400 to-pink-400 group-hover:from-rose-500 group-hover:to-pink-500'
            : 'bg-gray-200 group-hover:bg-primary'
      }`} />

      {/* 메인 콘텐츠 */}
      <div className="flex min-w-0 flex-1 flex-col gap-2 p-3 md:gap-2.5 md:p-4">
        {/* 상단: 배지 + 통계 */}
        <div className="flex items-center justify-between gap-2">
          {/* 배지 영역 */}
          <div className="flex min-w-0 flex-1 items-center gap-1.5 overflow-x-auto scrollbar-hide md:gap-2">
            {post.pinned && (
              <span className="inline-flex shrink-0 items-center gap-0.5 rounded-md bg-primary px-1.5 py-0.5 text-[10px] font-bold text-primary-foreground shadow-sm md:gap-1 md:rounded-lg md:px-2 md:py-1 md:text-xs">
                <FiMapPin className="h-2.5 w-2.5 md:h-3 md:w-3" />
                공지
              </span>
            )}
            {isPopular && !post.pinned && (
              <span className="inline-flex shrink-0 items-center gap-0.5 rounded-md bg-linear-to-r from-rose-500 to-pink-500 px-1.5 py-0.5 text-[10px] font-bold text-white shadow-sm md:gap-1 md:rounded-lg md:px-2 md:py-1 md:text-xs">
                <FiTrendingUp className="h-2.5 w-2.5 md:h-3 md:w-3" />
                인기
              </span>
            )}
            <span className="shrink-0 rounded-md bg-gray-100 px-1.5 py-0.5 text-[10px] font-medium text-gray-600 md:rounded-lg md:px-2 md:py-1 md:text-xs">
              {post.categoryName}
            </span>
            {post.categoryName === BOOTCAMP_DIARY_CATEGORY_NAME && weekTag && (
              <span className="shrink-0 rounded-md bg-blue-50 px-1.5 py-0.5 text-[10px] font-medium text-blue-600 ring-1 ring-blue-100 md:rounded-lg md:px-2 md:py-1 md:text-xs">
                {weekTag}
              </span>
            )}
          </div>

          {/* 통계 - 데스크탑에서만 상단에 표시 */}
          <div className="hidden shrink-0 items-center gap-3 text-xs text-gray-400 md:flex">
            <span className="flex items-center gap-1 transition-colors group-hover:text-gray-500">
              <FiEye className="h-3.5 w-3.5" />
              <span className="tabular-nums">{post.viewCount}</span>
            </span>
            <span className={`flex items-center gap-1 transition-colors ${isPopular ? 'text-rose-500' : 'group-hover:text-rose-400'}`}>
              <FiHeart className={`h-3.5 w-3.5 ${isPopular ? 'fill-rose-500' : ''}`} />
              <span className="tabular-nums">{post.likeCount}</span>
            </span>
            <span className="flex items-center gap-1 transition-colors group-hover:text-blue-400">
              <FiMessageCircle className="h-3.5 w-3.5" />
              <span className="tabular-nums">{post.commentCount}</span>
            </span>
          </div>
        </div>

        {/* 제목 */}
        <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-gray-900 transition-colors group-hover:text-primary md:line-clamp-1 md:text-[15px]">
          <Link href={`/community/${post.id}`} onClick={e => e.stopPropagation()}>
            {post.title}
          </Link>
        </h3>

        {/* 태그 - 부트캠프 수강일기만 표시 */}
        {post.categoryName === BOOTCAMP_DIARY_CATEGORY_NAME && otherTags.length > 0 && (
          <div className="flex flex-wrap gap-1 md:gap-1.5">
            {otherTags.slice(0, 3).map(tag => (
              <ClickableTag key={tag} tag={tag} maxLength={8} />
            ))}
          </div>
        )}

        {/* 하단: 작성자 정보 + 모바일 통계 */}
        <div className="flex items-center justify-between gap-2">
          {/* 작성자 정보 */}
          <div className="flex items-center gap-1.5 text-[11px] text-gray-500 md:gap-2 md:text-xs">
            <UserAvatar nickname={post.authorNickname} size="xs" />
            <span className="max-w-[70px] truncate font-medium text-gray-700 md:max-w-[100px]">{post.authorNickname}</span>
            <span className="text-gray-300">·</span>
            <span className="flex shrink-0 items-center gap-0.5">
              <FiClock className="hidden h-3 w-3 md:block" />
              {relativeTime}
            </span>
          </div>

          {/* 모바일 통계 */}
          <div className="flex items-center gap-2 text-[11px] text-gray-400 md:hidden">
            <span className="flex items-center gap-0.5">
              <FiEye className="h-3 w-3" />
              <span className="tabular-nums">{post.viewCount}</span>
            </span>
            <span className={`flex items-center gap-0.5 ${isPopular ? 'text-rose-500' : ''}`}>
              <FiHeart className={`h-3 w-3 ${isPopular ? 'fill-rose-500' : ''}`} />
              <span className="tabular-nums">{post.likeCount}</span>
            </span>
            <span className="flex items-center gap-0.5">
              <FiMessageCircle className="h-3 w-3" />
              <span className="tabular-nums">{post.commentCount}</span>
            </span>
          </div>
        </div>
      </div>
    </article>
  )
}
