'use client'

import { Suspense, useState } from 'react'

import { useRouter, useSearchParams } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useCategoryTree } from '@/features/category'
import type { CategoryTreeNode } from '@/features/category/types/category.type'
import { LectureList } from '@/features/lecture/components/lecture-list'
import { LectureSearchSidebar } from '@/features/lecture/components/lecture-search/lecture-search-sidebar'
import { useSearchLectureQuery } from '@/features/lecture/hooks/use-search-lecture-query'
import {
  SORT_OPTIONS,
  DEFAULT_SORT,
  COST_QUERY_MAP,
  PROCEDURE_QUERY_MAP,
  REGION_QUERY_MAP,
  STATUS_QUERY_MAP,
  FilterGroupKey,
  DEFAULT_PAGE_SIZE,
} from '@/features/lecture/types/filter.type'
import { mapLectureResponseToSummary } from '@/features/lecture/utils/map-lecture-response-to-summary'
import { trackSearch } from '@/lib/analytics'

const filterSelectTriggerClass =
  'flex items-center justify-between gap-1 rounded-full border border-input bg-background px-3 py-1 text-sm font-medium text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background'

function SearchContentInner() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const queryString = searchParams.toString()
  const { data, isLoading, isError } = useSearchLectureQuery(queryString)

  const lectures = (data?.content ?? []).map(mapLectureResponseToSummary)
  const pageInfo = {
    currentPage: data?.page?.number ?? 0,
    totalPages: data?.page?.totalPages ?? 0,
    totalElements: data?.page?.totalElements ?? 0,
    size: data?.page?.size ?? 20,
    isFirst: (data?.page?.number ?? 0) === 0,
    isLast: (data?.page?.number ?? 0) >= (data?.page?.totalPages ?? 1) - 1,
  }

  const { data: categoryTree } = useCategoryTree()

  const [level1Id, setLevel1Id] = useState<number | null>(null)
  const [level2Id, setLevel2Id] = useState<number | null>(null)
  const [level3Ids, setLevel3Ids] = useState<string[]>([])

  const [selectedCost, setSelectedCost] = useState<string | null>(null)
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null)
  const [selectedSort, setSelectedSort] = useState(DEFAULT_SORT)
  const [searchTerm, setSearchTerm] = useState('')
  const [activeFilters, setActiveFilters] = useState<Record<FilterGroupKey, string[]>>({
    procedure: [],
    region: [],
  })

  // 모바일에서 필터 사이드바 토글
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  // URL 파라미터 변경 추적을 위한 상태
  const [prevCategoryParams, setPrevCategoryParams] = useState<string>('')

  const level1Categories = categoryTree ?? []

  const level2Categories = (() => {
    if (!level1Id || !categoryTree) return []
    const parent = categoryTree.find((c: CategoryTreeNode) => c.categoryId === level1Id)
    return parent?.children ?? []
  })()

  const level3Categories = (() => {
    if (!level2Id || !level2Categories.length) return []
    const parent = level2Categories.find((c: CategoryTreeNode) => c.categoryId === level2Id)
    return parent?.children ?? []
  })()

  // URL 파라미터 변경 시 카테고리 상태 동기화 (렌더링 중 조건부 업데이트)
  const currentCategoryParams = searchParams.getAll('categoryIds').join(',')
  if (categoryTree && categoryTree.length > 0 && currentCategoryParams !== prevCategoryParams) {
    setPrevCategoryParams(currentCategoryParams)

    const categoryIdsParam = searchParams.getAll('categoryIds')
    if (categoryIdsParam.length === 0) {
      setLevel1Id(null)
      setLevel2Id(null)
      setLevel3Ids([])
    } else {
      type CategoryPath = { l1: number; l2?: number; l3?: number }
      const pathMap = new Map<number, CategoryPath>()
      for (const l1 of categoryTree) {
        pathMap.set(l1.categoryId, { l1: l1.categoryId })
        if (l1.children) {
          for (const l2 of l1.children) {
            pathMap.set(l2.categoryId, { l1: l1.categoryId, l2: l2.categoryId })
            if (l2.children) {
              for (const l3 of l2.children) {
                pathMap.set(l3.categoryId, { l1: l1.categoryId, l2: l2.categoryId, l3: l3.categoryId })
              }
            }
          }
        }
      }

      let foundL1: number | null = null
      let foundL2: number | null = null
      const foundL3s: string[] = []

      categoryIdsParam.forEach(idStr => {
        const id = Number(idStr)
        if (!id) return

        const path = pathMap.get(id)
        if (path) {
          if (path.l1 && path.l1 !== foundL1) {
            foundL1 = path.l1
            foundL2 = null
          }
          if (path.l2 && path.l1 === foundL1) {
            foundL2 = path.l2
          }
          if (path.l3) foundL3s.push(String(path.l3))
        }
      })

      setLevel1Id(foundL1)
      setLevel2Id(foundL2)
      setLevel3Ids(foundL3s)
    }
  }

  const toggleFilter = (group: FilterGroupKey, label: string) => {
    setActiveFilters(prev => {
      const currentGroup = prev[group] ?? []
      const nextGroup = currentGroup.includes(label)
        ? currentGroup.filter(option => option !== label)
        : [...currentGroup, label]

      return {
        ...prev,
        [group]: nextGroup,
      }
    })
  }

  const isActive = (group: FilterGroupKey, label: string) => (activeFilters[group] ?? []).includes(label)

  const handleCostClick = (cost: string) => {
    setSelectedCost(prev => (prev === cost ? null : cost))
  }

  const handleStatusClick = (status: string) => {
    setSelectedStatus(prev => (prev === status ? null : status))
  }

  const handleSearch = () => {
    const params = new URLSearchParams()

    let finalCategoryIds: string[] = []
    if (level3Ids.length > 0) {
      finalCategoryIds = level3Ids
    } else if (level2Id) {
      finalCategoryIds = [String(level2Id)]
    } else if (level1Id) {
      finalCategoryIds = [String(level1Id)]
    }

    finalCategoryIds.forEach(id => {
      params.append('categoryIds', id)
    })

    if (selectedCost) {
      const costParam = COST_QUERY_MAP[selectedCost]
      if (costParam) {
        params.append(costParam, 'true')
      }
    }

    if (selectedStatus) {
      const statusParam = STATUS_QUERY_MAP[selectedStatus]
      if (statusParam) {
        params.append('status', statusParam)
      }
    }

    ;(activeFilters.procedure ?? []).forEach(filter => {
      const parameter = PROCEDURE_QUERY_MAP[filter]
      if (parameter) {
        if (filter.includes('없음')) {
          params.append(parameter, 'false')
        } else {
          params.append(parameter, 'true')
        }
      }
    })
    ;(activeFilters.region ?? []).forEach(region => {
      const shortRegion = REGION_QUERY_MAP[region] ?? region
      params.append('regions', shortRegion)
    })

    const trimmedText = searchTerm.trim()
    if (trimmedText) {
      params.append('text', trimmedText)
    }

    const sortValue = selectedSort || DEFAULT_SORT
    params.append('sort', sortValue)

    params.set('size', DEFAULT_PAGE_SIZE)
    params.set('page', '1')

    const queryString = params.toString()
    const destination = `/lectures/search${queryString ? `?${queryString}` : ''}`

    // GA4 검색 이벤트 추적 (인기 검색어용)
    if (trimmedText) {
      trackSearch(trimmedText)
    }

    router.push(destination)

    // 모바일에서 검색 후 필터 닫기
    setIsFilterOpen(false)
  }

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('size', DEFAULT_PAGE_SIZE)
    params.set('page', String(newPage + 1))
    router.push(`/lectures/search?${params.toString()}`)
  }

  const getPageNumbers = () => {
    const { currentPage, totalPages } = pageInfo
    const maxVisible = 5
    let start = Math.max(0, currentPage - Math.floor(maxVisible / 2))
    const end = Math.min(totalPages - 1, start + maxVisible - 1)

    if (end - start + 1 < maxVisible) {
      start = Math.max(0, end - maxVisible + 1)
    }

    const pages = []
    for (let i = start; i <= end; i++) {
      pages.push(i)
    }
    return pages
  }

  const handleLevel1Change = (value: number | null) => {
    setLevel1Id(value)
    setLevel2Id(null)
    setLevel3Ids([])
  }

  const handleLevel2Change = (value: number | null) => {
    setLevel2Id(value)
    setLevel3Ids([])
  }

  return (
    <div className="custom-container">
      <div className="flex flex-col gap-4 md:flex-row md:gap-6">
        {/* 모바일: 필터 토글 버튼 */}
        <div className="flex items-center justify-between md:hidden">
          <span className="text-sm text-gray-600">
            총 <strong className="text-primary">{pageInfo.totalElements}</strong>개의 강의
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="flex items-center gap-2"
          >
            <span>🔍</span>
            <span>{isFilterOpen ? '필터 닫기' : '필터 열기'}</span>
          </Button>
        </div>

        {/* 사이드바 - 모바일에서는 토글, 데스크탑에서는 항상 표시 */}
        <div className={`${isFilterOpen ? 'block' : 'hidden'} md:block`}>
          <LectureSearchSidebar
            level1Id={level1Id}
            level2Id={level2Id}
            level3Ids={level3Ids}
            onLevel1Change={handleLevel1Change}
            onLevel2Change={handleLevel2Change}
            onLevel3Change={setLevel3Ids}
            level1Categories={level1Categories}
            level2Categories={level2Categories}
            level3Categories={level3Categories}
            selectedCost={selectedCost}
            selectedStatus={selectedStatus}
            activeFilters={activeFilters}
            onCostClick={handleCostClick}
            onStatusClick={handleStatusClick}
            toggleFilter={toggleFilter}
            isActive={isActive}
            onSearch={handleSearch}
          />
        </div>

        {/* 오른쪽: 검색 + 결과 + 강의 목록 */}
        <div className="flex min-w-0 flex-1 flex-col gap-4">
          {/* 검색창 + 정렬 */}
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-4">
            <div className="flex flex-1 items-center gap-2">
              <Input
                className="flex-1"
                type="text"
                placeholder="검색어를 입력해주세요."
                value={searchTerm}
                onChange={event => setSearchTerm(event.target.value)}
                onKeyDown={event => {
                  if (event.key === 'Enter') {
                    handleSearch()
                  }
                }}
              />
              <Button type="button" className="bg-primary hover:bg-primary/90 text-white" onClick={handleSearch}>
                검색
              </Button>
            </div>
            <Select value={selectedSort} onValueChange={value => setSelectedSort(value)}>
              <SelectTrigger className={`${filterSelectTriggerClass} w-full md:w-[180px]`}>
                <SelectValue placeholder="정렬" />
              </SelectTrigger>
              <SelectContent>
                {SORT_OPTIONS.map(option => (
                  <SelectItem key={`sort-${option.value}`} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* 결과 수 - 데스크탑만 */}
          <div className="hidden text-sm text-gray-600 md:block">
            총 <strong className="text-primary">{pageInfo.totalElements}</strong>개의 강의가 검색되었습니다.
          </div>

          {/* 강의 목록 */}
          <div className="min-w-0 flex-1">
            {isLoading ? (
              <div className="py-10 text-center text-sm">강의 목록을 불러오는 중...</div>
            ) : isError ? (
              <div className="text-destructive py-10 text-center text-sm">강의 목록을 불러오지 못했습니다.</div>
            ) : lectures.length === 0 ? (
              <div className="py-10 text-center text-sm">검색 결과가 없습니다.</div>
            ) : (
              <>
                <LectureList lectures={lectures} maxColumns={3} />

                {/* 페이지네이션 */}
                {pageInfo.totalPages > 1 && (
                  <div className="mt-8 flex flex-col items-center gap-4">
                    {/* 페이지네이션 버튼 */}
                    <div className="flex items-center gap-1">
                      {/* 처음 */}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(0)}
                        disabled={pageInfo.isFirst}
                        className="h-9 w-9"
                        aria-label="첫 페이지로 이동"
                      >
                        «
                      </Button>
                      {/* 이전 */}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(pageInfo.currentPage - 1)}
                        disabled={pageInfo.isFirst}
                        className="h-9 w-9"
                        aria-label="이전 페이지로 이동"
                      >
                        ‹
                      </Button>

                      {/* 페이지 번호 */}
                      {getPageNumbers().map(pageNum => (
                        <Button
                          key={pageNum}
                          variant={pageNum === pageInfo.currentPage ? 'default' : 'ghost'}
                          size="sm"
                          onClick={() => handlePageChange(pageNum)}
                          className={`h-9 w-9 ${
                            pageNum === pageInfo.currentPage
                              ? 'bg-gray-700 text-white hover:bg-gray-600'
                              : 'text-gray-600 hover:bg-gray-100'
                          }`}
                        >
                          {pageNum + 1}
                        </Button>
                      ))}

                      {/* 다음 */}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(pageInfo.currentPage + 1)}
                        disabled={pageInfo.isLast}
                        className="h-9 w-9"
                        aria-label="다음 페이지로 이동"
                      >
                        ›
                      </Button>
                      {/* 마지막 */}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(pageInfo.totalPages - 1)}
                        disabled={pageInfo.isLast}
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
                        value={String(pageInfo.currentPage + 1)}
                        onValueChange={value => handlePageChange(Number(value) - 1)}
                      >
                        <SelectTrigger className="h-8 w-16">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: pageInfo.totalPages }, (_, i) => (
                            <SelectItem key={i} value={String(i + 1)}>
                              {i + 1}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function SearchContent() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center">Loading...</div>}>
      <SearchContentInner />
    </Suspense>
  )
}
