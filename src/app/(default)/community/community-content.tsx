'use client'

import { Suspense, useState } from 'react'

import { useRouter, useSearchParams } from 'next/navigation'
import { FiEdit3, FiFilter, FiX, FiChevronLeft, FiChevronRight, FiUser, FiMoreHorizontal } from 'react-icons/fi'
import { toast } from 'sonner'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { POST_SORT_OPTIONS, DEFAULT_POST_SORT } from '@/features/community/api/post-api.types'
import { LectureSearchModal, type SelectedLecture } from '@/features/community/components/lecture-search-modal'
import { PostList } from '@/features/community/components/post-list'
import { SearchBar } from '@/features/community/components/search-bar'
import { useBoardCategories } from '@/features/community/hooks/use-board-categories'
import { usePosts } from '@/features/community/hooks/use-posts'
import { useCurrentMemberQuery } from '@/features/mypage/hooks/use-current-member-query'
import { useAuthStore } from '@/store/auth-store'

const POSTS_PER_PAGE = 10

function CommunityContentInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const categoryIdParam = searchParams.get('categoryId')
  const keywordParam = searchParams.get('keyword') ?? ''
  const tagsParams = searchParams.getAll('tags')
  const selectedCategoryId = categoryIdParam ? Number(categoryIdParam) : null
  const selectedTags = tagsParams.length > 0 ? tagsParams : undefined

  const [page, setPage] = useState(0)
  const [sort, setSort] = useState(DEFAULT_POST_SORT)
  const [isLectureModalOpen, setIsLectureModalOpen] = useState(false)
  const [selectedLecture, setSelectedLecture] = useState<SelectedLecture | null>(null)

  const { isLoggedIn } = useAuthStore()
  const { data: currentMember } = useCurrentMemberQuery()

  // 글쓰기 버튼 클릭 핸들러
  const handleWriteClick = () => {
    if (!isLoggedIn) {
      toast.info('로그인이 필요합니다', {
        description: '글을 작성하려면 먼저 로그인해주세요.',
        action: {
          label: '로그인',
          onClick: () => router.push('/login?returnUrl=/community/write'),
        },
      })
      return
    }
    router.push('/community/write')
  }

  const { data: _categories = [], isLoading: isCategoriesLoading } = useBoardCategories()
  const { data, isLoading: isPostsLoading } = usePosts({
    categoryId: selectedCategoryId ?? undefined,
    keyword: selectedLecture ? selectedLecture.name : keywordParam || undefined,
    tags: selectedTags,
    page,
    size: POSTS_PER_PAGE,
    sort,
  })
  const isLoading = isCategoriesLoading || isPostsLoading

  // 강의 선택 핸들러
  const handleLectureSelect = (lecture: SelectedLecture) => {
    setSelectedLecture(lecture)
    setPage(0)
  }

  // 강의 필터 초기화
  const handleClearLectureFilter = () => {
    setSelectedLecture(null)
    setPage(0)
  }

  const _handleCategorySelect = (categoryId: number | null) => {
    setPage(0) // 카테고리 변경 시 첫 페이지로

    const params = new URLSearchParams()
    if (categoryId !== null) {
      params.set('categoryId', categoryId.toString())
    }
    if (keywordParam) {
      params.set('keyword', keywordParam)
    }
    tagsParams.forEach(tag => {
      params.append('tags', tag)
    })
    const queryString = params.toString()
    router.push(queryString ? `/community?${queryString}` : '/community')
  }

  const handleSearch = (keyword: string) => {
    setPage(0) // 검색 시 첫 페이지로

    const params = new URLSearchParams()
    if (selectedCategoryId !== null) {
      params.set('categoryId', selectedCategoryId.toString())
    }
    if (keyword) {
      params.set('keyword', keyword)
    }
    tagsParams.forEach(tag => {
      params.append('tags', tag)
    })
    const queryString = params.toString()
    router.push(queryString ? `/community?${queryString}` : '/community')
  }

  // 태그 변경 핸들러
  const handleTagsChange = (tags: string[], keywordOnly?: string) => {
    const params = new URLSearchParams()
    if (selectedCategoryId !== null) {
      params.set('categoryId', selectedCategoryId.toString())
    }
    // keywordOnly가 제공되면 사용, 아니면 기존 keywordParam 유지
    const keyword = keywordOnly !== undefined ? keywordOnly : keywordParam
    if (keyword) {
      params.set('keyword', keyword)
    }
    tags.forEach(tag => {
      params.append('tags', tag)
    })
    const queryString = params.toString()
    router.push(queryString ? `/community?${queryString}` : '/community')
    setPage(0)
  }

  const pageInfo = data?.page
  const totalPages = pageInfo?.totalPages ?? 1

  return (
    <div className="custom-container mx-auto w-full max-w-[1448px]">
      {/* 1. 상단 헤더 영역 */}
      <div className="mb-6 sm:mb-8">
        <div className="flex items-start justify-between gap-3 sm:gap-4">
          <div className="min-w-0 flex-1 space-y-2 sm:space-y-3">
            <div className="bg-primary/10 inline-flex items-center gap-2 rounded-full px-2.5 py-1 sm:px-3">
              <span className="bg-primary h-1.5 w-1.5 animate-pulse rounded-full" />
              <span className="text-primary text-[11px] font-semibold sm:text-xs">커뮤니티</span>
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 md:text-3xl">
              부트캠프 <span className="text-primary">수강일기</span>
            </h1>
            <p className="max-w-md text-sm text-gray-500 md:text-base">
              매주 배운 내용과 성장 과정을 기록하고, 동료들과 함께 성장하세요
            </p>
          </div>

          {/* 데스크탑 버튼 영역 */}
          <div className="hidden shrink-0 items-center gap-2.5 md:flex">
            {currentMember && (
              <Button
                variant="outline"
                onClick={() => router.push(`/community/user/${currentMember.userId}`)}
                className="hover:border-primary/30 hover:bg-primary/5 hover:text-primary h-10 gap-2 rounded-xl border-gray-200 bg-white px-4 text-sm font-semibold text-gray-700 transition-all duration-200"
              >
                <FiUser className="h-4 w-4" />내 프로필
              </Button>
            )}
            <Button
              onClick={handleWriteClick}
              className="group bg-primary text-primary-foreground shadow-primary/30 hover:shadow-primary/40 relative h-10 gap-2 overflow-hidden rounded-xl px-5 text-sm font-bold shadow-lg transition-all duration-200 hover:shadow-xl active:scale-[0.98]"
            >
              <span className="absolute inset-0 bg-linear-to-r from-white/0 via-white/20 to-white/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <FiEdit3 className="h-4 w-4" />
              글쓰기
            </Button>
          </div>

          {/* 모바일 프로필 버튼 - 44px 최소 터치 영역 */}
          {currentMember && (
            <button
              onClick={() => router.push(`/community/user/${currentMember.userId}`)}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600 transition-all active:scale-95 md:hidden"
              aria-label="내 프로필"
            >
              <FiUser className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>

      {/* 2. 툴바 영역 */}
      <div className="mb-5 overflow-hidden rounded-2xl border border-gray-100 bg-white/90 p-3 shadow-sm ring-1 ring-gray-900/4 backdrop-blur-xl md:mb-6 md:rounded-3xl md:p-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between md:gap-4">
          {/* 검색창 - #태그 지원 */}
          <div className="w-full md:max-w-md">
            <SearchBar value={keywordParam} onChange={handleSearch} tags={tagsParams} onTagsChange={handleTagsChange} />
          </div>

          {/* 필터 및 컨트롤 */}
          <div className="scrollbar-hide flex items-center gap-2 overflow-x-auto md:gap-2.5">
            {/* 강의 필터 */}
            <Button
              variant="outline"
              size="icon-sm"
              onClick={() => setIsLectureModalOpen(true)}
              className={`h-9 shrink-0 gap-1.5 rounded-lg border px-3 text-[13px] font-medium transition-all duration-200 active:scale-95 md:h-10 md:gap-2 md:rounded-xl md:px-4 md:text-sm ${
                selectedLecture
                  ? 'border-primary/30 bg-primary/5 text-primary shadow-sm'
                  : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <FiFilter className="h-3.5 w-3.5 md:h-4 md:w-4" />
              <span className="xs:inline hidden">강의</span>
              <span>필터</span>
              {selectedLecture && (
                <span className="bg-primary text-primary-foreground flex h-4 w-4 items-center justify-center rounded-full text-[9px] font-bold sm:h-5 sm:w-5 sm:text-[10px]">
                  1
                </span>
              )}
            </Button>

            {/* 정렬 선택 */}
            <Select
              value={sort}
              onValueChange={value => {
                setSort(value)
                setPage(0)
              }}
            >
              <SelectTrigger className="h-9 w-[100px] shrink-0 rounded-lg border-gray-200 bg-white text-[13px] font-medium md:h-10 md:w-[110px] md:rounded-xl md:text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                {POST_SORT_OPTIONS.map(option => (
                  <SelectItem key={option.value} value={option.value} className="text-sm">
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* 활성화된 강의 필터 뱃지 */}
      {selectedLecture && (
        <div className="mb-5 flex flex-wrap items-center gap-2 md:mb-6 md:gap-2.5">
          <span className="text-xs font-medium text-gray-500 md:text-sm">강의 필터:</span>
          <Badge
            variant="secondary"
            className="bg-primary/5 text-primary ring-primary/20 h-7 gap-1.5 rounded-lg px-2.5 shadow-sm ring-1 sm:h-8 sm:gap-2 sm:rounded-xl sm:px-3.5"
          >
            <span className="max-w-[140px] truncate text-xs font-medium md:max-w-[180px] md:text-sm">
              {selectedLecture.name}
            </span>
            <button
              onClick={handleClearLectureFilter}
              className="hover:bg-primary/20 flex h-4 w-4 items-center justify-center rounded transition-colors sm:h-5 sm:w-5 sm:rounded-lg"
            >
              <FiX className="h-3 w-3 md:h-3.5 md:w-3.5" />
            </button>
          </Badge>
        </div>
      )}

      {/* 메인 컨텐츠 영역 */}
      <div className="flex flex-col gap-5 md:gap-6">
        {/* 게시글 목록 */}
        <main className="min-w-0 flex-1">
          {/* 목록 헤더 */}
          <div className="mb-4 flex items-center justify-between md:mb-5">
            <h2 className="flex items-center gap-2 text-base font-bold text-gray-900 md:gap-3 md:text-lg">
              전체 글
              <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-md bg-gray-100 px-2 text-xs font-semibold text-gray-600 tabular-nums md:h-7 md:min-w-7 md:rounded-lg md:px-2.5 md:text-sm">
                {data?.page?.totalElements ?? 0}
              </span>
            </h2>
          </div>

          <PostList posts={data?.posts ?? []} isLoading={isLoading} />

          {/* 페이지네이션 */}
          {totalPages > 1 && (
            <div className="mt-6 flex flex-col items-center gap-3 md:mt-8 md:gap-4">
              {/* 페이지네이션 컨테이너 - 44px 최소 터치 영역 */}
              <div className="flex items-center gap-1 rounded-2xl bg-gray-50/80 p-1 md:rounded-2xl md:p-1.5">
                {/* 이전 버튼 */}
                <button
                  onClick={() => setPage(p => Math.max(0, p - 1))}
                  disabled={page === 0}
                  className="flex h-11 w-11 items-center justify-center rounded-xl text-gray-500 transition-all hover:bg-white hover:text-gray-700 hover:shadow-sm active:scale-95 disabled:pointer-events-none disabled:opacity-40 md:h-10 md:w-10"
                  aria-label="이전 페이지"
                >
                  <FiChevronLeft className="h-5 w-5" />
                </button>

                {/* 페이지 번호 */}
                <div className="flex items-center">
                  {(() => {
                    const maxVisible = 5
                    const mobileMaxVisible = 3
                    let start = Math.max(0, page - Math.floor(maxVisible / 2))
                    const end = Math.min(totalPages - 1, start + maxVisible - 1)
                    if (end - start + 1 < maxVisible) {
                      start = Math.max(0, end - maxVisible + 1)
                    }
                    const pages = []
                    for (let i = start; i <= end; i++) {
                      pages.push(i)
                    }

                    // 첫 페이지 + ... 표시
                    const showStartEllipsis = start > 1
                    const showEndEllipsis = end < totalPages - 2

                    return (
                      <>
                        {/* 첫 페이지 (시작이 0이 아닌 경우) */}
                        {start > 0 && (
                          <>
                            <button
                              onClick={() => setPage(0)}
                              className="hidden h-10 w-10 items-center justify-center rounded-xl text-sm font-medium text-gray-600 transition-all hover:bg-white hover:shadow-sm active:scale-95 md:flex"
                            >
                              1
                            </button>
                            {showStartEllipsis && (
                              <span className="hidden items-center justify-center px-1 text-gray-400 md:flex">
                                <FiMoreHorizontal className="h-4 w-4" />
                              </span>
                            )}
                          </>
                        )}

                        {/* 페이지 번호들 - 44px 최소 터치 영역 */}
                        {pages.map(pageNum => {
                          // 모바일에서는 현재 페이지 주변 3개만 표시
                          const isMobileVisible = Math.abs(pageNum - page) <= Math.floor(mobileMaxVisible / 2)
                          return (
                            <button
                              key={pageNum}
                              onClick={() => setPage(pageNum)}
                              className={`h-11 w-11 items-center justify-center rounded-xl text-sm font-medium transition-all active:scale-95 md:h-10 md:w-10 ${
                                pageNum === page
                                  ? 'bg-primary text-primary-foreground shadow-primary/30 flex shadow-md'
                                  : `text-gray-600 hover:bg-white hover:shadow-sm ${isMobileVisible ? 'flex' : 'hidden sm:flex'}`
                              }`}
                            >
                              {pageNum + 1}
                            </button>
                          )
                        })}

                        {/* 마지막 페이지 (끝이 totalPages-1이 아닌 경우) */}
                        {end < totalPages - 1 && (
                          <>
                            {showEndEllipsis && (
                              <span className="hidden items-center justify-center px-1 text-gray-400 md:flex">
                                <FiMoreHorizontal className="h-4 w-4" />
                              </span>
                            )}
                            <button
                              onClick={() => setPage(totalPages - 1)}
                              className="hidden h-10 w-10 items-center justify-center rounded-xl text-sm font-medium text-gray-600 transition-all hover:bg-white hover:shadow-sm active:scale-95 md:flex"
                            >
                              {totalPages}
                            </button>
                          </>
                        )}
                      </>
                    )
                  })()}
                </div>

                {/* 다음 버튼 */}
                <button
                  onClick={() => setPage(p => p + 1)}
                  disabled={page >= totalPages - 1}
                  className="flex h-11 w-11 items-center justify-center rounded-xl text-gray-500 transition-all hover:bg-white hover:text-gray-700 hover:shadow-sm active:scale-95 disabled:pointer-events-none disabled:opacity-40 md:h-10 md:w-10"
                  aria-label="다음 페이지"
                >
                  <FiChevronRight className="h-5 w-5" />
                </button>
              </div>

              {/* 페이지 정보 */}
              <p className="text-xs text-gray-500 md:text-sm">
                <span className="font-semibold text-gray-700">{page + 1}</span>
                <span className="mx-1 text-gray-400">/</span>
                <span>{totalPages}</span>
                <span className="ml-1 text-gray-400">페이지</span>
              </p>
            </div>
          )}
        </main>
      </div>

      {/* 모바일 플로팅 글쓰기 버튼 */}
      <button
        onClick={handleWriteClick}
        className="group bg-primary text-primary-foreground shadow-primary/30 ring-primary/20 fixed right-4 bottom-4 z-50 flex h-14 w-14 items-center justify-center rounded-2xl shadow-xl ring-4 transition-all duration-200 active:scale-90 sm:hidden"
        aria-label="글쓰기"
      >
        <span className="absolute inset-0 rounded-2xl bg-linear-to-br from-white/20 to-transparent opacity-0 transition-opacity duration-200 group-active:opacity-100" />
        <FiEdit3 className="h-6 w-6 transition-transform duration-200 group-active:rotate-12" />
      </button>

      {/* 강의 검색 모달 */}
      <LectureSearchModal
        isOpen={isLectureModalOpen}
        onClose={() => setIsLectureModalOpen(false)}
        onSelect={handleLectureSelect}
      />
    </div>
  )
}

export default function CommunityContent() {
  return (
    <Suspense fallback={null}>
      <CommunityContentInner />
    </Suspense>
  )
}
