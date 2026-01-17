'use client'

import Image from 'next/image'
import Link from 'next/link'
import { FiEye, FiHeart, FiMessageCircle, FiImage } from 'react-icons/fi'

import type { Post } from '../api/postApi.types'

interface PostListRowProps {
  post: Post
}

/**
 * 게시글 줄형 아이템 컴포넌트 (심플 스타일)
 * - 가로 레이아웃으로 게시글 표시
 */
export function PostListRow({ post }: PostListRowProps) {
  const formattedDate = new Intl.DateTimeFormat('ko-KR', {
    month: 'short',
    day: 'numeric',
  }).format(post.createdAt)

  return (
    <div className="block w-full">
      <Link
        href={`/community/${post.id}`}
        className="group flex w-[800px] max-w-full gap-4 rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition-all hover:border-orange-200 hover:bg-orange-50/30 hover:shadow-md"
      >
      {/* 썸네일 */}
      <div className="hidden shrink-0 sm:block">
        {post.thumbnailUrl ? (
          <div className="relative h-24 w-36 overflow-hidden rounded-lg bg-gray-100">
            <Image
              src={post.thumbnailUrl}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        ) : (
          <div className="flex h-24 w-36 items-center justify-center rounded-lg bg-gradient-to-br from-orange-50 to-orange-100">
            <FiImage className="h-8 w-8 text-orange-200" />
          </div>
        )}
      </div>

      {/* 컨텐츠 영역 */}
      <div className="flex min-w-0 flex-1 flex-col justify-between">
        {/* 상단: 카테고리 + 제목 */}
        <div>
          <div className="mb-1.5 flex items-center gap-2">
            <span className="shrink-0 rounded bg-orange-100 px-2 py-0.5 text-xs font-medium text-orange-700">
              {post.categoryName}
            </span>
          </div>
          <h3 className="line-clamp-1 text-base font-semibold text-gray-900 transition-colors group-hover:text-orange-600 sm:text-lg">
            {post.title}
          </h3>

          {/* 부트캠프 성장일기: 강의명, 훈련기관명 태그 */}
          {post.categoryName === '부트캠프 성장일기' && post.tags.length > 0 && (
            <div className="mt-1 flex gap-2">
              {post.tags.slice(0, 2).map(tag => (
                <span key={tag} className="text-xs text-gray-500">
                  #{tag.length > 10 ? tag.slice(0, 10) + '...' : tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* 하단: 작성자, 날짜, 통계 */}
        <div className="mt-2 flex items-center justify-between text-xs text-gray-500 sm:text-sm">
          <div className="flex items-center gap-2">
            <span className="font-medium text-gray-700">{post.authorNickname}</span>
            <span className="text-gray-300">·</span>
            <span>{formattedDate}</span>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1">
              <FiEye className="h-3.5 w-3.5" />
              {post.viewCount}
            </span>
            <span className="flex items-center gap-1">
              <FiHeart className="h-3.5 w-3.5" />
              {post.likeCount}
            </span>
            <span className="flex items-center gap-1">
              <FiMessageCircle className="h-3.5 w-3.5" />
              {post.commentCount}
            </span>
          </div>
        </div>
      </div>
    </Link>
    </div>
  )
}
