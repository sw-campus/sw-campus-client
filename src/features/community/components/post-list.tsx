'use client'

import { FiEdit3, FiFileText, FiSearch } from 'react-icons/fi'

import type { Post } from '../api/post-api.types'
import { PostCard } from './post-card'
import { PostListRow } from './post-list-row'

interface PostListProps {
  posts: Post[]
  isLoading?: boolean
  viewType: 'list' | 'card'
}

/**
 * 게시글 목록 컴포넌트
 * - 카드형/줄형 보기 전환 지원
 * - 세련된 스켈레톤 로딩 (staggered animation)
 * - 인터랙티브한 빈 상태 디자인
 */
export function PostList({ posts, isLoading = false, viewType }: PostListProps) {
  // 로딩 스켈레톤
  if (isLoading) {
    return (
      <div>
        {viewType === 'card' ? (
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm ring-1 ring-gray-900/[0.04] sm:rounded-[1.25rem]"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                {/* 썸네일 스켈레톤 */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-gradient-to-br from-gray-100 via-gray-50 to-gray-100 sm:aspect-[16/10]">
                  <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/80 to-transparent" />
                  {/* 데코레이티브 서클 */}
                  <div className="absolute top-1/2 left-1/2 h-12 w-12 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/40" />
                </div>
                {/* 컨텐츠 스켈레톤 */}
                <div className="space-y-2.5 p-3 sm:space-y-3 sm:p-4">
                  <div className="space-y-1.5">
                    <div className="h-4 w-full rounded-lg bg-gray-100 sm:h-5" />
                    <div className="h-4 w-2/3 rounded-lg bg-gray-100 sm:h-5" />
                  </div>
                  <div className="h-5 w-1/3 rounded-md bg-gray-100 sm:h-6" />
                  <div className="h-px bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100" />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded-full bg-gray-100 sm:h-7 sm:w-7" />
                      <div className="h-3 w-16 rounded bg-gray-100 sm:w-20" />
                    </div>
                    <div className="flex gap-2 sm:gap-2.5">
                      <div className="h-3 w-8 rounded bg-gray-100" />
                      <div className="h-3 w-8 rounded bg-gray-100" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-2 sm:space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="flex overflow-hidden rounded-xl border border-gray-100 bg-white sm:rounded-2xl"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                {/* 좌측 악센트 바 스켈레톤 */}
                <div className="w-1 shrink-0 bg-gray-200" />
                {/* 컨텐츠 스켈레톤 */}
                <div className="flex flex-1 flex-col gap-2 p-3 sm:gap-2.5 sm:p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex gap-1.5 sm:gap-2">
                      <div className="h-5 w-12 rounded-md bg-gray-100 sm:h-6 sm:w-14" />
                      <div className="h-5 w-16 rounded-md bg-gray-100 sm:h-6 sm:w-20" />
                    </div>
                    <div className="hidden gap-3 sm:flex">
                      <div className="h-4 w-10 rounded bg-gray-100" />
                      <div className="h-4 w-10 rounded bg-gray-100" />
                      <div className="h-4 w-10 rounded bg-gray-100" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <div className="h-5 w-full rounded-lg bg-gray-100" />
                    <div className="h-5 w-3/4 rounded-lg bg-gray-100 sm:hidden" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-5 w-5 rounded-full bg-gray-100 sm:h-6 sm:w-6" />
                      <div className="h-3 w-20 rounded bg-gray-100 sm:w-28" />
                    </div>
                    <div className="flex gap-2 sm:hidden">
                      <div className="h-3 w-6 rounded bg-gray-100" />
                      <div className="h-3 w-6 rounded bg-gray-100" />
                      <div className="h-3 w-6 rounded bg-gray-100" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }

  // 빈 목록
  if (posts.length === 0) {
    return (
      <div className="relative overflow-hidden rounded-2xl border border-dashed border-gray-200 bg-gradient-to-b from-gray-50/80 to-white px-6 py-16 sm:rounded-3xl sm:px-8 sm:py-20">
        {/* 배경 데코레이션 */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-24 -right-24 h-48 w-48 rounded-full bg-gradient-to-br from-orange-100/40 to-amber-100/40 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 h-48 w-48 rounded-full bg-gradient-to-br from-amber-100/30 to-orange-100/30 blur-3xl" />
        </div>

        <div className="relative flex flex-col items-center">
          {/* 아이콘 영역 */}
          <div className="relative mb-5 sm:mb-6">
            <div className="absolute -inset-3 rounded-full bg-gradient-to-br from-orange-200/50 to-amber-200/50 blur-xl" />
            <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-100 to-amber-100 shadow-lg shadow-orange-100/50 sm:h-20 sm:w-20 sm:rounded-3xl">
              <FiFileText className="h-7 w-7 text-orange-500 sm:h-9 sm:w-9" />
            </div>
            {/* 플로팅 아이콘 */}
            <div className="absolute -top-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-white shadow-md ring-1 ring-gray-100 sm:-top-2 sm:-right-2 sm:h-8 sm:w-8">
              <FiSearch className="h-3.5 w-3.5 text-gray-400 sm:h-4 sm:w-4" />
            </div>
          </div>

          {/* 텍스트 */}
          <h3 className="mb-2 text-lg font-bold text-gray-800 sm:text-xl">게시글이 없습니다</h3>
          <p className="mb-6 text-center text-sm text-gray-500 sm:text-base">
            아직 작성된 글이 없어요.
            <br className="sm:hidden" />
            <span className="hidden sm:inline"> </span>
            첫 번째 이야기를 나눠보세요!
          </p>

          {/* CTA 힌트 */}
          <div className="flex items-center gap-2 rounded-full bg-orange-50 px-4 py-2 text-sm font-medium text-orange-600 ring-1 ring-orange-100">
            <FiEdit3 className="h-4 w-4" />
            <span>글쓰기 버튼을 눌러 시작하세요</span>
          </div>
        </div>
      </div>
    )
  }

  // 고정 게시글과 일반 게시글 분리
  const pinnedPosts = posts.filter(post => post.pinned)
  const regularPosts = posts.filter(post => !post.pinned)

  return (
    <div className="w-full">
      {/* 게시글 목록 */}
      {viewType === 'card' ? (
        <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3">
          {pinnedPosts.map(post => (
            <PostCard key={post.id} post={post} />
          ))}
          {regularPosts.map(post => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="w-full space-y-2 sm:space-y-3">
          {/* 고정 게시글 */}
          {pinnedPosts.length > 0 && (
            <>
              {pinnedPosts.map(post => (
                <PostListRow key={post.id} post={post} />
              ))}
              {regularPosts.length > 0 && (
                <div className="relative my-3 sm:my-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-dashed border-gray-200" />
                  </div>
                </div>
              )}
            </>
          )}
          {/* 일반 게시글 */}
          {regularPosts.map(post => (
            <PostListRow key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  )
}
