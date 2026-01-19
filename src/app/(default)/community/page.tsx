'use client'

import { useState, useMemo, useEffect } from 'react'

import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { FiEdit3, FiFilter, FiX, FiTag, FiList, FiGrid } from 'react-icons/fi'

import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { POST_SORT_OPTIONS, DEFAULT_POST_SORT } from '@/features/community/api/postApi.types'
import { CategorySidebar } from '@/features/community/components/CategorySidebar'
import { LectureSearchModal, type SelectedLecture } from '@/features/community/components/LectureSearchModal'
import { PostList } from '@/features/community/components/PostList'
import { SearchBar } from '@/features/community/components/SearchBar'
import { useBoardCategories } from '@/features/community/hooks/useBoardCategories'
import { usePosts } from '@/features/community/hooks/usePosts'
import { useAuthStore } from '@/store/authStore'

export default function CommunityPage() {
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
  const { data: categories = [] } = useBoardCategories()
  const { data, isLoading } = usePosts({
    categoryId: selectedCategoryId ?? undefined,
    keyword: selectedLecture ? selectedLecture.name : keywordParam || undefined,
    tags: selectedTags,
    page,
    size: 12,
    sort,
  })

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

  const handleCategorySelect = (categoryId: number | null) => {
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

  // ViewType 상태 관리 (로컬 스토리지 연동)
  const [viewType, setViewType] = useState<'list' | 'card'>('list')

  useEffect(() => {
    const saved = localStorage.getItem('community-post-view-type') as 'list' | 'card' | null
    if (saved === 'card' || saved === 'list') {
      setViewType(saved)
    }
  }, [])

  const handleViewChange = (type: 'list' | 'card') => {
    setViewType(type)
    localStorage.setItem('community-post-view-type', type)
  }

  // 선택된 카테고리 이름 찾기 - useMemo 사용
  const selectedCategoryName = useMemo(() => {
    if (selectedCategoryId === null) return '전체 게시글'
    for (const parent of categories) {
      if (parent.id === selectedCategoryId) return parent.name
      for (const child of parent.children) {
        if (child.id === selectedCategoryId) return child.name
      }
    }
    return '전체 게시글'
  }, [categories, selectedCategoryId])

  const pageInfo = data?.page
  const totalPages = pageInfo?.totalPages ?? 1

  return (
    <div className="custom-container mx-auto w-full max-w-7xl">
      {/* 1. 상단 헤더 영역 (제목 + 글쓰기 버튼) */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">커뮤니티</h1>
          <p className="mt-2 text-sm text-gray-500 sm:text-base">SW 캠퍼스 커뮤니티에서 자유롭게 소통하세요</p>
        </div>

        {/* 데스크탑 글쓰기 버튼 */}
        {isLoggedIn && (
          <div className="hidden sm:block">
            <Link href="/community/write">
              <Button className="h-10 gap-2 bg-orange-600 px-5 text-sm font-semibold shadow-sm hover:bg-orange-700 hover:shadow">
                <FiEdit3 className="h-4 w-4" />
                글쓰기
              </Button>
            </Link>
          </div>
        )}
      </div>

      {/* 2. 툴바 영역 (검색 + 필터 + 뷰 전환) */}
      <div className="mb-8 flex flex-col gap-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        {/* 검색창 */}
        <div className="w-full sm:max-w-md">
          <SearchBar value={keywordParam} onChange={handleSearch} placeholder="관심있는 내용을 검색해보세요" />
        </div>

        {/* 필터 및 컨트롤 그룹 */}
        <div className="flex items-center gap-3 overflow-x-auto pb-1 sm:pb-0">
          {/* 강의 필터 */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsLectureModalOpen(true)}
            className={`h-10 shrink-0 gap-2 rounded-lg border px-3 text-sm font-medium transition-colors ${
              selectedLecture
                ? 'border-orange-200 bg-orange-50 text-orange-700 hover:border-orange-300 hover:bg-orange-100'
                : 'border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <FiFilter className="h-4 w-4" />
            <span>강의 필터</span>
            {selectedLecture && (
              <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-orange-200 text-[10px] text-orange-800">
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
            <SelectTrigger className="h-10 w-[110px] shrink-0 border-gray-200 bg-white text-sm">
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
          <div className="h-6 w-px bg-gray-200" />

          {/* 뷰 타입 전환 */}
          <div className="flex shrink-0 items-center rounded-lg border border-gray-200 bg-white p-1">
            <button
              onClick={() => handleViewChange('list')}
              className={`flex h-8 w-8 items-center justify-center rounded-md transition-all ${
                viewType === 'list' ? 'bg-gray-100 text-gray-900 shadow-sm' : 'text-gray-400 hover:text-gray-600'
              }`}
              aria-label="리스트형 보기"
            >
              <FiList className="h-4 w-4" />
            </button>
            <button
              onClick={() => handleViewChange('card')}
              className={`flex h-8 w-8 items-center justify-center rounded-md transition-all ${
                viewType === 'card' ? 'bg-gray-100 text-gray-900 shadow-sm' : 'text-gray-400 hover:text-gray-600'
              }`}
              aria-label="카드형 보기"
            >
              <FiGrid className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 활성화된 필터 뱃지 영역 */}
      {(selectedLecture || tagsParam) && (
        <div className="mb-6 flex flex-wrap items-center gap-2">
          {selectedLecture && (
            <span className="inline-flex items-center gap-1 rounded-full bg-orange-50 px-3 py-1 text-sm font-medium text-orange-700 ring-1 ring-orange-600/20 ring-inset">
              강의: {selectedLecture.name}
              <button onClick={handleClearLectureFilter} className="ml-1 rounded-full p-0.5 hover:bg-orange-200">
                <FiX className="h-3.5 w-3.5" />
              </button>
            </span>
          )}
          {tagsParam && (
            <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700 ring-1 ring-blue-700/10 ring-inset">
              <FiTag className="h-3.5 w-3.5" />
              {tagsParam}
              <button onClick={handleClearTagFilter} className="ml-1 rounded-full p-0.5 hover:bg-blue-200">
                <FiX className="h-3.5 w-3.5" />
              </button>
            </span>
          )}
        </div>
      )}

      {/* 메인 컨텐츠 영역 */}
      <div className="flex flex-col gap-8 lg:flex-row">
        {/* 사이드바 */}
        <CategorySidebar
          categories={categories}
          selectedCategoryId={selectedCategoryId}
          onSelect={handleCategorySelect}
        />

        {/* 게시글 목록 */}
        <main className="min-w-0 flex-1">
          {/* 목록 헤더 (카테고리명 + 카운트) */}
          <div className="mb-4 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-lg font-bold text-gray-900">
              {selectedCategoryName}
              <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600">
                {data?.page?.totalElements ?? 0}
              </span>
            </h2>
          </div>

          <PostList posts={data?.posts ?? []} isLoading={isLoading} viewType={viewType} />

          {/* 페이지네이션 */}
          {totalPages > 1 && (
            <div className="mt-6 flex flex-col items-center gap-3 sm:mt-8 sm:gap-4">
              {/* 페이지네이션 버튼 */}
              <div className="flex items-center gap-0.5 sm:gap-1">
                {/* 처음 */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(0)}
                  disabled={page === 0}
                  className="h-10 w-10 text-base sm:h-9 sm:w-9 sm:text-sm"
                  aria-label="첫 페이지로 이동"
                >
                  «
                </Button>
                {/* 이전 */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(p => Math.max(0, p - 1))}
                  disabled={page === 0}
                  className="h-10 w-10 text-base sm:h-9 sm:w-9 sm:text-sm"
                  aria-label="이전 페이지로 이동"
                >
                  ‹
                </Button>

                {/* 페이지 번호 - 모바일에서 3개, 데스크탑에서 5개 */}
                {(() => {
                  const maxVisible = typeof window !== 'undefined' && window.innerWidth < 640 ? 3 : 5
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
                    <Button
                      key={pageNum}
                      variant={pageNum === page ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setPage(pageNum)}
                      className={`h-10 w-10 text-base sm:h-9 sm:w-9 sm:text-sm ${
                        pageNum === page
                          ? 'bg-gray-700 text-white hover:bg-gray-600'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {pageNum + 1}
                    </Button>
                  ))
                })()}

                {/* 다음 */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(p => p + 1)}
                  disabled={page >= totalPages - 1}
                  className="h-10 w-10 text-base sm:h-9 sm:w-9 sm:text-sm"
                  aria-label="다음 페이지로 이동"
                >
                  ›
                </Button>
                {/* 마지막 */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(totalPages - 1)}
                  disabled={page >= totalPages - 1}
                  className="h-10 w-10 text-base sm:h-9 sm:w-9 sm:text-sm"
                  aria-label="마지막 페이지로 이동"
                >
                  »
                </Button>
              </div>

              {/* Go to page - 데스크탑에서만 */}
              <div className="hidden items-center gap-2 sm:flex">
                <span className="text-sm text-gray-500">Go to page:</span>
                <Select value={String(page + 1)} onValueChange={value => setPage(Number(value) - 1)}>
                  <SelectTrigger className="h-8 w-16">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: totalPages }, (_, i) => (
                      <SelectItem key={i} value={String(i + 1)}>
                        {i + 1}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* 모바일 플로팅 글쓰기 버튼 */}
      {isLoggedIn && (
        <Link
          href="/community/write"
          className="fixed right-6 bottom-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-orange-500 text-white shadow-lg transition-all hover:bg-orange-600 active:scale-95 sm:hidden"
          aria-label="글쓰기"
        >
          <FiEdit3 className="h-6 w-6" />
        </Link>
      )}

      {/* 강의 검색 모달 */}
      <LectureSearchModal
        isOpen={isLectureModalOpen}
        onClose={() => setIsLectureModalOpen(false)}
        onSelect={handleLectureSelect}
      />
    </div>
  )
}
