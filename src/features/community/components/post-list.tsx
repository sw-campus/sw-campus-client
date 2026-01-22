'use client'

import { FiFileText, FiPenTool, FiTrendingUp } from 'react-icons/fi'

import type { Post } from '../api/post-api.types'
import { PostCard } from './post-card'
import { PostListRow } from './post-list-row'

interface PostListProps {
  posts: Post[]
  isLoading?: boolean
  viewType: 'list' | 'card'
}

// 인기글 기준: 좋아요 10개 이상
const POPULAR_THRESHOLD = 10

/**
 * 게시글 목록 컴포넌트 - 2026 트렌드 적용
 * - Bento Grid 레이아웃 (카드형)
 * - 카드형/줄형 보기 전환 지원
 * - 세련된 스켈레톤 로딩
 * - 모던한 빈 상태 디자인
 */
export function PostList({ posts, isLoading = false, viewType }: PostListProps) {
  // 로딩 스켈레톤 - 2026 트렌드: Bento Grid 스켈레톤
  if (isLoading) {
    return (
      <div>
        {viewType === 'card' ? (
          <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3">
            {/* 첫 번째 카드는 크게 (Bento Grid 메인) */}
            <div className="col-span-2 overflow-hidden rounded-2xl border border-gray-200/40 bg-white shadow-sm lg:col-span-2 lg:row-span-2">
              <div className="relative aspect-[16/9] w-full overflow-hidden bg-gradient-to-br from-gray-100 to-gray-50 lg:aspect-[2/1]">
                <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/60 to-transparent" />
              </div>
              <div className="space-y-4 p-5 sm:p-6">
                <div className="flex gap-2">
                  <div className="h-6 w-16 rounded-lg bg-gray-100" />
                  <div className="h-6 w-20 rounded-lg bg-gray-100" />
                </div>
                <div className="h-7 w-4/5 rounded-lg bg-gray-100" />
                <div className="h-5 w-3/5 rounded-lg bg-gray-100" />
                <div className="h-px bg-gradient-to-r from-transparent via-gray-100 to-transparent" />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-gray-100" />
                    <div className="h-4 w-24 rounded bg-gray-100" />
                  </div>
                  <div className="flex gap-4">
                    <div className="h-4 w-10 rounded bg-gray-100" />
                    <div className="h-4 w-10 rounded bg-gray-100" />
                  </div>
                </div>
              </div>
            </div>
            {/* 나머지 카드들 */}
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="overflow-hidden rounded-2xl border border-gray-200/40 bg-white shadow-sm"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-gradient-to-br from-gray-100 to-gray-50 sm:aspect-[16/10]">
                  <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/60 to-transparent" />
                </div>
                <div className="space-y-3 p-4 sm:p-5">
                  <div className="h-5 w-3/4 rounded-lg bg-gray-100" />
                  <div className="h-4 w-1/2 rounded-lg bg-gray-100" />
                  <div className="h-px bg-gradient-to-r from-transparent via-gray-100 to-transparent" />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-7 w-7 rounded-full bg-gray-100" />
                      <div className="h-3 w-16 rounded bg-gray-100" />
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
                className="flex gap-4 rounded-2xl border border-gray-200/40 bg-white p-5 shadow-sm sm:gap-6"
              >
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-gradient-to-br from-gray-100 to-gray-50 sm:h-[100px] sm:w-36">
                  <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/60 to-transparent" />
                </div>
                <div className="flex flex-1 flex-col justify-between py-0.5">
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <div className="h-5 w-16 rounded-lg bg-gray-100" />
                      <div className="h-5 w-12 rounded-lg bg-gray-100" />
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

  // 카드형 보기에서 Bento Grid를 위한 하이라이트 게시글 선택
  // 우선순위: 1) 고정 게시글, 2) 인기글(좋아요 10+), 3) 첫 번째 게시글
  const getHighlightPost = () => {
    if (pinnedPosts.length > 0) return pinnedPosts[0]
    const popularPost = regularPosts.find(post => post.likeCount >= POPULAR_THRESHOLD)
    if (popularPost) return popularPost
    return regularPosts[0] || null
  }

  const highlightPost = viewType === 'card' ? getHighlightPost() : null
  const remainingPosts = highlightPost
    ? [...pinnedPosts, ...regularPosts].filter(post => post.id !== highlightPost.id)
    : [...pinnedPosts, ...regularPosts]

  return (
    <div className="w-full">
      {/* 게시글 목록 */}
      {viewType === 'card' ? (
        <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3">
          {/* Bento Grid: 첫 번째 하이라이트 카드 (크게) */}
          {highlightPost && (
            <div className="col-span-2 lg:col-span-2 lg:row-span-2">
              <PostCard post={highlightPost} variant="featured" />
            </div>
          )}
          {/* 나머지 카드들 */}
          {remainingPosts.map(post => (
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
