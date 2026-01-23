'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FiEye, FiHeart, FiMessageCircle, FiTrendingUp, FiMapPin } from 'react-icons/fi'

import { UserAvatar } from '@/components/ui/user-avatar'
import { formatRelativeTime } from '@/lib/format-relative-time'

import type { Post } from '../api/post-api.types'
import { BOOTCAMP_DIARY_CATEGORY_NAME } from '../constants'
import { ClickableTag } from './clickable-tag'
import { UserProfileLink } from './user-profile-link'

interface PostListRowProps {
  post: Post
}

// 인기글 기준: 좋아요 10개 이상
const POPULAR_THRESHOLD = 10

/**
 * 게시글 줄형 아이템 컴포넌트
 */
export function PostListRow({ post }: PostListRowProps) {
  const router = useRouter()
  const relativeTime = formatRelativeTime(post.createdAt)
  const isPopular = post.likeCount >= POPULAR_THRESHOLD

  return (
    <div className="block w-full">
      <div
        onClick={() => router.push(`/community/${post.id}`)}
        className={`group relative flex w-full cursor-pointer gap-4 rounded-2xl border p-4 transition-all duration-300 ease-out active:scale-[0.995] sm:gap-5 sm:p-5 sm:active:scale-100 ${
          post.pinned
            ? 'border-orange-200/60 bg-gradient-to-r from-orange-50/60 via-amber-50/40 to-orange-50/60 shadow-sm'
            : 'border-gray-200/40 bg-white hover:border-gray-200/80 hover:shadow-lg hover:shadow-gray-100/60'
        }`}
      >
        {/* Liquid Glass 호버 효과 */}
        <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-orange-500/[0.02] via-transparent to-amber-500/[0.02] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

        {/* 호버 시 좌측 액센트 라인 */}
        <div className="absolute top-5 bottom-5 left-0 w-1 rounded-r-full bg-gradient-to-b from-orange-400 to-amber-400 opacity-0 transition-all duration-300 group-hover:opacity-100" />

        {/* 컨텐츠 영역 */}
        <div className="flex min-w-0 flex-1 flex-col justify-between">
          {/* 상단: 메타 정보 (카테고리 + 주차) - 한 줄로 */}
          <div className="mb-1.5 flex items-center gap-1.5 text-xs text-gray-500">
            {post.pinned && (
              <span className="inline-flex shrink-0 items-center gap-1 font-bold text-orange-600">
                <FiMapPin className="h-3 w-3" />
                공지
              </span>
            )}
            {post.pinned && <span className="text-gray-300">·</span>}
            <span className="shrink-0 font-medium text-gray-600">{post.categoryName}</span>
            {post.categoryName === BOOTCAMP_DIARY_CATEGORY_NAME && post.tags.length > 0 && post.tags[0].match(/^\d+월 \d+주차$/) && (
              <>
                <span className="text-gray-300">·</span>
                <span className="shrink-0 font-medium text-blue-600">{post.tags[0]}</span>
              </>
            )}
            {isPopular && !post.pinned && (
              <>
                <span className="text-gray-300">·</span>
                <span className="inline-flex shrink-0 items-center gap-0.5 font-semibold text-rose-500">
                  <FiTrendingUp className="h-3 w-3" />
                  인기
                </span>
              </>
            )}
          </div>

          {/* 제목 */}
          <h3 className="line-clamp-2 text-[15px] font-bold leading-snug text-gray-900 transition-colors duration-200 group-hover:text-orange-600 sm:line-clamp-1 sm:text-lg">
            <Link href={`/community/${post.id}`} onClick={e => e.stopPropagation()}>
              {post.title}
            </Link>
          </h3>

          {/* 부트캠프 성장일기 태그 - 데스크탑에서만 표시 */}
          {post.categoryName === BOOTCAMP_DIARY_CATEGORY_NAME && post.tags.filter(tag => !tag.match(/^\d+월 \d+주차$/)).length > 0 && (
            <div className="mt-2 hidden flex-nowrap gap-2 overflow-hidden sm:flex">
              {post.tags
                .filter(tag => !tag.match(/^\d+월 \d+주차$/))
                .slice(0, 3)
                .map(tag => (
                  <ClickableTag key={tag} tag={tag} maxLength={10} />
                ))}
            </div>
          )}

          {/* 하단: 작성자 + 통계 - 한 줄로 컴팩트하게 */}
          <div className="mt-2 flex items-center justify-between text-xs sm:mt-3 sm:text-sm">
            {/* 작성자 정보 + 시간 */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              <UserProfileLink
                userId={post.authorId}
                onClick={e => e.stopPropagation()}
                className="transition-transform hover:scale-105"
              >
                <UserAvatar nickname={post.authorNickname} size="xs" />
              </UserProfileLink>
              <UserProfileLink
                userId={post.authorId}
                onClick={e => e.stopPropagation()}
                className="max-w-[80px] truncate font-medium text-gray-700 transition-colors hover:text-orange-600 sm:max-w-none"
              >
                {post.authorNickname}
              </UserProfileLink>
              <span className="text-gray-300">·</span>
              <span className="shrink-0 text-gray-500" title={post.createdAt.toLocaleString('ko-KR')}>
                {relativeTime}
              </span>
            </div>

            {/* 통계 - 항상 표시 */}
            <div className="flex items-center gap-2.5 text-gray-500 sm:gap-4">
              <span className="flex items-center gap-1 transition-colors group-hover:text-gray-700">
                <FiEye className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span className="tabular-nums">{post.viewCount}</span>
              </span>
              <span className={`flex items-center gap-1 transition-colors ${isPopular ? 'text-rose-500' : 'group-hover:text-rose-500'}`}>
                <FiHeart className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${isPopular ? 'fill-rose-500' : ''}`} />
                <span className="tabular-nums">{post.likeCount}</span>
              </span>
              <span className="flex items-center gap-1 transition-colors group-hover:text-blue-500">
                <FiMessageCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span className="tabular-nums">{post.commentCount}</span>
              </span>
            </div>
          </div>
        </div>

        {/* 썸네일 영역 (오른쪽) - 데스크탑에서만 표시 */}
        {post.thumbnailUrl && (
          <div className="hidden shrink-0 sm:block">
            <div className="relative h-20 w-28 overflow-hidden rounded-xl sm:h-[72px] sm:w-[100px]">
              <Image
                src={post.thumbnailUrl}
                alt={post.title}
                fill
                sizes="100px"
                quality={85}
                className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
