'use client'

import { Suspense, useState } from 'react'

import { useRouter, useSearchParams } from 'next/navigation'
import { FiEdit3, FiFilter, FiX, FiList, FiGrid, FiChevronLeft, FiChevronRight, FiUser } from 'react-icons/fi'
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
      <div className="mb-8 sm:mb-10">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-orange-100 to-amber-100 px-3 py-1">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-orange-500" />
              <span className="text-xs font-semibold text-orange-700">커뮤니티</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
              부트캠프 <span className="bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">수강일기</span>
            </h1>
            <p className="max-w-lg text-base text-gray-500 sm:text-lg">
              매주 배운 내용과 성장 과정을 기록하고, 동료들과 함께 성장하세요
            </p>
          </div>

          {/* 데스크탑 버튼 영역 */}
          <div className="hidden items-center gap-3 sm:flex">
            {currentMember && (
              <Button
                variant="outline"
                onClick={() => router.push(`/community/user/${currentMember.userId}`)}
                className="h-11 gap-2 rounded-2xl border-gray-200 bg-white px-5 text-sm font-semibold text-gray-700 transition-all duration-300 hover:border-orange-200 hover:bg-orange-50 hover:text-orange-600"
              >
                <FiUser className="h-4 w-4" />
                내 프로필
              </Button>
            )}
            <Button
              onClick={handleWriteClick}
              className="group relative h-11 gap-2 overflow-hidden rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 px-6 text-sm font-bold shadow-lg shadow-orange-200/60 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-orange-300/60"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <FiEdit3 className="h-4 w-4" />
              글쓰기
            </Button>
          </div>

          {/* 모바일 프로필 버튼 */}
          {currentMember && (
            <button
              onClick={() => router.push(`/community/user/${currentMember.userId}`)}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600 transition-all active:scale-95 sm:hidden"
              aria-label="내 프로필"
            >
              <FiUser className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>

      {/* 2. 툴바 영역 */}
      <div className="mb-6 overflow-hidden rounded-3xl border border-gray-200/40 bg-white/80 p-4 shadow-sm backdrop-blur-xl sm:mb-8 sm:p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          {/* 검색창 - #태그 지원 */}
          <div className="w-full sm:max-w-md">
            <SearchBar
              value={keywordParam}
              onChange={handleSearch}
              tags={tagsParams}
              onTagsChange={handleTagsChange}
            />
          </div>

          {/* 필터 및 컨트롤 */}
          <div className="flex items-center gap-3 overflow-x-auto pb-1 scrollbar-hide sm:pb-0">
            {/* 강의 필터 */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsLectureModalOpen(true)}
              className={`h-10 shrink-0 gap-2 rounded-xl border px-4 text-sm font-medium transition-all duration-200 active:scale-95 ${
                selectedLecture
                  ? 'border-orange-200 bg-gradient-to-r from-orange-50 to-amber-50 text-orange-700 shadow-sm shadow-orange-100/50'
                  : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <FiFilter className="h-4 w-4" />
              <span>강의 필터</span>
              {selectedLecture && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-orange-500 text-[10px] font-bold text-white shadow-sm">
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
              <SelectTrigger className="h-10 w-[120px] shrink-0 rounded-xl border-gray-200 bg-white text-sm font-medium">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                {POST_SORT_OPTIONS.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* 구분선 */}
            <div className="h-6 w-px shrink-0 bg-gray-200/80" />

            {/* 뷰 타입 전환 */}
            <div className="flex shrink-0 items-center gap-1 rounded-xl bg-gray-100/80 p-1">
              <button
                onClick={() => handleViewChange('list')}
                className={`flex h-8 w-8 items-center justify-center rounded-lg transition-all duration-200 active:scale-90 ${
                  viewType === 'list'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-400 hover:text-gray-600'
                }`}
                aria-label="리스트형 보기"
              >
                <FiList className="h-4 w-4" />
              </button>
              <button
                onClick={() => handleViewChange('card')}
                className={`flex h-8 w-8 items-center justify-center rounded-lg transition-all duration-200 active:scale-90 ${
                  viewType === 'card'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-400 hover:text-gray-600'
                }`}
                aria-label="카드형 보기"
              >
                <FiGrid className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 활성화된 강의 필터 뱃지 */}
      {selectedLecture && (
        <div className="mb-6 flex flex-wrap items-center gap-2.5 sm:mb-8">
          <span className="text-sm font-medium text-gray-500">강의 필터:</span>
          <Badge
            variant="secondary"
            className="h-8 gap-2 rounded-xl bg-gradient-to-r from-orange-50 to-amber-50 px-3.5 text-orange-700 shadow-sm ring-1 ring-orange-200/60"
          >
            <span className="max-w-[180px] truncate text-sm font-medium">{selectedLecture.name}</span>
            <button
              onClick={handleClearLectureFilter}
              className="flex h-5 w-5 items-center justify-center rounded-lg transition-colors hover:bg-orange-200/60"
            >
              <FiX className="h-3.5 w-3.5" />
            </button>
          </Badge>
        </div>
      )}

      {/* 메인 컨텐츠 영역 */}
      <div className="flex flex-col gap-6">
        {/* 게시글 목록 */}
        <main className="min-w-0 flex-1">
          {/* 목록 헤더 */}
          <div className="mb-6 flex items-center justify-between">
            <h2 className="flex items-center gap-3 text-lg font-bold text-gray-900 sm:text-xl">
              전체 글
              <span className="inline-flex h-7 min-w-7 items-center justify-center rounded-lg bg-gradient-to-r from-gray-100 to-gray-50 px-2.5 text-sm font-semibold tabular-nums text-gray-600">
                {data?.page?.totalElements ?? 0}
              </span>
            </h2>
          </div>

          <PostList posts={data?.posts ?? []} isLoading={isLoading} viewType={viewType} />

          {/* 페이지네이션 */}
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
        className="group fixed right-5 bottom-5 z-50 flex h-16 w-16 items-center justify-center rounded-[20px] bg-gradient-to-br from-orange-500 to-amber-500 text-white shadow-xl shadow-orange-400/40 transition-all duration-300 active:scale-90 sm:hidden"
        aria-label="글쓰기"
      >
        <span className="absolute inset-0 rounded-[20px] bg-gradient-to-br from-white/20 to-transparent opacity-0 transition-opacity duration-300 group-active:opacity-100" />
        <FiEdit3 className="h-7 w-7 transition-transform duration-300 group-active:rotate-12" />
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
