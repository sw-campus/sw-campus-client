'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FiEye, FiHeart, FiMessageCircle, FiTrendingUp, FiMapPin } from 'react-icons/fi'

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
 * 게시글 줄형 아이템 컴포넌트 (모던 미니멀 스타일)
 * - 깔끔한 가로 레이아웃
 * - 세련된 호버 효과
 * - 부드러운 애니메이션
 */
export function PostListRow({ post }: PostListRowProps) {
  const router = useRouter()
  const relativeTime = formatRelativeTime(post.createdAt)
  const isPopular = post.likeCount >= POPULAR_THRESHOLD

  return (
    <div className="block w-full">
      <div
        onClick={() => router.push(`/community/${post.id}`)}
        className={`group relative flex w-full cursor-pointer flex-col gap-2 rounded-2xl border p-4 transition-all duration-300 ease-out active:scale-[0.99] sm:gap-0 sm:p-5 sm:active:scale-100 ${
          post.pinned
            ? 'border-orange-200/80 bg-gradient-to-r from-orange-50/80 via-amber-50/50 to-orange-50/80'
            : 'border-gray-200/60 bg-white hover:border-gray-300/80 hover:shadow-lg hover:shadow-gray-100/80'
        }`}
      >
        {/* 호버 시 좌측 액센트 라인 */}
        <div className="absolute top-4 bottom-4 left-0 w-1 rounded-r-full bg-gradient-to-b from-orange-400 to-amber-400 opacity-0 transition-all duration-300 group-hover:opacity-100" />

        {/* 상단 영역: 컨텐츠 + 썸네일 */}
        <div className="flex min-w-0 flex-1 gap-4 sm:gap-5">
          {/* 컨텐츠 영역 */}
          <div className="flex min-w-0 flex-1 flex-col justify-between py-0.5">
            {/* 상단: 배지 + 제목 */}
            <div className="space-y-2">
              {/* 배지 영역 */}
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                {post.pinned && (
                  <span className="inline-flex items-center gap-1 rounded-md bg-orange-100 px-2 py-0.5 text-xs font-bold text-orange-600">
                    <FiMapPin className="h-3 w-3" />
                    공지
                  </span>
                )}
                <span className="rounded-md bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
                  {post.categoryName}
                </span>
                {/* 부트캠프 성장일기 주차 정보 */}
                {post.categoryName === BOOTCAMP_DIARY_CATEGORY_NAME && post.tags.length > 0 && post.tags[0].match(/^\d+월 \d+주차$/) && (
                  <span className="rounded-md bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-600">
                    {post.tags[0]}
                  </span>
                )}
                {isPopular && (
                  <span className="inline-flex items-center gap-1 rounded-md bg-gradient-to-r from-rose-50 to-pink-50 px-2 py-0.5 text-xs font-semibold text-rose-600">
                    <FiTrendingUp className="h-3 w-3" />
                    인기
                  </span>
                )}
              </div>

              {/* 제목 */}
              <h3 className="line-clamp-1 text-[15px] font-semibold text-gray-900 transition-colors duration-200 group-hover:text-orange-600 sm:text-base">
                <Link href={`/community/${post.id}`} onClick={e => e.stopPropagation()}>
                  {post.title}
                </Link>
              </h3>

              {/* 부트캠프 성장일기 태그 (주차 정보 태그는 카테고리 옆에 표시하므로 제외) */}
              {post.categoryName === BOOTCAMP_DIARY_CATEGORY_NAME && post.tags.filter(tag => !tag.match(/^\d+월 \d+주차$/)).length > 0 && (
                <div className="flex gap-2 overflow-hidden">
                  {post.tags
                    .filter(tag => !tag.match(/^\d+월 \d+주차$/))
                    .slice(0, 2)
                    .map(tag => (
                      <ClickableTag key={tag} tag={tag} maxLength={8} />
                    ))}
                </div>
              )}
            </div>

            {/* 작성자 정보 */}
            <div className="mt-2 flex items-center gap-1.5 text-sm sm:mt-3 sm:gap-2">
              <Link
                href={`/community/user/${post.authorId}`}
                onClick={e => e.stopPropagation()}
                className="font-medium text-gray-700 transition-colors hover:text-orange-600"
              >
                {post.authorNickname}
              </Link>
              <span className="h-1 w-1 rounded-full bg-gray-300" />
              <span className="text-gray-500" title={post.createdAt.toLocaleString('ko-KR')}>
                {relativeTime}
              </span>
            </div>
          </div>

          {/* 썸네일 - 오른쪽에 배치, 있을 때만 표시 */}
          {post.thumbnailUrl && (
            <div className="shrink-0">
              <div className="relative h-16 w-16 overflow-hidden rounded-xl bg-gray-100 ring-1 ring-gray-200/50 sm:h-[88px] sm:w-32">
                <Image
                  src={post.thumbnailUrl}
                  alt={post.title}
                  fill
                  sizes="(max-width: 639px) 128px, 256px"
                  quality={90}
                  className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                />
              </div>
            </div>
          )}
        </div>

        {/* 하단: 통계 - 카드 전체 너비 기준 오른쪽 정렬 */}
        <div className="mt-2 flex items-center justify-end gap-3 text-xs text-gray-500 sm:mt-0 sm:absolute sm:right-5 sm:bottom-5 sm:gap-4 sm:text-sm">
          <span className="flex items-center gap-1">
            <FiEye className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            <span className="tabular-nums">{post.viewCount}</span>
          </span>
          <span className={`flex items-center gap-1 transition-colors ${isPopular ? 'text-rose-500' : ''}`}>
            <FiHeart className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${isPopular ? 'fill-rose-500' : ''}`} />
            <span className="tabular-nums">{post.likeCount}</span>
          </span>
          <span className="flex items-center gap-1">
            <FiMessageCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            <span className="tabular-nums">{post.commentCount}</span>
          </span>
        </div>
      </div>
    </div>
  )
}
