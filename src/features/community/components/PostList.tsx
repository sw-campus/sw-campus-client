'use client'

import { useState, useEffect } from 'react'

import { FiGrid, FiList } from 'react-icons/fi'

import type { Post } from '../api/postApi.types'
import { PostCard } from './PostCard'
import { PostListRow } from './PostListRow'

type ViewType = 'list' | 'card'

const VIEW_STORAGE_KEY = 'community-post-view-type'

interface PostListProps {
  posts: Post[]
  isLoading?: boolean
}

/**
 * 게시글 목록 컴포넌트
 * - 카드형/줄형 보기 전환 지원
 * - 기본값: 줄형 (list)
 */
export function PostList({ posts, isLoading = false }: PostListProps) {
  const [viewType, setViewType] = useState<ViewType>('list')
  const [isHydrated, setIsHydrated] = useState(false)

  // localStorage에서 저장된 보기 타입 불러오기
  useEffect(() => {
    const saved = localStorage.getItem(VIEW_STORAGE_KEY) as ViewType | null
    if (saved === 'card' || saved === 'list') {
      setViewType(saved)
    }
    setIsHydrated(true)
  }, [])

  // 보기 타입 변경 시 localStorage에 저장
  const handleViewChange = (type: ViewType) => {
    setViewType(type)
    localStorage.setItem(VIEW_STORAGE_KEY, type)
  }

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

  return (
    <div className="w-full">
      {/* 보기 전환 버튼 */}
      {isHydrated && (
        <div className="mb-4 flex justify-end">
          <div className="inline-flex rounded-lg border border-gray-200 bg-white p-1 shadow-sm">
            <button
              onClick={() => handleViewChange('list')}
              className={`flex items-center justify-center rounded-md p-2 transition-colors ${
                viewType === 'list' ? 'bg-orange-500 text-white' : 'text-gray-600 hover:bg-gray-100'
              }`}
              title="줄형 보기"
            >
              <FiList className="h-4 w-4" />
            </button>
            <button
              onClick={() => handleViewChange('card')}
              className={`flex items-center justify-center rounded-md p-2 transition-colors ${
                viewType === 'card' ? 'bg-orange-500 text-white' : 'text-gray-600 hover:bg-gray-100'
              }`}
              title="카드형 보기"
            >
              <FiGrid className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* 게시글 목록 */}
      {viewType === 'card' ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map(post => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="w-full space-y-3">
          {posts.map(post => (
            <PostListRow key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  )
}
