'use client'

import { useState, useRef, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  HeroBanner,
  SectionTitle,
  InterestCourseSection,
  FloatingInterestBar,
  ComparisonCard,
  FilterSection,
  FilterModal,
  LectureCard,
  Pagination,
  PCFilterSidebar,
  PCCartSidebar,
  PCInterestList,
  PCAIBanner,
} from '@/features/bootcamp-list'
import type { FilterValues } from '@/features/bootcamp-list'
import type { LectureSummary } from '@/features/lecture/types/lecture.type'
import { useUnifiedCart } from '@/features/cart/hooks/use-unified-cart'
import { useUnifiedAddToCart } from '@/features/cart/hooks/use-unified-add-to-cart'
import { useUnifiedRemoveFromCart } from '@/features/cart/hooks/use-unified-remove-from-cart'
import { useSearchLectureQuery } from '@/features/lecture/hooks/use-search-lecture-query'
import { mapLectureResponseToSummary } from '@/features/lecture/utils/map-lecture-response-to-summary'
import {
  COST_QUERY_MAP,
  PROCEDURE_QUERY_MAP,
  STATUS_QUERY_MAP,
  REGION_QUERY_MAP,
  SORT_OPTIONS,
  DEFAULT_SORT,
  DEFAULT_PAGE_SIZE,
} from '@/features/lecture/types/filter.type'
import { Search, ChevronDown, Minus, Maximize2 } from 'lucide-react'

const initialFilterValues: FilterValues = {
  mainCategory: '',
  subCategory: '',
  detailCategory: '',
  mainCategoryId: null,
  subCategoryId: null,
  detailCategoryId: null,
  recruitStatus: [],
  cost: [],
  selectionProcess: [],
  region: '',
}

function BootcampListContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  // API 쿼리 - URL 파라미터 기반
  const queryString = searchParams.toString()
  const { data, isLoading: isLectureLoading } = useSearchLectureQuery(queryString)

  // API 응답 변환
  const lectures: LectureSummary[] = (data?.content ?? []).map(mapLectureResponseToSummary)
  const pageInfo = {
    currentPage: (data?.page?.number ?? 0) + 1, // 0-indexed → 1-indexed
    totalPages: data?.page?.totalPages ?? 1,
    totalElements: data?.page?.totalElements ?? 0,
  }

  // 통합 카트 훅 사용
  const { items: cartItems, isLoading: isCartLoading } = useUnifiedCart()
  const { addToCart, isPending: isAddPending } = useUnifiedAddToCart()
  const { mutate: removeFromCart } = useUnifiedRemoveFromCart()

  // 비교를 위해 선택된 항목 (카트 내에서 선택)
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  // UI 상태
  const [searchValue, setSearchValue] = useState(searchParams.get('text') ?? '')
  const [sortValue, setSortValue] = useState(searchParams.get('sort') ?? DEFAULT_SORT)
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false)
  const [filterValues, setFilterValues] = useState<FilterValues>(initialFilterValues)
  const [isInterestSectionOpen, setIsInterestSectionOpen] = useState(false)
  const [isFloatingBarOpen, setIsFloatingBarOpen] = useState(false)

  // PC 필터 사이드바 상태
  const [isPCFilterOpen, setIsPCFilterOpen] = useState(true)

  // PC AI 비교 섹션 상태 (기본: 펼쳐짐)
  const [isPCCompareSectionOpen, setIsPCCompareSectionOpen] = useState(true)

  // 메인 콘텐츠 영역 참조 (장바구니 위치 계산용)
  const mainContentRef = useRef<HTMLDivElement>(null)

  // 카트에 있는 항목인지 확인
  const isInCart = (lectureId: string) => {
    return cartItems.some(item => item.lectureId === lectureId)
  }

  // 비교 선택 토글
  const handleToggleSelect = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    )
  }

  // 카트에서 제거 시 선택 목록에서도 제거
  const handleRemoveFromCart = (lectureId: string) => {
    removeFromCart(lectureId)
    setSelectedIds(prev => prev.filter(id => id !== lectureId))
  }

  // URL 파라미터 빌드 및 네비게이션
  const buildQueryParams = () => {
    const params = new URLSearchParams()

    // 검색어
    const trimmedText = searchValue.trim()
    if (trimmedText) {
      params.append('text', trimmedText)
    }

    // 카테고리 ID (가장 하위 카테고리 우선)
    const categoryId = filterValues.detailCategoryId
      ?? filterValues.subCategoryId
      ?? filterValues.mainCategoryId
    if (categoryId) {
      params.append('categoryId', String(categoryId))
    }

    // 모집 상태 ('모집 중' → '모집중', '마감' → '마감')
    filterValues.recruitStatus.forEach(status => {
      const normalizedStatus = status === '모집 중' ? '모집중' : status
      const statusParam = STATUS_QUERY_MAP[normalizedStatus]
      if (statusParam) {
        params.append('status', statusParam)
      }
    })

    // 비용
    filterValues.cost.forEach(cost => {
      const costParam = COST_QUERY_MAP[cost]
      if (costParam) {
        params.append(costParam, 'true')
      }
    })

    // 선발 절차
    filterValues.selectionProcess.forEach(proc => {
      const procParam = PROCEDURE_QUERY_MAP[proc]
      if (procParam) {
        if (proc.includes('없음')) {
          params.append(procParam, 'false')
        } else {
          params.append(procParam, 'true')
        }
      }
    })

    // 지역
    if (filterValues.region) {
      const regionParam = REGION_QUERY_MAP[filterValues.region]
      if (regionParam) {
        params.append('location', regionParam)
      }
    }

    // 정렬
    params.append('sort', sortValue || DEFAULT_SORT)
    params.set('size', DEFAULT_PAGE_SIZE)
    params.set('page', '1')

    return params
  }

  const handleSearch = () => {
    const params = buildQueryParams()
    router.push(`/bootcamp-list?${params.toString()}`)
  }

  const handleFilterClick = () => {
    setIsFilterModalOpen(true)
  }

  const handleFilterApply = () => {
    const params = buildQueryParams()
    router.push(`/bootcamp-list?${params.toString()}`)
    setIsFilterModalOpen(false)
  }

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', String(newPage))
    params.set('size', DEFAULT_PAGE_SIZE)
    router.push(`/bootcamp-list?${params.toString()}`)
  }

  const handleAddToCart = (lecture: LectureSummary) => {
    addToCart({ lectureId: lecture.id })
  }

  const handleCompare = (lectureId: string) => {
    // 해당 강의가 카트에 없으면 추가
    if (!isInCart(lectureId)) {
      addToCart({ lectureId })
    }
    // 비교 페이지로 이동
    router.push('/cart/compare')
  }

  const handleGoToCompare = () => {
    router.push('/cart/compare')
  }

  // 선택된 카트 아이템
  const selectedCartItems = cartItems.filter(item => selectedIds.includes(item.lectureId))

  return (
    <div className="w-full min-h-screen bg-white flex flex-col items-center overflow-x-hidden">
      {/* Hero Banner */}
      <div className="w-full">
        <HeroBanner
          title="부트캠프"
          description={"원하는 분야의 부트캠프 강의를 선택해\nAI로 각 강의를 비교해보며, 최적의 강의를 선택해보세요."}
          backgroundImageUrl="/images/bootcamp-hero.jpg"
        />
      </div>

      {/* ========== MOBILE LAYOUT ========== */}
      <main className="w-full max-w-[360px] px-4 pb-[100px] flex flex-col items-center gap-6 lg:hidden bg-white">
        {/* Section Title */}
        <SectionTitle title="부트캠프" />

        {/* Interest Courses (카트 목록) */}
        <InterestCourseSection
          items={cartItems}
          selectedIds={selectedIds}
          onToggleSelect={handleToggleSelect}
          onRemove={handleRemoveFromCart}
          isOpen={isInterestSectionOpen}
          onToggleOpen={() => setIsInterestSectionOpen(prev => !prev)}
          isLoading={isCartLoading}
          closedMessage={
            <p className="text-center text-base text-[#020202] leading-relaxed">
              <span className="text-[#FEB706] font-semibold">AI 비교분석 기능</span>으로
              <br />
              최적의 강의를 한 눈에 비교해보세요.
            </p>
          }
        />

        {/* VS 비교 섹션 - 선택된 과정 2개 표시 (토글과 연동) */}
        {isInterestSectionOpen && selectedIds.length >= 2 && (
          <div className="w-full flex flex-col gap-4">
            <div className="relative flex items-center gap-4">
              <ComparisonCard
                title={cartItems.find(c => c.lectureId === selectedIds[0])?.title || ''}
                imageUrl={cartItems.find(c => c.lectureId === selectedIds[0])?.thumbnailUrl || ''}
              />

              {/* VS Badge */}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[45px] h-[45px] bg-[#020202] rounded-full flex items-center justify-center z-10">
                <span className="text-base font-bold text-[#FEB706]">VS</span>
              </div>

              <ComparisonCard
                title={cartItems.find(c => c.lectureId === selectedIds[1])?.title || ''}
                imageUrl={cartItems.find(c => c.lectureId === selectedIds[1])?.thumbnailUrl || ''}
              />
            </div>

            {/* AI 비교 분석 버튼 */}
            <button
              onClick={handleGoToCompare}
              className="w-full h-10 bg-[#F9F9F9] rounded-xl shadow-[2px_2px_10px_rgba(161,161,170,0.25)] flex items-center justify-center"
            >
              <span className="text-xs text-[#020202]">AI 비교 분석 자세히 보기</span>
            </button>
          </div>
        )}

        {/* Filter & Search */}
        <div className="w-full flex flex-col gap-6">
          <FilterSection
            searchValue={searchValue}
            onSearchChange={setSearchValue}
            onSearch={handleSearch}
            sortValue={sortValue}
            onSortChange={setSortValue}
            onFilterClick={handleFilterClick}
          />

          {/* Lecture List */}
          <div className="w-full flex flex-col gap-4">
            {isLectureLoading ? (
              <div className="py-10 text-center text-sm text-gray-500">강의 목록을 불러오는 중...</div>
            ) : lectures.length === 0 ? (
              <div className="py-10 text-center text-sm text-gray-500">검색 결과가 없습니다.</div>
            ) : (
              lectures.map((lecture) => (
                <LectureCard
                  key={lecture.id}
                  lecture={lecture}
                  isHighlighted={false}
                  isInCart={isInCart(lecture.id)}
                  onAddToCart={() => handleAddToCart(lecture)}
                  onRemoveFromCart={() => handleRemoveFromCart(lecture.id)}
                  onCompare={() => handleCompare(lecture.id)}
                  isPending={isAddPending}
                  variant="mobile"
                />
              ))
            )}
          </div>
        </div>

        {/* Pagination */}
        {pageInfo.totalPages > 1 && (
          <Pagination
            currentPage={pageInfo.currentPage}
            totalPages={pageInfo.totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </main>

      {/* ========== DESKTOP LAYOUT ========== */}
      <div className="hidden lg:block w-full">
        {/* Section Title */}
        <div className="w-full max-w-[1448px] mx-auto px-6 pt-6">
          <SectionTitle title="부트캠프" />
        </div>

        {/* Main Layout: Filter | Interest List + AI Banner + Card Grid */}
        <div ref={mainContentRef} data-main-content className="w-full max-w-[1448px] mx-auto px-6 py-6 flex gap-6">
          {/* Left: Filter Sidebar */}
          <PCFilterSidebar
            isOpen={isPCFilterOpen}
            onToggle={() => setIsPCFilterOpen(prev => !prev)}
            filterValues={filterValues}
            onFilterChange={setFilterValues}
            onApply={handleFilterApply}
            onReset={() => setFilterValues(initialFilterValues)}
          />

          {/* Center: Main Content */}
          <div className="flex-1 flex flex-col gap-6">
            {/* AI 비교 섹션 - 접기/펼치기 */}
            {isPCCompareSectionOpen ? (
              <div className="w-full rounded-xl overflow-hidden shadow-[4px_4px_20px_rgba(0,0,0,0.15)] border border-[#E5E5E5]">
                {/* 브라우저 타이틀바 */}
                <div className="h-8 bg-[#F5F5F5] border-b border-[#E5E5E5] flex items-center justify-end px-3">
                  {/* 최소화 버튼 */}
                  <button
                    onClick={() => setIsPCCompareSectionOpen(false)}
                    className="w-6 h-6 flex items-center justify-center hover:bg-[#E5E5E5] rounded transition-colors"
                    title="최소화"
                  >
                    <Minus className="w-4 h-4 text-[#666666]" />
                  </button>
                </div>

                {/* 콘텐츠 영역 */}
                <div className="p-4 bg-white flex gap-4 items-stretch">
                  {/* Interest List */}
                  <PCInterestList
                    items={cartItems}
                    selectedIds={selectedIds}
                    onToggleSelect={handleToggleSelect}
                    isFilterOpen={isPCFilterOpen}
                  />

                  {/* AI Recommendation Banner + VS */}
                  <div className="flex-1 flex">
                    <PCAIBanner selectedItems={selectedCartItems} isFilterOpen={isPCFilterOpen} />
                  </div>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setIsPCCompareSectionOpen(true)}
                className="w-full h-12 p-3 bg-[#F9F9F9] rounded-xl border border-[#D1D5DB] shadow-[4px_4px_12px_rgba(0,0,0,0.15)] flex items-center justify-center gap-2"
              >
                <Maximize2 className="w-4 h-4 text-[#020202]" />
                <span className="text-base text-[#020202]">AI 비교 분석</span>
              </button>
            )}

            {/* Search Row */}
            <div className="w-full flex items-center gap-2">
              <div className="flex-1 h-10 px-6 py-2 bg-white rounded-lg border border-[#020202] flex items-center gap-1">
                <Search className="w-4 h-4 text-[#888888]" />
                <input
                  type="text"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSearch()
                    }
                  }}
                  placeholder="검색어를 입력해주세요."
                  className="flex-1 text-xs text-[#020202] placeholder:text-[#888888] outline-none bg-transparent"
                />
              </div>
              <button
                onClick={handleSearch}
                className="w-20 h-10 px-6 py-2 bg-[#262626] rounded-lg flex items-center justify-center"
              >
                <span className="text-xs text-white">검색</span>
              </button>
              <div className="relative min-w-[213px]">
                <select
                  value={sortValue}
                  onChange={(e) => {
                    setSortValue(e.target.value)
                    // 정렬 변경 시 바로 검색 실행
                    const params = new URLSearchParams(searchParams.toString())
                    params.set('sort', e.target.value)
                    params.set('page', '1')
                    router.push(`/bootcamp-list?${params.toString()}`)
                  }}
                  className="h-10 w-full px-4 py-2 bg-white rounded-lg border border-[#020202] text-xs text-[#020202] appearance-none cursor-pointer pr-8"
                >
                  {SORT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-black absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Lecture Grid - 필터 열림: 3열, 닫힘: 4열 */}
            <div
              className={`
                w-full grid gap-6
                ${isPCFilterOpen ? 'grid-cols-3' : 'grid-cols-4'}
              `}
            >
              {isLectureLoading ? (
                <div className="col-span-full py-10 text-center text-sm text-gray-500">강의 목록을 불러오는 중...</div>
              ) : lectures.length === 0 ? (
                <div className="col-span-full py-10 text-center text-sm text-gray-500">검색 결과가 없습니다.</div>
              ) : (
                lectures.map((lecture) => (
                  <LectureCard
                    key={lecture.id}
                    lecture={lecture}
                    isHighlighted={false}
                    isInCart={isInCart(lecture.id)}
                    onAddToCart={() => handleAddToCart(lecture)}
                    onRemoveFromCart={() => handleRemoveFromCart(lecture.id)}
                    onCompare={() => handleCompare(lecture.id)}
                    isPending={isAddPending}
                    variant="desktop"
                  />
                ))
              )}
            </div>

            {/* Pagination */}
            {pageInfo.totalPages > 1 && (
              <div className="w-full flex justify-center pt-4">
                <Pagination
                  currentPage={pageInfo.currentPage}
                  totalPages={pageInfo.totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </div>

        </div>
      </div>

      {/* PC Cart Sidebar - 컴포넌트 자체에서 위치 계산 */}
      <PCCartSidebar
        items={cartItems}
        onRemove={handleRemoveFromCart}
        onCompare={handleGoToCompare}
      />

      {/* Filter Modal - Mobile only */}
      <div className="lg:hidden">
        <FilterModal
          isOpen={isFilterModalOpen}
          onClose={() => setIsFilterModalOpen(false)}
          filterValues={filterValues}
          onFilterChange={setFilterValues}
          onApply={handleFilterApply}
        />
      </div>

      {/* 하단 플로팅 관심 항목 바 - Mobile only */}
      <div className="lg:hidden">
        <FloatingInterestBar
          items={cartItems}
          onRemove={handleRemoveFromCart}
          onCompare={handleGoToCompare}
          isOpen={isFloatingBarOpen}
          onToggleOpen={() => setIsFloatingBarOpen(prev => !prev)}
        />
      </div>
    </div>
  )
}

// useSearchParams를 사용하므로 Suspense boundary 필수
export default function BootcampListPage() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center">Loading...</div>}>
      <BootcampListContent />
    </Suspense>
  )
}
