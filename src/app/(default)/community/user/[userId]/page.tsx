'use client'

import { useState } from 'react'

import Link from 'next/link'
import { useParams, notFound } from 'next/navigation'
import { FiArrowLeft, FiCalendar, FiFileText } from 'react-icons/fi'

import { Button } from '@/components/ui/button'
import { PostList } from '@/features/community/components/PostList'
import { useUserProfile, useUserPosts } from '@/features/community/hooks/useUserProfile'
import { DEFAULT_POST_SORT } from '@/features/community/api/postApi.types'

export default function UserProfilePage() {
  const params = useParams()
  const userId = Number(params.userId)

  const [page, setPage] = useState(0)
  const [sort] = useState(DEFAULT_POST_SORT)

  const { data: profile, isLoading: profileLoading, error: profileError } = useUserProfile(userId)
  const { data: postsData, isLoading: postsLoading } = useUserPosts(userId, { page, size: 10, sort })

  if (profileError) {
    notFound()
  }

  const pageInfo = postsData?.page
  const totalPages = pageInfo?.totalPages ?? 1

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date)
  }

  return (
    <div className="custom-container mx-auto max-w-4xl py-8">
      {/* 뒤로가기 */}
      <Link
        href="/community"
        className="mb-6 inline-flex items-center gap-2 text-sm text-gray-500 transition-colors hover:text-gray-700"
      >
        <FiArrowLeft className="h-4 w-4" />
        커뮤니티로 돌아가기
      </Link>

      {/* 프로필 헤더 */}
      <div className="mb-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        {profileLoading ? (
          <div className="animate-pulse space-y-4">
            <div className="h-8 w-40 rounded bg-gray-200" />
            <div className="flex gap-6">
              <div className="h-4 w-32 rounded bg-gray-200" />
              <div className="h-4 w-24 rounded bg-gray-200" />
            </div>
          </div>
        ) : profile ? (
          <div>
            <h1 className="mb-4 text-2xl font-bold text-gray-900">{profile.nickname}</h1>
            <div className="flex flex-wrap gap-6 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <FiCalendar className="h-4 w-4" />
                <span>가입일: {formatDate(profile.joinedAt)}</span>
              </div>
              <div className="flex items-center gap-2">
                <FiFileText className="h-4 w-4" />
                <span>작성 글: {profile.postCount}개</span>
              </div>
            </div>
          </div>
        ) : null}
      </div>

      {/* 작성 게시글 */}
      <div>
        <h2 className="mb-4 text-lg font-semibold text-gray-900">작성한 게시글</h2>

        <PostList posts={postsData?.posts ?? []} isLoading={postsLoading} />

        {/* 페이지네이션 */}
        {totalPages > 1 && (
          <div className="mt-6 flex justify-center gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(0)}
              disabled={page === 0}
              className="h-9 w-9"
            >
              «
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(p => Math.max(0, p - 1))}
              disabled={page === 0}
              className="h-9 w-9"
            >
              ‹
            </Button>

            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum = i
              if (totalPages > 5) {
                const start = Math.max(0, Math.min(page - 2, totalPages - 5))
                pageNum = start + i
              }
              return (
                <Button
                  key={pageNum}
                  variant={pageNum === page ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setPage(pageNum)}
                  className={`h-9 w-9 ${
                    pageNum === page
                      ? 'bg-gray-700 text-white hover:bg-gray-600'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {pageNum + 1}
                </Button>
              )
            })}

            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1}
              className="h-9 w-9"
            >
              ›
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(totalPages - 1)}
              disabled={page >= totalPages - 1}
              className="h-9 w-9"
            >
              »
            </Button>
          </div>
        )}

        {/* 게시글 없음 */}
        {!postsLoading && postsData?.posts.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-gray-50/50 py-16">
            <p className="text-lg font-medium text-gray-500">작성한 게시글이 없습니다</p>
          </div>
        )}
      </div>
    </div>
  )
}
