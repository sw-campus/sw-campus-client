'use client'

import { useState } from 'react'

import Link from 'next/link'
import { useParams, notFound } from 'next/navigation'
import { FiArrowLeft, FiCalendar, FiFileText, FiUser, FiChevronLeft, FiChevronRight, FiList, FiGrid } from 'react-icons/fi'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { PostList } from '@/features/community/components/PostList'
import { useUserProfile, useUserPosts } from '@/features/community/hooks/useUserProfile'
import { DEFAULT_POST_SORT } from '@/features/community/api/postApi.types'

export default function UserProfilePage() {
  const params = useParams()
  const userId = Number(params.userId)

  const [page, setPage] = useState(0)
  const [sort] = useState(DEFAULT_POST_SORT)
  // ViewType 상태 관리 (로컬 스토리지 연동) - lazy initialization으로 초기값 설정
  const [viewType, setViewType] = useState<'list' | 'card'>(() => {
    if (typeof window === 'undefined') return 'list'
    const saved = localStorage.getItem('community-post-view-type') as 'list' | 'card' | null
    return saved === 'card' || saved === 'list' ? saved : 'list'
  })

  const { data: profile, isLoading: profileLoading, error: profileError } = useUserProfile(userId)
  const { data: postsData, isLoading: postsLoading } = useUserPosts(userId, { page, size: 10, sort })
  const isLoading = profileLoading || postsLoading

  const handleViewChange = (type: 'list' | 'card') => {
    setViewType(type)
    localStorage.setItem('community-post-view-type', type)
  }

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
    <div className="custom-container mx-auto max-w-4xl py-6 sm:py-8">
      {/* 뒤로가기 */}
      <Link
        href="/community"
        className="mb-5 inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-gray-500 transition-all hover:bg-gray-100 hover:text-gray-700 active:scale-95 sm:mb-6"
      >
        <FiArrowLeft className="h-4 w-4" />
        커뮤니티로 돌아가기
      </Link>

      {/* 프로필 헤더 */}
      <div className="mb-6 overflow-hidden rounded-2xl border border-gray-200/60 bg-white shadow-sm sm:mb-8">
        {/* 상단 그라데이션 배너 */}
        <div className="h-20 bg-gradient-to-r from-orange-400 via-amber-400 to-orange-400 sm:h-24" />

        {/* 프로필 정보 */}
        <div className="relative px-5 pb-5 sm:px-6 sm:pb-6">
          {isLoading ? (
            <div className="space-y-4 pt-10">
              <div className="absolute -top-8 left-5 h-16 w-16 rounded-2xl bg-gray-200 ring-4 ring-white sm:-top-10 sm:left-6 sm:h-20 sm:w-20" />
              <div className="h-7 w-40 rounded-lg bg-gray-200" />
              <div className="flex gap-4">
                <div className="h-5 w-32 rounded bg-gray-200" />
                <div className="h-5 w-24 rounded bg-gray-200" />
              </div>
            </div>
          ) : profile ? (
            <>
              {/* 아바타 */}
              <Avatar className="absolute -top-8 left-5 h-16 w-16 rounded-2xl ring-4 ring-white sm:-top-10 sm:left-6 sm:h-20 sm:w-20">
                <AvatarFallback className="rounded-2xl bg-gradient-to-br from-orange-100 to-amber-100 text-lg font-bold text-orange-700 sm:text-xl">
                  {profile.nickname?.slice(0, 2) ?? '익명'}
                </AvatarFallback>
              </Avatar>

              <div className="pt-10 sm:pt-12">
                <h1 className="mb-3 text-xl font-bold text-gray-900 sm:mb-4 sm:text-2xl">
                  {profile.nickname}
                </h1>

                {/* 통계 배지 */}
                <div className="flex flex-wrap gap-3">
                  <div className="inline-flex items-center gap-2 rounded-xl bg-gray-50 px-3 py-2 ring-1 ring-gray-100">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-blue-100 to-indigo-100">
                      <FiCalendar className="h-3.5 w-3.5 text-blue-600" />
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-500">가입일</span>
                      <span className="ml-1.5 font-semibold text-gray-800">{formatDate(profile.joinedAt)}</span>
                    </div>
                  </div>

                  <div className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-orange-50 to-amber-50 px-3 py-2 ring-1 ring-orange-100">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-orange-100 to-amber-100">
                      <FiFileText className="h-3.5 w-3.5 text-orange-600" />
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-500">작성 글</span>
                      <span className="ml-1.5 font-bold text-orange-600">{profile.postCount}개</span>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : null}
        </div>
      </div>

      {/* 작성 게시글 */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-base font-bold text-gray-900 sm:text-lg">
            작성한 게시글
            <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-gray-100 px-2 text-xs font-semibold text-gray-600">
              {postsData?.page?.totalElements ?? 0}
            </span>
          </h2>

          {/* 뷰 타입 전환 */}
          <div className="flex shrink-0 items-center gap-0.5 rounded-xl border border-gray-200 bg-gray-50 p-0.5">
            <button
              onClick={() => handleViewChange('list')}
              className={`flex h-8 w-8 items-center justify-center rounded-lg transition-all active:scale-90 ${
                viewType === 'list' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400 hover:text-gray-600'
              }`}
              aria-label="리스트형 보기"
            >
              <FiList className="h-4 w-4" />
            </button>
            <button
              onClick={() => handleViewChange('card')}
              className={`flex h-8 w-8 items-center justify-center rounded-lg transition-all active:scale-90 ${
                viewType === 'card' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400 hover:text-gray-600'
              }`}
              aria-label="카드형 보기"
            >
              <FiGrid className="h-4 w-4" />
            </button>
          </div>
        </div>

        <PostList posts={postsData?.posts ?? []} isLoading={isLoading} viewType={viewType} />

        {/* 페이지네이션 */}
        {totalPages > 1 && (
          <div className="mt-8 flex flex-col items-center gap-4">
            <div className="flex items-center gap-1">
              {/* 이전 */}
              <button
                onClick={() => setPage(p => Math.max(0, p - 1))}
                disabled={page === 0}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600 transition-all hover:bg-gray-50 active:scale-95 disabled:opacity-40 disabled:hover:bg-white sm:h-9 sm:w-9"
                aria-label="이전 페이지"
              >
                <FiChevronLeft className="h-5 w-5 sm:h-4 sm:w-4" />
              </button>

              {/* 페이지 번호 */}
              <div className="flex items-center gap-1 px-1">
                {(() => {
                  const maxVisible = 5
                  let start = Math.max(0, page - Math.floor(maxVisible / 2))
                  const end = Math.min(totalPages - 1, start + maxVisible - 1)
                  if (end - start + 1 < maxVisible) {
                    start = Math.max(0, end - maxVisible + 1)
                  }
                  const pages = []
                  for (let i = start; i <= end; i++) {
                    pages.push(i)
                  }
                  return pages.map(pageNum => (
                    <button
                      key={pageNum}
                      onClick={() => setPage(pageNum)}
                      className={`flex h-10 w-10 items-center justify-center rounded-xl text-sm font-medium transition-all active:scale-95 sm:h-9 sm:w-9 ${
                        pageNum === page
                          ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-200/50'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {pageNum + 1}
                    </button>
                  ))
                })()}
              </div>

              {/* 다음 */}
              <button
                onClick={() => setPage(p => p + 1)}
                disabled={page >= totalPages - 1}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600 transition-all hover:bg-gray-50 active:scale-95 disabled:opacity-40 disabled:hover:bg-white sm:h-9 sm:w-9"
                aria-label="다음 페이지"
              >
                <FiChevronRight className="h-5 w-5 sm:h-4 sm:w-4" />
              </button>
            </div>

            {/* 페이지 정보 */}
            <p className="text-sm text-gray-500">
              <span className="font-medium text-gray-700">{page + 1}</span>
              <span className="mx-1">/</span>
              <span>{totalPages}</span>
              <span className="ml-1">페이지</span>
            </p>
          </div>
        )}

        {/* 게시글 없음 */}
        {!isLoading && postsData?.posts.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-gradient-to-b from-gray-50/50 to-white py-16">
            <div className="mb-4 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-50 p-4">
              <FiUser className="h-8 w-8 text-gray-300" />
            </div>
            <p className="text-lg font-semibold text-gray-700">작성한 게시글이 없습니다</p>
            <p className="mt-1.5 text-sm text-gray-500">아직 게시글을 작성하지 않았어요</p>
          </div>
        )}
      </div>
    </div>
  )
}
