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
 * 게시글 줄형 아이템 컴포넌트 (심플 스타일)
 * - 가로 레이아웃으로 게시글 표시
 * - 반응형 디자인, 상대 시간, 인기글 뱃지
 */
export function PostListRow({ post }: PostListRowProps) {
  const router = useRouter()
  const relativeTime = formatRelativeTime(post.createdAt)
  const isPopular = post.likeCount >= POPULAR_THRESHOLD

  return (
    <div className="block w-full">
      <div
        onClick={() => router.push(`/community/${post.id}`)}
        className={`group flex w-full cursor-pointer gap-3 rounded-xl border p-3 shadow-sm transition-all duration-200 active:scale-[0.99] sm:gap-4 sm:p-4 sm:hover:-translate-y-0.5 sm:hover:shadow-lg ${
          post.pinned
            ? 'border-orange-200 bg-orange-50/60 hover:bg-orange-50'
            : 'border-gray-100 bg-white hover:border-orange-200 hover:bg-orange-50/30'
        }`}
      >
        {/* 썸네일 - 모바일에서도 작은 크기로 표시 */}
        <div className="shrink-0">
          {post.thumbnailUrl ? (
            <div className="relative h-16 w-16 overflow-hidden rounded-lg bg-gray-100 sm:h-24 sm:w-36">
              <Image
                src={post.thumbnailUrl}
                alt={post.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-110"
              />
            </div>
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-gradient-to-br from-orange-50 to-orange-100 sm:h-24 sm:w-36">
              <FiImage className="h-5 w-5 text-orange-200 sm:h-8 sm:w-8" />
            </div>
          )}
        </div>

        {/* 컨텐츠 영역 */}
        <div className="flex min-w-0 flex-1 flex-col justify-between">
          {/* 상단: 카테고리 + 인기 뱃지 + 제목 */}
          <div>
            <div className="mb-1.5 flex items-center gap-2">
              {post.pinned && (
                <span className="flex shrink-0 items-center gap-1 rounded bg-orange-100 px-2 py-0.5 text-xs font-bold text-orange-600">
                  <FiMapPin className="h-3 w-3 fill-orange-600" />
                  공지
                </span>
              )}
              <span className="shrink-0 rounded bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
                {post.categoryName}
              </span>
              {isPopular && (
                <span className="flex shrink-0 items-center gap-1 rounded bg-red-50 px-2 py-0.5 text-xs font-medium text-red-600">
                  <FiTrendingUp className="h-3 w-3" />
                  인기
                </span>
              )}
            </div>
            <h3 className="line-clamp-1 text-base font-semibold text-gray-900 transition-colors group-hover:text-orange-600 sm:text-lg">
              <Link href={`/community/${post.id}`} onClick={e => e.stopPropagation()}>
                {post.title}
              </Link>
            </h3>

            {/* 부트캠프 성장일기: 강의명, 훈련기관명 태그 */}
            {post.categoryName === '부트캠프 성장일기' && post.tags.length > 0 && (
              <div className="mt-1 flex gap-2">
                {post.tags.slice(0, 2).map(tag => (
                  <ClickableTag key={tag} tag={tag} maxLength={10} />
                ))}
              </div>
            )}
          </div>

          {/* 하단: 작성자, 날짜, 통계 */}
          <div className="mt-2 flex items-center justify-between text-xs text-gray-500 sm:text-sm">
            <div className="flex items-center gap-2">
              <Link
                href={`/community/user/${post.authorId}`}
                onClick={e => e.stopPropagation()}
                className="font-medium text-gray-700 transition-colors hover:text-orange-600 hover:underline"
              >
                {post.authorNickname}
              </Link>
              <span className="text-gray-300">·</span>
              <span title={post.createdAt.toLocaleString('ko-KR')}>{relativeTime}</span>
            </div>

            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1">
                <FiEye className="h-3.5 w-3.5" />
                {post.viewCount}
              </span>
              <span className={`flex items-center gap-1 ${isPopular ? 'font-medium text-red-500' : ''}`}>
                <FiHeart className={`h-3.5 w-3.5 ${isPopular ? 'fill-red-500' : ''}`} />
                {post.likeCount}
              </span>
              <span className="flex items-center gap-1">
                <FiMessageCircle className="h-3.5 w-3.5" />
                {post.commentCount}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
