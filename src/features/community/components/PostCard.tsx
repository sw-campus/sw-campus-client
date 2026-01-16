'use client'

import Image from 'next/image'
import Link from 'next/link'
import { FiEye, FiHeart, FiMessageCircle, FiImage } from 'react-icons/fi'

import type { Post } from '../api/postApi.types'

interface PostCardProps {
  post: Post
}

/**
 * 게시글 카드 컴포넌트
 * - 썸네일, 제목, 작성자, 통계 정보 표시
 */
export function PostCard({ post }: PostCardProps) {
  const formattedDate = new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(post.createdAt)

  return (
    <Link
      href={`/community/${post.id}`}
      className="group block overflow-hidden rounded-2xl border border-gray-200 bg-white/70 shadow-md backdrop-blur-xl transition-all hover:-translate-y-1 hover:shadow-lg"
    >
      {/* 썸네일 */}
      {post.thumbnailUrl ? (
        <div className="relative aspect-video w-full overflow-hidden bg-gray-100">
          <Image
            src={post.thumbnailUrl}
            alt={post.title}
            fill
            className="object-cover transition-transform group-hover:scale-105"
          />
        </div>
      ) : (
        <div className="flex aspect-video w-full items-center justify-center bg-gradient-to-br from-orange-50 to-orange-100">
          <FiImage className="h-12 w-12 text-orange-200" />
        </div>
      )}

      {/* 컨텐츠 */}
      <div className="p-4">
        {/* 카테고리 & 태그 */}
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-orange-100 px-2 py-0.5 text-xs font-medium text-orange-700">
            {post.categoryName}
          </span>
          {post.tags.slice(0, 2).map(tag => (
            <span key={tag} className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
              #{tag}
            </span>
          ))}
        </div>

        {/* 제목 */}
        <h3 className="mb-2 line-clamp-2 text-base font-semibold text-gray-900 group-hover:text-orange-600">
          {post.title}
        </h3>

        {/* 작성자 & 날짜 */}
        <p className="mb-3 text-sm text-gray-500">
          {post.authorNickname} · {formattedDate}
        </p>

        {/* 통계 */}
        <div className="flex items-center gap-4 text-xs text-gray-500">
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
    </Link>
  )
}
