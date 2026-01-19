'use client'

import { useState, useEffect } from 'react'

import { FiGrid, FiList } from 'react-icons/fi'

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
 * - 기본값: 줄형 (list)
 */
export function PostList({ posts, isLoading = false, viewType }: PostListProps) {
  // 로딩 스켈레톤
  if (isLoading) {
    return (
      <div>
        {/* 보기 전환 버튼 (스켈레톤 상태에서도 표시) */}
        <div className="mb-4 flex justify-end">
          <div className="h-9 w-20 animate-pulse rounded-lg bg-gray-200" />
        </div>

        {viewType === 'card' ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="animate-pulse overflow-hidden rounded-2xl border border-gray-200 bg-white/70">
                <div className="aspect-video w-full bg-gray-200" />
                <div className="space-y-3 p-4">
                  <div className="h-4 w-20 rounded bg-gray-200" />
                  <div className="h-5 w-full rounded bg-gray-200" />
                  <div className="h-4 w-1/2 rounded bg-gray-200" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex animate-pulse gap-4 rounded-xl border border-gray-200 bg-white/70 p-4">
                <div className="hidden h-20 w-28 rounded-lg bg-gray-200 sm:block" />
                <div className="flex flex-1 flex-col justify-center space-y-2">
                  <div className="h-4 w-24 rounded bg-gray-200" />
                  <div className="h-5 w-3/4 rounded bg-gray-200" />
                  <div className="h-3 w-1/2 rounded bg-gray-200" />
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
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-gray-50/50 py-16">
        <p className="text-lg font-medium text-gray-500">게시글이 없습니다</p>
        <p className="mt-1 text-sm text-gray-400">첫 번째 게시글을 작성해보세요!</p>
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
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {pinnedPosts.map(post => (
            <PostCard key={post.id} post={post} />
          ))}
          {regularPosts.map(post => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="w-full space-y-3">
          {/* 고정 게시글 */}
          {pinnedPosts.length > 0 && (
            <>
              {pinnedPosts.map(post => (
                <PostListRow key={post.id} post={post} />
              ))}
              {regularPosts.length > 0 && <div className="my-4 border-t border-dashed border-gray-200" />}
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
