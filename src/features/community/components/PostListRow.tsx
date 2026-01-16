'use client'

import Image from 'next/image'
import Link from 'next/link'
import { FiEye, FiHeart, FiMessageCircle, FiImage } from 'react-icons/fi'

import type { Post } from '../api/postApi.types'

interface PostListRowProps {
  post: Post
}

/**
 * 게시글 줄형 아이템 컴포넌트
 * - 가로 레이아웃으로 게시글 표시
 */
export function PostListRow({ post }: PostListRowProps) {
  const formattedDate = new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(post.createdAt)

  return (
    <div className="block w-full">
      <Link
        href={`/community/${post.id}`}
        className="group flex h-40 w-full items-center gap-5 rounded-xl border border-gray-200 bg-white/70 p-4 shadow-sm backdrop-blur-xl transition-all hover:border-orange-200 hover:bg-orange-50/30 hover:shadow-md"
      >
        {/* 썸네일 (고정 크기) */}
        <div className="hidden flex-shrink-0 sm:block">
          {post.thumbnailUrl ? (
            <div className="relative h-32 w-48 overflow-hidden rounded-lg bg-gray-100">
              <Image
                src={post.thumbnailUrl}
                alt={post.title}
                fill
                className="object-cover transition-transform group-hover:scale-105"
              />
            </div>
          ) : (
            <div className="flex h-32 w-48 items-center justify-center rounded-lg bg-gradient-to-br from-orange-50 to-orange-100">
              <FiImage className="h-10 w-10 text-orange-200" />
            </div>
          )}
        </div>

        {/* 컨텐츠 (그리드 레이아웃으로 변경하여 위치 고정) */}
        <div className="flex h-full w-0 min-w-0 flex-1 flex-col justify-between overflow-hidden py-1">
          <div>
            {/* 상단: 카테고리 & 태그 */}
            <div className="mb-2 flex h-5 items-center gap-2 overflow-hidden">
              <span className="w-32 shrink-0 truncate rounded-full bg-orange-100 px-2 py-0.5 text-center text-xs font-medium text-orange-700">
                {post.categoryName}
              </span>
              {post.tags.slice(0, 3).map(tag => (
                <span
                  key={tag}
                  className="hidden truncate rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600 sm:inline"
                >
                  #{tag}
                </span>
              ))}
            </div>

            {/* 제목 */}
            <h3 className="truncate text-lg font-semibold text-gray-900 group-hover:text-orange-600">{post.title}</h3>
          </div>

          {/* 하단: 작성자, 날짜, 통계 */}
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-3">
              <span className="font-medium text-gray-700">{post.authorNickname}</span>
              <span className="text-gray-300">|</span>
              <span>{formattedDate}</span>
            </div>

            <div className="flex items-center gap-3">
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
