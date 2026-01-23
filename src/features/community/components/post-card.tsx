'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { FiHeart, FiMessageCircle, FiMapPin, FiFileText } from 'react-icons/fi'

import { formatRelativeTime } from '@/lib/format-relative-time'

import type { Post } from '../api/post-api.types'
import { BOOTCAMP_DIARY_CATEGORY_NAME } from '../constants'
import { ClickableTag } from './clickable-tag'

interface PostCardProps {
  post: Post
}

/**
 * 게시글 카드 컴포넌트 (모던 글래스모피즘 스타일)
 * - 모바일에서 컴팩트한 크기
 * - 부드러운 그라데이션 배경
 * - 섬세한 호버 애니메이션
 */
export function PostCard({ post }: PostCardProps) {
  const router = useRouter()
  const relativeTime = formatRelativeTime(post.createdAt)

  return (
    <div
      onClick={() => router.push(`/community/${post.id}`)}
      className="group cursor-pointer active:scale-[0.98] sm:active:scale-100"
    >
      <div className="relative h-full overflow-hidden rounded-xl border border-gray-200/60 bg-white shadow-sm transition-all duration-300 ease-out hover:border-gray-300/80 hover:shadow-xl hover:shadow-gray-200/50 sm:rounded-2xl">
        {/* 호버 시 나타나는 그라데이션 오버레이 */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-orange-500/[0.02] to-amber-500/[0.02] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        {/* 썸네일 영역 */}
        <div className="relative aspect-[4/3] w-full overflow-hidden sm:aspect-[16/9]">
          {post.thumbnailUrl ? (
            <>
              <Image
                src={post.thumbnailUrl}
                alt={post.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
                quality={90}
                className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
              />
              {/* 이미지 위 그라데이션 오버레이 */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </>
          ) : (
            /* 기본 이미지 - 그라데이션 배경 */
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100">
              <div className="rounded-2xl bg-white/60 p-4 shadow-sm backdrop-blur-sm">
                <FiFileText className="h-8 w-8 text-orange-300 sm:h-10 sm:w-10" />
              </div>
            </div>
          )}

          {/* 배지 영역 - 썸네일 위 */}
          <div className="absolute top-2 left-2 flex flex-wrap gap-1.5 sm:top-3 sm:left-3 sm:gap-2">
            {post.pinned && (
              <span className="inline-flex items-center gap-0.5 rounded-full bg-white/95 px-2 py-0.5 text-[10px] font-semibold text-orange-600 shadow-sm backdrop-blur-md sm:gap-1 sm:px-2.5 sm:py-1 sm:text-xs">
                <FiMapPin className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                공지
              </span>
            )}
            <span className="rounded-full bg-gradient-to-r from-orange-500 to-amber-500 px-2 py-0.5 text-[10px] font-medium text-white shadow-sm sm:px-2.5 sm:py-1 sm:text-xs">
              {post.categoryName}
            </span>
            {/* 부트캠프 수강일기 주차 정보 */}
            {post.categoryName === BOOTCAMP_DIARY_CATEGORY_NAME && post.tags.length > 0 && post.tags[0].match(/^\d+월 \d+주차$/) && (
              <span className="rounded-full bg-white/95 px-2 py-0.5 text-[10px] font-medium text-gray-700 shadow-sm backdrop-blur-md sm:px-2.5 sm:py-1 sm:text-xs">
                {post.tags[0]}
              </span>
            )}
          </div>
        </div>

        {/* 컨텐츠 영역 - 모바일에서 더 작은 패딩 */}
        <div className="relative flex flex-col p-3 sm:p-4">
          <h3 className="line-clamp-2 min-h-[2.5rem] text-[13px] leading-snug font-semibold text-gray-900 transition-colors duration-200 group-hover:text-orange-600 sm:min-h-[3rem] sm:text-[15px] sm:leading-relaxed">
            {post.title}
          </h3>

          {/* 태그 영역 (주차 정보 태그는 카테고리 옆에 표시하므로 제외) */}
          {post.categoryName === BOOTCAMP_DIARY_CATEGORY_NAME && post.tags.filter(tag => !tag.match(/^\d+월 \d+주차$/)).length > 0 ? (
            <div className="mt-2 flex h-5 gap-1.5 overflow-hidden sm:mt-3 sm:h-6">
              {post.tags
                .filter(tag => !tag.match(/^\d+월 \d+주차$/))
                .slice(0, 2)
                .map(tag => (
                  <ClickableTag key={tag} tag={tag} maxLength={8} />
                ))}
            </div>
          ) : (
            <div className="mt-2 h-5 sm:mt-3 sm:h-6" />
          )

          {/* 구분선 */}
          <div className="my-2.5 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent sm:my-3" />

          {/* 푸터 영역 */}
          <div className="flex items-center justify-between text-[11px] sm:text-[13px]">
            <div className="flex items-center gap-1 sm:gap-1.5">
              <span className="max-w-[70px] truncate font-medium text-gray-700 sm:max-w-[100px]">
                {post.authorNickname ?? '익명'}
              </span>
              <span className="h-1 w-1 rounded-full bg-gray-300" />
              <span className="text-gray-500" title={post.createdAt.toLocaleString('ko-KR')}>
                {relativeTime}
              </span>
            </div>

            <div className="flex items-center gap-2 text-gray-500 sm:gap-3">
              <span className="flex items-center gap-0.5 transition-colors group-hover:text-rose-500 sm:gap-1">
                <FiHeart className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                <span className="tabular-nums">{post.likeCount}</span>
              </span>
              <span className="flex items-center gap-0.5 transition-colors group-hover:text-blue-500 sm:gap-1">
                <FiMessageCircle className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                <span className="tabular-nums">{post.commentCount}</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
