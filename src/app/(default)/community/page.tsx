'use client'

import { useState, useMemo } from 'react'

import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { FiEdit3, FiFilter, FiX } from 'react-icons/fi'

import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { CategorySidebar } from '@/features/community/components/CategorySidebar'
import { LectureSearchModal, type SelectedLecture } from '@/features/community/components/LectureSearchModal'
import { PostList } from '@/features/community/components/PostList'
import { SearchBar } from '@/features/community/components/SearchBar'
import { useBoardCategories } from '@/features/community/hooks/useBoardCategories'
import { usePosts } from '@/features/community/hooks/usePosts'
import { POST_SORT_OPTIONS, DEFAULT_POST_SORT } from '@/features/community/api/postApi.types'
import { useAuthStore } from '@/store/authStore'

export default function CommunityPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const categoryIdParam = searchParams.get('categoryId')
  const keywordParam = searchParams.get('keyword') ?? ''
  const selectedCategoryId = categoryIdParam ? Number(categoryIdParam) : null

  const [page, setPage] = useState(0)
  const [sort, setSort] = useState(DEFAULT_POST_SORT)
  const [isLectureModalOpen, setIsLectureModalOpen] = useState(false)
  const [selectedLecture, setSelectedLecture] = useState<SelectedLecture | null>(null)

  const { isLoggedIn } = useAuthStore()
  const { data: categories = [] } = useBoardCategories()
  const { data, isLoading } = usePosts({
    categoryId: selectedCategoryId ?? undefined,
    keyword: selectedLecture ? selectedLecture.name : (keywordParam || undefined),
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
    <div className="custom-container mx-auto max-w-7xl">
      {/* 헤더 */}
      <div className="mb-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">커뮤니티</h1>
            <p className="mt-1 text-gray-500">SW 캠퍼스 커뮤니티에서 자유롭게 소통하세요</p>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-36 sm:w-48">
              <SearchBar value={keywordParam} onChange={handleSearch} placeholder="검색..." />
            </div>
            {/* 정렬 */}
            <Select value={sort} onValueChange={(value) => { setSort(value); setPage(0) }}>
              <SelectTrigger className="w-24 sm:w-32 border-gray-300 bg-white">
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
            <Button
              variant="outline"
              onClick={() => setIsLectureModalOpen(true)}
              className={`gap-2 ${selectedLecture ? 'border-orange-500 bg-orange-50 text-orange-700' : ''}`}
            >
              <FiFilter className="h-4 w-4" />
              <span className="hidden sm:inline">강의</span>
            </Button>
            {isLoggedIn && (
              <Link href="/community/write">
                <Button className="gap-2 bg-orange-500 hover:bg-orange-600">
                  <FiEdit3 className="h-4 w-4" />
                  글쓰기
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* 선택된 강의 필터 표시 */}
        {selectedLecture && (
          <div className="mt-3 flex items-center gap-2">
            <span className="text-sm text-gray-500">강의 필터:</span>
            <span className="inline-flex items-center gap-1 rounded-full bg-orange-100 px-3 py-1 text-sm font-medium text-orange-700">
              {selectedLecture.name}
              <button onClick={handleClearLectureFilter} className="ml-1 hover:text-orange-900">
                <FiX className="h-3.5 w-3.5" />
              </button>
            </span>
          </div>
        )}
      </div>

      {/* 메인 컨텐츠 영역 */}
      <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
        {/* 사이드바 (데스크탑: 왼쪽, 모바일: 상단) */}
        <CategorySidebar
          categories={categories}
          selectedCategoryId={selectedCategoryId}
          onSelect={handleCategorySelect}
        />

        {/* 게시글 목록 */}
        <main className="min-w-0 flex-1">
          {/* 현재 카테고리 표시 */}
          <div className="mb-4 hidden items-center justify-between lg:flex">
            <h2 className="text-lg font-semibold text-gray-900">{selectedCategoryName}</h2>
            <span className="text-sm text-gray-500">{data?.page?.totalElements ?? 0}개의 게시글</span>
          </div>

          <PostList posts={data?.posts ?? []} isLoading={isLoading} />

          {/* 페이지네이션 */}
          {totalPages > 1 && (
            <div className="mt-8 flex flex-col items-center gap-4">
              {/* 페이지네이션 버튼 */}
              <div className="flex items-center gap-1">
                {/* 처음 */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(0)}
                  disabled={page === 0}
                  className="h-9 w-9"
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
                  className="h-9 w-9"
                  aria-label="이전 페이지로 이동"
                >
                  ‹
                </Button>

                {/* 페이지 번호 */}
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
                  ))
                })()}

                {/* 다음 */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(p => p + 1)}
                  disabled={page >= totalPages - 1}
                  className="h-9 w-9"
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
                  className="h-9 w-9"
                  aria-label="마지막 페이지로 이동"
                >
                  »
                </Button>
              </div>

              {/* Go to page */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Go to page:</span>
                <Select
                  value={String(page + 1)}
                  onValueChange={value => setPage(Number(value) - 1)}
                >
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

      {/* 강의 검색 모달 */}
      <LectureSearchModal
        isOpen={isLectureModalOpen}
        onClose={() => setIsLectureModalOpen(false)}
        onSelect={handleLectureSelect}
      />
    </div>
  )
}
