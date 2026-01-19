'use client'

import { FiFileText } from 'react-icons/fi'

import type { Post } from '../api/postApi.types'
import { PostCard } from './PostCard'
import { PostListRow } from './PostListRow'

interface PostListProps {
  posts: Post[]
  isLoading?: boolean
  viewType: 'list' | 'card'
}

/**
 * 게시글 목록 컴포넌트
 * - 카드형/줄형 보기 전환 지원
 * - 세련된 스켈레톤 로딩
 * - 모던한 빈 상태 디자인
 */
export function PostList({ posts, isLoading = false, viewType }: PostListProps) {
  // 로딩 스켈레톤
  if (isLoading) {
    return (
      <div>
        {viewType === 'card' ? (
          <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="overflow-hidden rounded-xl border border-gray-200/60 bg-white sm:rounded-2xl"
              >
                {/* 썸네일 스켈레톤 */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-gradient-to-br from-gray-100 to-gray-50 sm:aspect-[16/9]">
                  <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/60 to-transparent" />
                </div>
                {/* 컨텐츠 스켈레톤 */}
                <div className="space-y-2 p-3 sm:space-y-3 sm:p-4">
                  <div className="h-4 w-3/4 rounded-lg bg-gray-100 sm:h-5" />
                  <div className="h-3 w-1/2 rounded-lg bg-gray-100 sm:h-4" />
                  <div className="h-px bg-gradient-to-r from-transparent via-gray-100 to-transparent" />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      <div className="h-5 w-5 rounded-full bg-gray-100 sm:h-7 sm:w-7" />
                      <div className="h-2.5 w-14 rounded bg-gray-100 sm:h-3 sm:w-20" />
                    </div>
                    <div className="flex gap-2 sm:gap-3">
                      <div className="h-2.5 w-6 rounded bg-gray-100 sm:h-3 sm:w-8" />
                      <div className="h-2.5 w-6 rounded bg-gray-100 sm:h-3 sm:w-8" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="flex gap-4 rounded-2xl border border-gray-200/60 bg-white p-5 sm:gap-5"
              >
                {/* 썸네일 스켈레톤 */}
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-gradient-to-br from-gray-100 to-gray-50 sm:h-[88px] sm:w-32">
                  <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/60 to-transparent" />
                </div>
                {/* 컨텐츠 스켈레톤 */}
                <div className="flex flex-1 flex-col justify-between py-0.5">
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <div className="h-5 w-16 rounded-md bg-gray-100" />
                      <div className="h-5 w-12 rounded-md bg-gray-100" />
                    </div>
                    <div className="h-5 w-4/5 rounded-lg bg-gray-100" />
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-16 rounded bg-gray-100" />
                      <div className="h-1 w-1 rounded-full bg-gray-200" />
                      <div className="h-3 w-12 rounded bg-gray-100" />
                    </div>
                    <div className="flex gap-4">
                      <div className="h-3 w-8 rounded bg-gray-100" />
                      <div className="h-3 w-8 rounded bg-gray-100" />
                      <div className="h-3 w-8 rounded bg-gray-100" />
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
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-gradient-to-b from-gray-50/50 to-white py-20">
        <div className="mb-4 rounded-2xl bg-gradient-to-br from-orange-100 to-amber-100 p-4">
          <FiFileText className="h-8 w-8 text-orange-400" />
        </div>
        <p className="text-lg font-semibold text-gray-700">게시글이 없습니다</p>
        <p className="mt-1.5 text-sm text-gray-500">첫 번째 게시글을 작성해보세요!</p>
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
        <div className="w-full space-y-4">
          {/* 고정 게시글 */}
          {pinnedPosts.length > 0 && (
            <>
              {pinnedPosts.map(post => (
                <PostListRow key={post.id} post={post} />
              ))}
              {regularPosts.length > 0 && (
                <div className="relative my-6">
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
