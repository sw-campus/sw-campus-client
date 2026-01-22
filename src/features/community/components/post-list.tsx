'use client'

import { FiPenTool, FiTrendingUp } from 'react-icons/fi'

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
 * - 균일한 그리드 레이아웃 (카드형)
 * - 카드형/줄형 보기 전환 지원
 * - 스켈레톤 로딩
 * - 빈 상태 디자인
 */
export function PostList({ posts, isLoading = false, viewType }: PostListProps) {
  // 로딩 스켈레톤
  if (isLoading) {
    return (
      <div>
        {viewType === 'card' ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="flex flex-col overflow-hidden rounded-2xl border border-gray-200/40 bg-white shadow-sm"
              >
                {/* 썸네일 스켈레톤 */}
                <div className="relative aspect-[16/10] w-full bg-gradient-to-br from-gray-100 to-gray-50">
                  <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/60 to-transparent" />
                </div>
                <div className="flex flex-1 flex-col p-4">
                  <div className="mb-2 flex gap-2">
                    <div className="h-5 w-16 rounded-md bg-gray-100" />
                    <div className="h-5 w-12 rounded-md bg-gray-100" />
                  </div>
                  <div className="mb-2 h-5 w-full rounded-lg bg-gray-100" />
                  <div className="mb-4 h-5 w-3/4 rounded-lg bg-gray-100" />
                  <div className="mt-auto flex items-center justify-between pt-3">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-16 rounded bg-gray-100" />
                      <div className="h-3 w-10 rounded bg-gray-100" />
                    </div>
                    <div className="flex gap-3">
                      <div className="h-3 w-8 rounded bg-gray-100" />
                      <div className="h-3 w-8 rounded bg-gray-100" />
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
                className="flex gap-4 rounded-2xl border border-gray-200/40 bg-white p-4 shadow-sm sm:gap-5 sm:p-5"
              >
                <div className="flex flex-1 flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <div className="h-5 w-16 rounded-lg bg-gray-100" />
                      <div className="h-5 w-12 rounded-lg bg-gray-100" />
                    </div>
                    <div className="h-5 w-4/5 rounded-lg bg-gray-100" />
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded-full bg-gray-100" />
                      <div className="h-3 w-16 rounded bg-gray-100" />
                      <div className="h-1 w-1 rounded-full bg-gray-200" />
                      <div className="h-3 w-12 rounded bg-gray-100" />
                    </div>
                    <div className="flex gap-3">
                      <div className="h-3 w-8 rounded bg-gray-100" />
                      <div className="h-3 w-8 rounded bg-gray-100" />
                      <div className="h-3 w-8 rounded bg-gray-100" />
                    </div>
                  </div>
                </div>
                <div className="relative hidden h-20 w-28 shrink-0 overflow-hidden rounded-xl bg-gradient-to-br from-gray-100 to-gray-50 sm:block sm:h-24 sm:w-36">
                  <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/60 to-transparent" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }

  // 빈 목록 - 2026 트렌드: 친근하고 모던한 빈 상태
  if (posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-gray-200 bg-gradient-to-b from-gray-50/30 to-white py-24">
        <div className="relative mb-6">
          <div className="absolute -inset-4 rounded-full bg-gradient-to-br from-orange-100/50 to-amber-100/50 blur-xl" />
          <div className="relative rounded-2xl bg-gradient-to-br from-orange-100 to-amber-100 p-5 shadow-sm">
            <FiPenTool className="h-10 w-10 text-orange-500" />
          </div>
        </div>
        <h3 className="text-xl font-bold text-gray-800">아직 게시글이 없어요</h3>
        <p className="mt-2 text-center text-gray-500">
          첫 번째 이야기를 들려주세요!<br />
          <span className="text-sm">여러분의 성장 기록이 다른 분들에게 영감이 됩니다.</span>
        </p>
      </div>
    )
  }

  // 고정 게시글과 일반 게시글 분리
  const pinnedPosts = posts.filter(post => post.pinned)
  const regularPosts = posts.filter(post => !post.pinned)
  const allPosts = [...pinnedPosts, ...regularPosts]

  return (
    <div className="w-full">
      {/* 게시글 목록 */}
      {viewType === 'card' ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6">
          {allPosts.map(post => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="w-full space-y-4">
          {/* 고정 게시글 섹션 */}
          {pinnedPosts.length > 0 && (
            <>
              <div className="mb-4 flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-orange-100">
                  <FiTrendingUp className="h-3.5 w-3.5 text-orange-600" />
                </div>
                <span className="text-sm font-semibold text-gray-600">공지사항</span>
              </div>
              {pinnedPosts.map(post => (
                <PostListRow key={post.id} post={post} />
              ))}
              {regularPosts.length > 0 && (
                <div className="relative my-8">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200/60" />
                  </div>
                  <div className="relative flex justify-center">
                    <span className="bg-gray-50 px-4 text-xs font-medium text-gray-400">전체 글</span>
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
