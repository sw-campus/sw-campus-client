'use client'

import Link from 'next/link'
import { FiEdit3, FiFileText, FiSearch } from 'react-icons/fi'

import type { Post } from '../api/post-api.types'
import { PostListRow } from './post-list-row'

interface PostListProps {
  posts: Post[]
  isLoading?: boolean
}

/**
 * 게시글 목록 컴포넌트
 * - 카드형/줄형 보기 전환 지원
 * - 세련된 스켈레톤 로딩 (staggered animation)
 * - 인터랙티브한 빈 상태 디자인
 */
export function PostList({ posts, isLoading = false }: PostListProps) {
  // 로딩 스켈레톤
  if (isLoading) {
    return (
      <div className="space-y-2 md:space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="flex animate-pulse overflow-hidden rounded-xl border border-gray-100 bg-white md:rounded-2xl"
            style={{ animationDelay: `${i * 100}ms`, animationDuration: '1.5s' }}
          >
            {/* 좌측 악센트 바 스켈레톤 */}
            <div className="w-1 shrink-0 bg-gradient-to-b from-gray-200 to-gray-100" />
            {/* 컨텐츠 스켈레톤 */}
            <div className="flex flex-1 flex-col gap-2 p-3 md:gap-2.5 md:p-4">
              <div className="flex items-center justify-between">
                <div className="flex gap-1.5 md:gap-2">
                  <div className="h-5 w-12 rounded-md bg-gradient-to-r from-gray-100 to-gray-200 md:h-6 md:w-14" />
                  <div className="h-5 w-16 rounded-md bg-gradient-to-r from-gray-200 to-gray-100 md:h-6 md:w-20" />
                </div>
                <div className="hidden gap-3 md:flex">
                  <div className="h-4 w-10 rounded bg-gray-100" />
                  <div className="h-4 w-10 rounded bg-gray-100" />
                  <div className="h-4 w-10 rounded bg-gray-100" />
                </div>
              </div>
              <div className="space-y-1.5">
                <div className="h-5 w-full rounded-lg bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100" />
                <div className="h-5 w-3/4 rounded-lg bg-gradient-to-r from-gray-200 to-gray-100 md:hidden" />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-5 w-5 rounded-full bg-gradient-to-br from-gray-200 to-gray-100 md:h-6 md:w-6" />
                  <div className="h-3 w-20 rounded bg-gray-100 md:w-28" />
                </div>
                <div className="flex gap-2 md:hidden">
                  <div className="h-3 w-6 rounded bg-gray-100" />
                  <div className="h-3 w-6 rounded bg-gray-100" />
                  <div className="h-3 w-6 rounded bg-gray-100" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  // 빈 목록
  if (posts.length === 0) {
    return (
      <div className="relative overflow-hidden rounded-2xl border border-dashed border-gray-200 bg-gradient-to-b from-gray-50/80 to-white px-6 py-16 md:rounded-3xl md:px-8 md:py-20">
        {/* 배경 데코레이션 */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-24 -right-24 h-48 w-48 rounded-full bg-gradient-to-br from-orange-100/40 to-amber-100/40 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 h-48 w-48 rounded-full bg-gradient-to-br from-amber-100/30 to-orange-100/30 blur-3xl" />
        </div>

        <div className="relative flex flex-col items-center">
          {/* 아이콘 영역 */}
          <div className="relative mb-5 md:mb-6">
            <div className="absolute -inset-3 rounded-full bg-gradient-to-br from-orange-200/50 to-amber-200/50 blur-xl" />
            <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-100 to-amber-100 shadow-lg shadow-orange-100/50 md:h-20 md:w-20 md:rounded-3xl">
              <FiFileText className="h-7 w-7 text-orange-500 md:h-9 md:w-9" />
            </div>
            {/* 플로팅 아이콘 */}
            <div className="absolute -top-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-white shadow-md ring-1 ring-gray-100 md:-top-2 md:-right-2 md:h-8 md:w-8">
              <FiSearch className="h-3.5 w-3.5 text-gray-400 md:h-4 md:w-4" />
            </div>
          </div>

          {/* 텍스트 */}
          <h3 className="mb-2 text-lg font-bold text-gray-800 md:text-xl">게시글이 없습니다</h3>
          <p className="mb-6 text-center text-sm text-gray-500 md:text-base">
            아직 작성된 글이 없어요.
            <br className="md:hidden" />
            <span className="hidden md:inline"> </span>
            첫 번째 이야기를 나눠보세요!
          </p>

          {/* CTA 버튼 */}
          <Link
            href="/community/write"
            className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-200/50 transition-all duration-200 hover:scale-[1.02] hover:shadow-xl hover:shadow-orange-300/60 active:scale-95"
          >
            <FiEdit3 className="h-4 w-4 transition-transform duration-200 group-hover:rotate-12" />
            <span>첫 글 작성하기</span>
          </Link>

          {/* 힌트 텍스트 */}
          <p className="mt-4 text-xs text-gray-400">
            나의 성장 이야기를 공유해보세요
          </p>
        </div>
      </div>
    )
  }

  // 고정 게시글과 일반 게시글 분리
  const pinnedPosts = posts.filter(post => post.pinned)
  const regularPosts = posts.filter(post => !post.pinned)

  return (
    <div className="w-full space-y-2 md:space-y-3">
      {/* 고정 게시글 */}
      {pinnedPosts.length > 0 && (
        <>
          {pinnedPosts.map(post => (
            <PostListRow key={post.id} post={post} />
          ))}
          {regularPosts.length > 0 && (
            <div className="relative my-3 md:my-4">
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
  )
}
