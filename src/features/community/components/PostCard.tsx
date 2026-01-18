'use client'

import Image from 'next/image'
import Link from 'next/link'
import { FiEye, FiHeart, FiMessageCircle, FiImage, FiMapPin } from 'react-icons/fi'

import type { Post } from '../api/postApi.types'
import { ClickableTag } from './ClickableTag'

interface PostCardProps {
  post: Post
}

/**
 * 게시글 카드 컴포넌트 (Velog 스타일)
 * - 썸네일, 제목, 본문 미리보기, 작성자 정보
 */
export function PostCard({ post }: PostCardProps) {
  const formattedDate = new Intl.DateTimeFormat('ko-KR', {
    month: 'short',
    day: 'numeric',
  }).format(post.createdAt)

  return (
    <Link
      href={`/community/${post.id}`}
      className={`group flex w-full flex-col overflow-hidden rounded-2xl border bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg ${
        post.pinned 
          ? 'border-orange-200 ring-1 ring-orange-100' 
          : 'border-gray-100'
      }`}
    >
      {/* 썸네일 */}
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-gray-100">
        {post.thumbnailUrl ? (
          <Image
            src={post.thumbnailUrl}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className={`flex h-full w-full items-center justify-center ${
            post.pinned 
              ? 'bg-gradient-to-br from-orange-100 to-orange-200' 
              : 'bg-gradient-to-br from-orange-50 to-orange-100'
          }`}>
            <FiImage className={`h-12 w-12 ${post.pinned ? 'text-orange-400' : 'text-orange-200'}`} />
          </div>
        )}
        
        {/* 배지 영역 */}
        <div className="absolute top-3 left-3 flex gap-2">
          {post.pinned && (
            <span className="flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-xs font-bold text-orange-600 shadow-sm backdrop-blur-sm">
              <FiMapPin className="h-3 w-3 fill-orange-600" />
              공지
            </span>
          )}
          <span className="rounded-full bg-orange-500 px-2.5 py-1 text-xs font-medium text-white shadow-sm">
            {post.categoryName}
          </span>
        </div>
      </div>

      {/* 컨텐츠 */}
      <div className="flex flex-1 flex-col p-4">
        {/* 제목 */}
        <h3 className="mb-2 line-clamp-2 text-lg font-bold text-gray-900 transition-colors group-hover:text-orange-600">
          {post.title}
        </h3>

        {/* 부트캠프 성장일기: 강의명, 훈련기관명 태그 */}
        {post.categoryName === '부트캠프 성장일기' && post.tags.length > 0 && (
          <div className="mb-2 flex flex-wrap gap-1.5">
            {post.tags.slice(0, 2).map(tag => (
              <ClickableTag key={tag} tag={tag} maxLength={10} />
            ))}
          </div>
        )}

        {/* 작성자 & 통계 */}
        <div className="mt-auto flex items-center justify-between pt-3 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <Link
              href={`/community/user/${post.authorId}`}
              onClick={(e) => e.stopPropagation()}
              className="font-medium text-gray-700 transition-colors hover:text-orange-600 hover:underline"
            >
              {post.authorNickname}
            </Link>
            <span className="text-gray-300">·</span>
            <span>{formattedDate}</span>
          </div>

          <div className="flex items-center gap-3 text-xs">
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
  )
}
