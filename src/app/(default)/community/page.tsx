'use client'

import { Suspense, useState } from 'react'

import { useRouter, useSearchParams } from 'next/navigation'
import { FiEdit3, FiFilter, FiX, FiTag, FiList, FiGrid, FiChevronLeft, FiChevronRight } from 'react-icons/fi'
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
import { useAuthStore } from '@/store/auth-store'

function CommunityContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const categoryIdParam = searchParams.get('categoryId')
  const keywordParam = searchParams.get('keyword') ?? ''
  const tagsParam = searchParams.get('tags')
  const selectedCategoryId = categoryIdParam ? Number(categoryIdParam) : null
  const selectedTags = tagsParam ? [tagsParam] : undefined

  const [page, setPage] = useState(0)
  const [sort, setSort] = useState(DEFAULT_POST_SORT)
  const [isLectureModalOpen, setIsLectureModalOpen] = useState(false)
  const [selectedLecture, setSelectedLecture] = useState<SelectedLecture | null>(null)

  const { isLoggedIn } = useAuthStore()

  // 글쓰기 버튼 클릭 핸들러
  const handleWriteClick = () => {
    if (!isLoggedIn) {
      toast.error('로그인이 필요합니다', {
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
    size: 10,
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

  // 태그 필터 초기화
  const handleClearTagFilter = () => {
    const params = new URLSearchParams()
    if (selectedCategoryId !== null) {
      params.set('categoryId', selectedCategoryId.toString())
    }
    if (keywordParam) {
      params.set('keyword', keywordParam)
    }
    const queryString = params.toString()
    router.push(queryString ? `/community?${queryString}` : '/community')
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
    const queryString = params.toString()
    router.push(queryString ? `/community?${queryString}` : '/community')
  }

  // ViewType 상태 관리 (로컬 스토리지 연동) - lazy initialization으로 초기값 설정
  const [viewType, setViewType] = useState<'list' | 'card'>(() => {
    if (typeof window === 'undefined') return 'list'
    const saved = localStorage.getItem('community-post-view-type') as 'list' | 'card' | null
    return saved === 'card' || saved === 'list' ? saved : 'list'
  })

  const handleViewChange = (type: 'list' | 'card') => {
    setViewType(type)
    localStorage.setItem('community-post-view-type', type)
  }

  const pageInfo = data?.page
  const totalPages = pageInfo?.totalPages ?? 1

  return (
    <div className="custom-container mx-auto w-full max-w-7xl">
      {/* 1. 상단 헤더 영역 */}
      <div className="mb-5 sm:mb-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">부트캠프 수강일기</h1>
            <p className="mt-1 text-sm text-gray-500 sm:mt-2 sm:text-base">
              매주 배운 내용과 성장 과정을 기록하고 공유하세요
            </p>
          </div>

          {/* 데스크탑 글쓰기 버튼 */}
          <div className="hidden sm:block">
            <Button
              onClick={handleWriteClick}
              className="h-10 gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 px-5 text-sm font-semibold shadow-md shadow-orange-200/50 transition-all hover:shadow-lg hover:shadow-orange-300/50"
            >
              <FiEdit3 className="h-4 w-4" />
              글쓰기
            </Button>
          </div>
        </div>
      </div>

      {/* 2. 툴바 영역 */}
      <div className="mb-5 rounded-2xl border border-gray-200/60 bg-white p-3 shadow-sm sm:mb-6 sm:p-4">
        {/* 모바일: 세로 배치 / 데스크탑: 가로 배치 */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {/* 검색창 */}
          <div className="w-full sm:max-w-sm">
            <SearchBar value={keywordParam} onChange={handleSearch} placeholder="검색어를 입력하세요" />
          </div>

          {/* 필터 및 컨트롤 */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide sm:pb-0">
            {/* 강의 필터 */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsLectureModalOpen(true)}
              className={`h-10 shrink-0 gap-1.5 rounded-xl border px-3 text-sm font-medium transition-all active:scale-95 sm:h-9 sm:text-[13px] ${
                selectedLecture
                  ? 'border-orange-200 bg-gradient-to-r from-orange-50 to-amber-50 text-orange-700'
                  : 'border-gray-200 text-gray-600 hover:border-gray-300'
              }`}
            >
              <FiFilter className="h-4 w-4 sm:h-3.5 sm:w-3.5" />
              <span>강의 필터</span>
              {selectedLecture && (
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-orange-500 text-[10px] font-bold text-white">
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
              <SelectTrigger className="h-10 w-[110px] shrink-0 rounded-xl border-gray-200 bg-white text-sm sm:h-9 sm:w-[100px] sm:text-[13px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {POST_SORT_OPTIONS.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* 구분선 */}
            <div className="h-5 w-px shrink-0 bg-gray-200" />

            {/* 뷰 타입 전환 */}
            <div className="flex shrink-0 items-center gap-0.5 rounded-xl border border-gray-200 bg-gray-50 p-0.5">
              <button
                onClick={() => handleViewChange('list')}
                className={`flex h-9 w-9 items-center justify-center rounded-lg transition-all active:scale-90 sm:h-8 sm:w-8 ${
                  viewType === 'list' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400 hover:text-gray-600'
                }`}
                aria-label="리스트형 보기"
              >
                <FiList className="h-4 w-4" />
              </button>
              <button
                onClick={() => handleViewChange('card')}
                className={`flex h-9 w-9 items-center justify-center rounded-lg transition-all active:scale-90 sm:h-8 sm:w-8 ${
                  viewType === 'card' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400 hover:text-gray-600'
                }`}
                aria-label="카드형 보기"
              >
                <FiGrid className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 활성화된 필터 뱃지 영역 */}
      {(selectedLecture || tagsParam) && (
        <div className="mb-4 flex flex-wrap items-center gap-2 sm:mb-6">
          {selectedLecture && (
            <Badge
              variant="secondary"
              className="h-7 gap-1.5 rounded-full bg-gradient-to-r from-orange-50 to-amber-50 px-3 text-orange-700 ring-1 ring-orange-200"
            >
              <span className="max-w-[150px] truncate text-[13px]">강의: {selectedLecture.name}</span>
              <button
                onClick={handleClearLectureFilter}
                className="ml-0.5 flex h-4 w-4 items-center justify-center rounded-full transition-colors hover:bg-orange-200/50"
              >
                <FiX className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {tagsParam && (
            <Badge
              variant="secondary"
              className="h-7 gap-1.5 rounded-full bg-blue-50 px-3 text-blue-700 ring-1 ring-blue-200"
            >
              <FiTag className="h-3 w-3" />
              <span className="max-w-[150px] truncate text-[13px]">{tagsParam}</span>
              <button
                onClick={handleClearTagFilter}
                className="ml-0.5 flex h-4 w-4 items-center justify-center rounded-full transition-colors hover:bg-blue-200/50"
              >
                <FiX className="h-3 w-3" />
              </button>
            </Badge>
          )}
        </div>
      )}

      {/* 메인 컨텐츠 영역 */}
      <div className="flex flex-col gap-6">
        {/* 게시글 목록 */}
        <main className="min-w-0 flex-1">
          {/* 목록 헤더 */}
          <div className="mb-4 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-base font-bold text-gray-900 sm:text-lg">
              전체 글
              <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-gray-100 px-2 text-xs font-semibold text-gray-600">
                {data?.page?.totalElements ?? 0}
              </span>
            </h2>
          </div>

          <PostList posts={data?.posts ?? []} isLoading={isLoading} viewType={viewType} />

          {/* 페이지네이션 - 모바일 최적화 */}
          {totalPages > 1 && (
            <div className="mt-8 flex flex-col items-center gap-4">
              {/* 페이지네이션 버튼 */}
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

              {/* 페이지 정보 - 모바일에서 표시 */}
              <p className="text-sm text-gray-500">
                <span className="font-medium text-gray-700">{page + 1}</span>
                <span className="mx-1">/</span>
                <span>{totalPages}</span>
                <span className="ml-1">페이지</span>
              </p>
            </div>
          )}
        </main>
      </div>

      {/* 모바일 플로팅 글쓰기 버튼 */}
      <button
        onClick={handleWriteClick}
        className="fixed right-4 bottom-4 z-50 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-300/50 transition-all active:scale-90 sm:hidden"
        aria-label="글쓰기"
      >
        <FiEdit3 className="h-6 w-6" />
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

export default function CommunityPage() {
  return (
    <Suspense fallback={null}>
      <CommunityContent />
    </Suspense>
  )
}
