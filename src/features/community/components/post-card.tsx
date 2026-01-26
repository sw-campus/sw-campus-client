'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { FiHeart, FiMessageCircle, FiMapPin, FiFileText, FiTrendingUp } from 'react-icons/fi'

import { UserAvatar } from '@/components/ui/user-avatar'
import { formatRelativeTime } from '@/lib/format-relative-time'

import type { Post } from '../api/post-api.types'
import { BOOTCAMP_DIARY_CATEGORY_NAME } from '../constants'
import { ClickableTag } from './clickable-tag'

interface PostCardProps {
  post: Post
}

// 인기글 기준
const POPULAR_THRESHOLD = 10

/**
 * 게시글 카드 컴포넌트
 * - 모바일 최적화된 터치 인터랙션
 * - 다이내믹한 호버/액티브 효과
 * - 글래스모피즘 배지 스타일
 */
export function PostCard({ post }: PostCardProps) {
  const router = useRouter()
  const relativeTime = formatRelativeTime(post.createdAt)
  const isPopular = post.likeCount >= POPULAR_THRESHOLD

  return (
    <article
      onClick={() => router.push(`/community/${post.id}`)}
      className="group cursor-pointer"
    >
      <div className="relative h-full overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm ring-1 ring-gray-900/[0.04] transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-xl hover:shadow-orange-100/40 hover:ring-orange-200/50 active:scale-[0.98] sm:rounded-[1.25rem] sm:active:scale-100">
        {/* 상단 그라데이션 악센트 바 */}
        <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-orange-400 via-amber-400 to-orange-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        {/* 썸네일 영역 */}
        <div className="relative aspect-[4/3] w-full overflow-hidden sm:aspect-[16/10]">
          {post.thumbnailUrl ? (
            <>
              <Image
                src={post.thumbnailUrl}
                alt={post.title}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 300px"
                quality={85}
                className="object-cover transition-all duration-500 ease-out group-hover:scale-105 group-hover:brightness-[1.02]"
              />
              {/* 이미지 오버레이 - 하단 그라데이션 */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/5 to-transparent" />
              {/* 호버 시 오버레이 */}
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-amber-500/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </>
          ) : (
            /* 기본 이미지 - 패턴 배경 */
            <div className="relative flex h-full w-full items-center justify-center bg-gradient-to-br from-orange-50 via-amber-50/80 to-orange-100/60">
              {/* 데코레이티브 패턴 */}
              <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(251, 146, 60, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(245, 158, 11, 0.2) 0%, transparent 40%)' }} />
              <div className="relative rounded-2xl bg-white/70 p-3 shadow-sm backdrop-blur-sm transition-transform duration-300 group-hover:scale-110 sm:p-4">
                <FiFileText className="h-6 w-6 text-orange-400 sm:h-8 sm:w-8" />
              </div>
            </div>
          )}

          {/* 배지 영역 - 썸네일 위 */}
          <div className="absolute top-2 left-2 z-10 flex flex-wrap gap-1 sm:top-3 sm:left-3 sm:gap-1.5">
            {post.pinned && (
              <span className="inline-flex items-center gap-0.5 rounded-lg bg-white/95 px-1.5 py-0.5 text-[10px] font-bold text-orange-600 shadow-sm ring-1 ring-orange-200/50 backdrop-blur-md sm:gap-1 sm:rounded-xl sm:px-2 sm:py-1 sm:text-xs">
                <FiMapPin className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                공지
              </span>
            )}
            {isPopular && !post.pinned && (
              <span className="inline-flex items-center gap-0.5 rounded-lg bg-gradient-to-r from-rose-500 to-pink-500 px-1.5 py-0.5 text-[10px] font-bold text-white shadow-md shadow-rose-200/50 sm:gap-1 sm:rounded-xl sm:px-2 sm:py-1 sm:text-xs">
                <FiTrendingUp className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                인기
              </span>
            )}
          </div>

          {/* 카테고리 배지 - 우측 하단 */}
          <div className="absolute right-2 bottom-2 z-10 flex items-center gap-1 sm:right-3 sm:bottom-3 sm:gap-1.5">
            <span className="rounded-lg bg-black/60 px-1.5 py-0.5 text-[10px] font-medium text-white backdrop-blur-sm sm:rounded-xl sm:px-2 sm:py-1 sm:text-xs">
              {post.categoryName}
            </span>
            {post.categoryName === BOOTCAMP_DIARY_CATEGORY_NAME &&
              post.tags.length > 0 &&
              post.tags[0].match(/^\d+월 \d+주차$/) && (
                <span className="rounded-lg bg-white/90 px-1.5 py-0.5 text-[10px] font-medium text-gray-700 backdrop-blur-sm sm:rounded-xl sm:px-2 sm:py-1 sm:text-xs">
                  {post.tags[0]}
                </span>
              )}
          </div>
        </div>

        {/* 컨텐츠 영역 */}
        <div className="relative flex flex-col gap-2 p-3 sm:gap-2.5 sm:p-4">
          {/* 제목 */}
          <h3 className="line-clamp-2 min-h-[2.25rem] text-[13px] leading-snug font-semibold text-gray-900 transition-colors duration-200 group-hover:text-orange-600 sm:min-h-[2.75rem] sm:text-[15px] sm:leading-relaxed">
            {post.title}
          </h3>

          {/* 태그 영역 */}
          {post.categoryName === BOOTCAMP_DIARY_CATEGORY_NAME &&
          post.tags.filter(tag => !tag.match(/^\d+월 \d+주차$/)).length > 0 ? (
            <div className="flex h-5 gap-1 overflow-hidden sm:h-6 sm:gap-1.5">
              {post.tags
                .filter(tag => !tag.match(/^\d+월 \d+주차$/))
                .slice(0, 2)
                .map(tag => (
                  <ClickableTag key={tag} tag={tag} maxLength={6} />
                ))}
            </div>
          ) : (
            <div className="h-5 sm:h-6" />
          )}

          {/* 구분선 */}
          <div className="h-px bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100" />

          {/* 푸터 영역 */}
          <div className="flex items-center justify-between">
            {/* 작성자 정보 */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              <UserAvatar nickname={post.authorNickname} size="xs" />
              <div className="flex items-center gap-1 text-[11px] text-gray-500 sm:text-xs">
                <span className="max-w-[50px] truncate font-medium text-gray-700 sm:max-w-[80px]">
                  {post.authorNickname ?? '익명'}
                </span>
                <span className="text-gray-300">·</span>
                <span title={post.createdAt.toLocaleString('ko-KR')}>{relativeTime}</span>
              </div>
            </div>

            {/* 통계 */}
            <div className="flex items-center gap-2 text-[11px] text-gray-400 sm:gap-2.5 sm:text-xs">
              <span className={`flex items-center gap-0.5 transition-colors sm:gap-1 ${isPopular ? 'text-rose-500' : 'group-hover:text-rose-400'}`}>
                <FiHeart className={`h-3 w-3 sm:h-3.5 sm:w-3.5 ${isPopular ? 'fill-rose-500' : ''}`} />
                <span className="tabular-nums">{post.likeCount}</span>
              </span>
              <span className="flex items-center gap-0.5 transition-colors group-hover:text-blue-400 sm:gap-1">
                <FiMessageCircle className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                <span className="tabular-nums">{post.commentCount}</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}
