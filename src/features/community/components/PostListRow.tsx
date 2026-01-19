'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FiEye, FiHeart, FiMessageCircle, FiImage, FiTrendingUp, FiMapPin } from 'react-icons/fi'

import { formatRelativeTime } from '@/lib/formatRelativeTime'

import type { Post } from '../api/postApi.types'
import { ClickableTag } from './ClickableTag'

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
        className={`group relative flex w-full cursor-pointer gap-4 rounded-2xl border p-4 transition-all duration-300 ease-out active:scale-[0.99] sm:gap-5 sm:p-5 sm:active:scale-100 ${
          post.pinned
            ? 'border-orange-200/80 bg-gradient-to-r from-orange-50/80 via-amber-50/50 to-orange-50/80'
            : 'border-gray-200/60 bg-white hover:border-gray-300/80 hover:shadow-lg hover:shadow-gray-100/80'
        }`}
      >
        {/* 호버 시 좌측 액센트 라인 */}
        <div className="absolute top-4 bottom-4 left-0 w-1 rounded-r-full bg-gradient-to-b from-orange-400 to-amber-400 opacity-0 transition-all duration-300 group-hover:opacity-100" />

        {/* 썸네일 */}
        <div className="shrink-0">
          {post.thumbnailUrl ? (
            <div className="relative h-16 w-16 overflow-hidden rounded-xl bg-gray-100 ring-1 ring-gray-200/50 sm:h-[88px] sm:w-32">
              <Image
                src={post.thumbnailUrl}
                alt={post.title}
                fill
                sizes="(max-width: 639px) 64px, 128px"
                className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
              />
            </div>
          ) : (
            <div className={`flex h-16 w-16 items-center justify-center rounded-xl ring-1 ring-gray-200/50 sm:h-[88px] sm:w-32 ${
              post.pinned
                ? 'bg-gradient-to-br from-orange-100 to-amber-100'
                : 'bg-gradient-to-br from-gray-50 to-gray-100'
            }`}>
              <FiImage className={`h-5 w-5 sm:h-6 sm:w-6 ${post.pinned ? 'text-orange-300' : 'text-gray-300'}`} />
            </div>
          )}
        </div>

        {/* 컨텐츠 영역 */}
        <div className="flex min-w-0 flex-1 flex-col justify-between py-0.5">
          {/* 상단: 배지 + 제목 */}
          <div className="space-y-2">
            {/* 배지 영역 */}
            <div className="flex flex-wrap items-center gap-2">
              {post.pinned && (
                <span className="inline-flex items-center gap-1 rounded-md bg-orange-100 px-2 py-0.5 text-[11px] font-bold text-orange-600">
                  <FiMapPin className="h-3 w-3" />
                  공지
                </span>
              )}
              <span className="rounded-md bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-600">
                {post.categoryName}
              </span>
              {isPopular && (
                <span className="inline-flex items-center gap-1 rounded-md bg-gradient-to-r from-rose-50 to-pink-50 px-2 py-0.5 text-[11px] font-semibold text-rose-600">
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

            {/* 부트캠프 성장일기 태그 */}
            {post.categoryName === '부트캠프 성장일기' && post.tags.length > 0 && (
              <div className="flex gap-2">
                {post.tags.slice(0, 2).map(tag => (
                  <ClickableTag key={tag} tag={tag} maxLength={10} />
                ))}
              </div>
            )}
          </div>

          {/* 하단: 메타 정보 */}
          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center gap-2 text-[13px]">
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

            {/* 통계 */}
            <div className="flex items-center gap-4 text-[12px] text-gray-500">
              <span className="flex items-center gap-1">
                <FiEye className="h-3.5 w-3.5" />
                <span className="tabular-nums">{post.viewCount}</span>
              </span>
              <span className={`flex items-center gap-1 transition-colors ${isPopular ? 'text-rose-500' : ''}`}>
                <FiHeart className={`h-3.5 w-3.5 ${isPopular ? 'fill-rose-500' : ''}`} />
                <span className="tabular-nums">{post.likeCount}</span>
              </span>
              <span className="flex items-center gap-1">
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
