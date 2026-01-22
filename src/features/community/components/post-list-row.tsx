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
          {/* 상단: 배지 + 제목 */}
          <div className="space-y-2">
            {/* 배지 영역 */}
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              {post.pinned && (
                <span className="inline-flex items-center gap-1 rounded-lg bg-gradient-to-r from-orange-100 to-amber-100 px-2.5 py-1 text-xs font-bold text-orange-600">
                  <FiMapPin className="h-3 w-3" />
                  공지
                </span>
              )}
              <span className="rounded-lg bg-gray-100/80 px-2.5 py-1 text-xs font-medium text-gray-600">
                {post.categoryName}
              </span>
              {/* 부트캠프 성장일기 주차 정보 */}
              {post.categoryName === BOOTCAMP_DIARY_CATEGORY_NAME && post.tags.length > 0 && post.tags[0].match(/^\d+월 \d+주차$/) && (
                <span className="rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-600">
                  {post.tags[0]}
                </span>
              )}
              {isPopular && !post.pinned && (
                <span className="inline-flex items-center gap-1 rounded-lg bg-gradient-to-r from-rose-50 to-pink-50 px-2.5 py-1 text-xs font-semibold text-rose-600">
                  <FiTrendingUp className="h-3 w-3" />
                  인기
                </span>
              )}
            </div>

            {/* 제목 */}
            <h3 className="line-clamp-1 text-base font-bold text-gray-900 transition-colors duration-200 group-hover:text-orange-600 sm:text-lg">
              <Link href={`/community/${post.id}`} onClick={e => e.stopPropagation()}>
                {post.title}
              </Link>
            </h3>

            {/* 부트캠프 성장일기 태그 (주차 정보 태그는 카테고리 옆에 표시하므로 제외) */}
            {post.categoryName === BOOTCAMP_DIARY_CATEGORY_NAME && post.tags.filter(tag => !tag.match(/^\d+월 \d+주차$/)).length > 0 && (
              <div className="flex gap-2 overflow-hidden">
                {post.tags
                  .filter(tag => !tag.match(/^\d+월 \d+주차$/))
                  .slice(0, 3)
                  .map(tag => (
                    <ClickableTag key={tag} tag={tag} maxLength={10} />
                  ))}
              </div>
            )}
          </div>

          {/* 하단: 작성자 정보 + 통계 */}
          <div className="mt-3 flex items-center justify-between">
            {/* 작성자 정보 */}
            <div className="flex items-center gap-2 text-sm">
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
                className="font-medium text-gray-700 transition-colors hover:text-orange-600"
              >
                {post.authorNickname}
              </UserProfileLink>
              <span className="h-1 w-1 rounded-full bg-gray-300" />
              <span className="text-gray-500" title={post.createdAt.toLocaleString('ko-KR')}>
                {relativeTime}
              </span>
            </div>

            {/* 통계 */}
            <div className="flex items-center gap-3 text-sm text-gray-500 sm:gap-4">
              <span className="flex items-center gap-1 transition-colors group-hover:text-gray-700">
                <FiEye className="h-4 w-4" />
                <span className="tabular-nums">{post.viewCount}</span>
              </span>
              <span className={`flex items-center gap-1 transition-colors ${isPopular ? 'text-rose-500' : 'group-hover:text-rose-500'}`}>
                <FiHeart className={`h-4 w-4 ${isPopular ? 'fill-rose-500' : ''}`} />
                <span className="tabular-nums">{post.likeCount}</span>
              </span>
              <span className="flex items-center gap-1 transition-colors group-hover:text-blue-500">
                <FiMessageCircle className="h-4 w-4" />
                <span className="tabular-nums">{post.commentCount}</span>
              </span>
            </div>
          </div>
        </div>

        {/* 썸네일 영역 (오른쪽) - 있을 때만 표시 */}
        {post.thumbnailUrl && (
          <div className="relative hidden h-20 w-28 shrink-0 overflow-hidden rounded-xl sm:block sm:h-24 sm:w-36">
            <Image
              src={post.thumbnailUrl}
              alt={post.title}
              fill
              sizes="(max-width: 640px) 112px, 144px"
              quality={85}
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            />
          </div>
        )}
      </div>
    </div>
  )
}
