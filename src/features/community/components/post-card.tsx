'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { FiHeart, FiMessageCircle, FiMapPin, FiFileText, FiEye, FiTrendingUp } from 'react-icons/fi'

import { UserAvatar } from '@/components/ui/user-avatar'
import { formatRelativeTime } from '@/lib/format-relative-time'

import type { Post } from '../api/post-api.types'
import { BOOTCAMP_DIARY_CATEGORY_NAME } from '../constants'
import { ClickableTag } from './clickable-tag'

interface PostCardProps {
  post: Post
  /** Bento Grid 메인 카드용 variant */
  variant?: 'default' | 'featured'
}

// 인기글 기준
const POPULAR_THRESHOLD = 10

/**
 * 게시글 카드 컴포넌트 - 2026 트렌드 적용
 * - Liquid Glass 스타일 호버 효과
 * - Bento Grid 지원 (featured variant)
 * - 모바일에서 컴팩트한 크기
 * - 부드러운 그라데이션 배경
 * - 섬세한 호버 애니메이션
 */
export function PostCard({ post, variant = 'default' }: PostCardProps) {
  const router = useRouter()
  const relativeTime = formatRelativeTime(post.createdAt)
  const isPopular = post.likeCount >= POPULAR_THRESHOLD
  const isFeatured = variant === 'featured'

  return (
    <div
      onClick={() => router.push(`/community/${post.id}`)}
      className={`group cursor-pointer ${isFeatured ? 'h-full' : ''} active:scale-[0.98] sm:active:scale-100`}
    >
      <div className={`relative h-full overflow-hidden border bg-white shadow-sm transition-all duration-300 ease-out ${
        isFeatured
          ? 'rounded-2xl border-gray-200/40 hover:shadow-2xl hover:shadow-orange-100/50 sm:rounded-3xl'
          : 'rounded-xl border-gray-200/40 hover:border-gray-300/60 hover:shadow-xl hover:shadow-gray-100/50 sm:rounded-2xl'
      }`}>
        {/* Liquid Glass 호버 효과 */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-orange-500/[0.03] via-transparent to-amber-500/[0.03] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        <div className="pointer-events-none absolute -inset-px rounded-[inherit] bg-gradient-to-br from-orange-200/0 via-white/0 to-amber-200/0 opacity-0 transition-opacity duration-500 group-hover:from-orange-200/20 group-hover:via-white/10 group-hover:to-amber-200/20 group-hover:opacity-100" />

        {/* 썸네일 영역 */}
        <div className={`relative w-full overflow-hidden ${
          isFeatured
            ? 'aspect-[16/9] lg:aspect-[2/1]'
            : 'aspect-[4/3] sm:aspect-[16/10]'
        }`}>
          {post.thumbnailUrl ? (
            <>
              <Image
                src={post.thumbnailUrl}
                alt={post.title}
                fill
                sizes={isFeatured
                  ? "(max-width: 1024px) 100vw, 66vw"
                  : "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 300px"
                }
                quality={isFeatured ? 95 : 85}
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
              />
              {/* 이미지 위 그라데이션 오버레이 */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            </>
          ) : (
            /* 기본 이미지 - 그라데이션 배경 */
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-orange-50 via-amber-50/80 to-orange-100">
              <div className={`rounded-2xl bg-white/70 shadow-sm backdrop-blur-sm ${isFeatured ? 'p-6' : 'p-4'}`}>
                <FiFileText className={`text-orange-300 ${isFeatured ? 'h-12 w-12' : 'h-8 w-8 sm:h-10 sm:w-10'}`} />
              </div>
            </div>
          )}

          {/* 배지 영역 - 썸네일 위 */}
          <div className={`absolute flex flex-wrap gap-1.5 ${isFeatured ? 'top-4 left-4 gap-2' : 'top-2 left-2 sm:top-3 sm:left-3 sm:gap-2'}`}>
            {post.pinned && (
              <span className={`inline-flex items-center gap-1 rounded-full bg-white/95 font-semibold text-orange-600 shadow-sm backdrop-blur-md ${
                isFeatured ? 'px-3 py-1.5 text-sm' : 'px-2 py-0.5 text-[10px] sm:px-2.5 sm:py-1 sm:text-xs'
              }`}>
                <FiMapPin className={isFeatured ? 'h-4 w-4' : 'h-2.5 w-2.5 sm:h-3 sm:w-3'} />
                공지
              </span>
            )}
            {isPopular && !post.pinned && (
              <span className={`inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 font-semibold text-white shadow-sm ${
                isFeatured ? 'px-3 py-1.5 text-sm' : 'px-2 py-0.5 text-[10px] sm:px-2.5 sm:py-1 sm:text-xs'
              }`}>
                <FiTrendingUp className={isFeatured ? 'h-4 w-4' : 'h-2.5 w-2.5 sm:h-3 sm:w-3'} />
                인기
              </span>
            )}
            <span className={`rounded-full bg-gradient-to-r from-orange-500 to-amber-500 font-medium text-white shadow-sm ${
              isFeatured ? 'px-3 py-1.5 text-sm' : 'px-2 py-0.5 text-[10px] sm:px-2.5 sm:py-1 sm:text-xs'
            }`}>
              {post.categoryName}
            </span>
            {/* 부트캠프 수강일기 주차 정보 */}
            {post.categoryName === BOOTCAMP_DIARY_CATEGORY_NAME && post.tags.length > 0 && post.tags[0].match(/^\d+월 \d+주차$/) && (
              <span className={`rounded-full bg-white/95 font-medium text-gray-700 shadow-sm backdrop-blur-md ${
                isFeatured ? 'px-3 py-1.5 text-sm' : 'px-2 py-0.5 text-[10px] sm:px-2.5 sm:py-1 sm:text-xs'
              }`}>
                {post.tags[0]}
              </span>
            )}
          </div>
        </div>

        {/* 컨텐츠 영역 */}
        <div className={`relative flex flex-col ${isFeatured ? 'p-5 sm:p-6' : 'p-3 sm:p-4'}`}>
          <h3 className={`font-bold text-gray-900 transition-colors duration-200 group-hover:text-orange-600 ${
            isFeatured
              ? 'line-clamp-2 text-lg leading-snug sm:text-xl lg:text-2xl'
              : 'line-clamp-2 min-h-[2.5rem] text-[13px] leading-snug sm:min-h-[3rem] sm:text-[15px] sm:leading-relaxed'
          }`}>
            {post.title}
          </h3>

          {/* 태그 영역 (주차 정보 태그는 카테고리 옆에 표시하므로 제외) */}
          {post.categoryName === BOOTCAMP_DIARY_CATEGORY_NAME && post.tags.filter(tag => !tag.match(/^\d+월 \d+주차$/)).length > 0 ? (
            <div className={`flex gap-1.5 overflow-hidden ${isFeatured ? 'mt-4 h-7' : 'mt-2 h-5 sm:mt-3 sm:h-6'}`}>
              {post.tags
                .filter(tag => !tag.match(/^\d+월 \d+주차$/))
                .slice(0, isFeatured ? 4 : 2)
                .map(tag => (
                  <ClickableTag key={tag} tag={tag} maxLength={isFeatured ? 12 : 8} />
                ))}
            </div>
          ) : (
            <div className={isFeatured ? 'mt-4 h-7' : 'mt-2 h-5 sm:mt-3 sm:h-6'} />
          )}

          {/* 구분선 */}
          <div className={`h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent ${isFeatured ? 'my-4' : 'my-2.5 sm:my-3'}`} />

          {/* 푸터 영역 */}
          <div className={`flex items-center justify-between ${isFeatured ? 'text-sm' : 'text-[11px] sm:text-[13px]'}`}>
            <div className="flex items-center gap-2 sm:gap-3">
              {isFeatured && (
                <UserAvatar nickname={post.authorNickname} size="sm" />
              )}
              <div className="flex items-center gap-1 sm:gap-1.5">
                <span className={`font-medium text-gray-700 ${isFeatured ? '' : 'max-w-[70px] truncate sm:max-w-[100px]'}`}>
                  {post.authorNickname ?? '익명'}
                </span>
                <span className="h-1 w-1 rounded-full bg-gray-300" />
                <span className="text-gray-500" title={post.createdAt.toLocaleString('ko-KR')}>
                  {relativeTime}
                </span>
              </div>
            </div>

            <div className={`flex items-center text-gray-500 ${isFeatured ? 'gap-4' : 'gap-2 sm:gap-3'}`}>
              {isFeatured && (
                <span className="flex items-center gap-1.5 transition-colors group-hover:text-gray-700">
                  <FiEye className="h-4 w-4" />
                  <span className="tabular-nums">{post.viewCount}</span>
                </span>
              )}
              <span className={`flex items-center transition-colors group-hover:text-rose-500 ${isFeatured ? 'gap-1.5' : 'gap-0.5 sm:gap-1'}`}>
                <FiHeart className={isFeatured ? 'h-4 w-4' : 'h-3 w-3 sm:h-3.5 sm:w-3.5'} />
                <span className="tabular-nums">{post.likeCount}</span>
              </span>
              <span className={`flex items-center transition-colors group-hover:text-blue-500 ${isFeatured ? 'gap-1.5' : 'gap-0.5 sm:gap-1'}`}>
                <FiMessageCircle className={isFeatured ? 'h-4 w-4' : 'h-3 w-3 sm:h-3.5 sm:w-3.5'} />
                <span className="tabular-nums">{post.commentCount}</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
