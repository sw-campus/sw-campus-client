'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FiEye, FiHeart, FiMessageCircle, FiTrendingUp, FiMapPin } from 'react-icons/fi'

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
 * 게시글 줄형 아이템 컴포넌트 (컴팩트 스타일)
 */
export function PostListRow({ post }: PostListRowProps) {
  const router = useRouter()
  const relativeTime = formatRelativeTime(post.createdAt)
  const isPopular = post.likeCount >= POPULAR_THRESHOLD

  // 주차 태그와 일반 태그 분리
  const weekTag = post.tags.find(tag => tag.match(/^\d+월 \d+주차$/))
  const otherTags = post.tags.filter(tag => !tag.match(/^\d+월 \d+주차$/))

  return (
    <div
      onClick={() => router.push(`/community/${post.id}`)}
      className={`group relative flex w-full cursor-pointer flex-col gap-1.5 rounded-xl border p-3 transition-all duration-200 active:scale-[0.99] sm:gap-2 sm:rounded-2xl sm:p-4 ${
        post.pinned
          ? 'border-orange-200/80 bg-gradient-to-r from-orange-50/80 to-amber-50/50'
          : 'border-gray-200/60 bg-white hover:border-gray-300/80 hover:shadow-md'
      }`}
    >
      {/* 배지 */}
      <div className="flex items-center gap-1.5 overflow-hidden">
        {post.pinned && (
          <span className="inline-flex shrink-0 items-center gap-0.5 rounded bg-orange-100 px-1.5 py-0.5 text-[10px] font-bold text-orange-600 sm:text-xs">
            <FiMapPin className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
            공지
          </span>
        )}
        <span className="shrink-0 rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-medium text-gray-600 sm:text-xs">
          {post.categoryName}
        </span>
        {post.categoryName === BOOTCAMP_DIARY_CATEGORY_NAME && weekTag && (
          <span className="shrink-0 rounded bg-blue-50 px-1.5 py-0.5 text-[10px] font-medium text-blue-600 sm:text-xs">
            {weekTag}
          </span>
        )}
        {isPopular && (
          <span className="inline-flex shrink-0 items-center gap-0.5 rounded bg-rose-50 px-1.5 py-0.5 text-[10px] font-semibold text-rose-500 sm:text-xs">
            <FiTrendingUp className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
            인기
          </span>
        )}
      </div>

      {/* 제목 */}
      <h3 className="line-clamp-1 text-sm font-semibold leading-snug text-gray-900 transition-colors group-hover:text-orange-600 sm:text-[15px]">
        <Link href={`/community/${post.id}`} onClick={e => e.stopPropagation()}>
          {post.title}
        </Link>
      </h3>

      {/* 태그 - 부트캠프 수강일기만 표시 */}
      {post.categoryName === BOOTCAMP_DIARY_CATEGORY_NAME && otherTags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {otherTags.slice(0, 3).map(tag => (
            <ClickableTag key={tag} tag={tag} maxLength={8} />
          ))}
        </div>
      )}

      {/* 하단: 아바타 + 작성자 + 시간 + 통계 */}
      <div className="flex items-center gap-1.5 text-[11px] text-gray-500 sm:text-xs">
        <UserAvatar nickname={post.authorNickname} size="xs" />
        <span className="max-w-[80px] truncate sm:max-w-[100px]">{post.authorNickname}</span>
        <span className="text-gray-300">·</span>
        <span className="shrink-0">{relativeTime}</span>

        {/* 통계 - 오른쪽 정렬 */}
        <div className="ml-auto flex items-center gap-2 text-gray-400">
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
  )
}
