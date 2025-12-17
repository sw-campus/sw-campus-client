'use client'

import { useState, useEffect } from 'react'

import { useRouter, useSearchParams } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { MultiSelect } from '@/components/ui/multi-select'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup } from '@/components/ui/select'
import { useCategoryTree } from '@/features/category'
import type { CategoryTreeNode } from '@/features/category/types/category.type'
import { LectureList } from '@/features/lecture/components/LectureList'
import { FilterGroup } from '@/features/lecture/components/lecture-search/FilterGroups'
import { FilterTag } from '@/features/lecture/components/lecture-search/FilterTag'
import { useSearchLectureQuery } from '@/features/lecture/hooks/useSearchLectureQuery'
import {
  COST_FILTERS,
  PROCEDURE_FILTERS,
  REGION_FILTERS,
  SORT_OPTIONS,
  DEFAULT_SORT,
  COST_QUERY_MAP,
  PROCEDURE_QUERY_MAP,
  REGION_QUERY_MAP,
  STATUS_FILTERS,
  STATUS_QUERY_MAP,
  FilterGroupKey,
} from '@/features/lecture/types/filter.type'
import { mapLectureResponseToSummary } from '@/features/lecture/utils/mapLectureResponseToSummary'

const filterSelectTriggerClass =
  'flex items-center justify-between gap-1 rounded-full border border-input bg-background px-3 py-1 text-sm font-medium text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background'

export default function LectureSearchPage() {
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

  // Category Tree Data
  const { data: categoryTree } = useCategoryTree()

  // Category State
  const [level1Id, setLevel1Id] = useState<number | null>(null) // Single
  const [level2Id, setLevel2Id] = useState<number | null>(null) // Single
  const [level3Ids, setLevel3Ids] = useState<string[]>([]) // Multi

  const [selectedCost, setSelectedCost] = useState<string | null>(null)
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null)
  const [selectedSort, setSelectedSort] = useState(DEFAULT_SORT)
  const [searchTerm, setSearchTerm] = useState('')
  const [activeFilters, setActiveFilters] = useState<Record<FilterGroupKey, string[]>>({
    procedure: [],
    region: [],
  })

  // Level 1 Categories
  const level1Categories = categoryTree ?? []

  // Level 2 Categories (Children of single L1)
  const level2Categories = (() => {
    if (!level1Id || !categoryTree) return []
    const parent = categoryTree.find((c: CategoryTreeNode) => c.categoryId === level1Id)
    return parent?.children ?? []
  })()

  // Level 3 Categories (Children of single L2)
  const level3Categories = (() => {
    if (!level2Id || !level2Categories.length) return []
    const parent = level2Categories.find((c: CategoryTreeNode) => c.categoryId === level2Id)
    return parent?.children ?? []
  })()

  // Category ID → Path 매핑 (O(1) 조회를 위한 최적화)
  type CategoryPath = { l1: number; l2?: number; l3?: number }
  const categoryPathMap = (() => {
    const map = new Map<number, CategoryPath>()
    if (!categoryTree) return map

    for (const l1 of categoryTree) {
      map.set(l1.categoryId, { l1: l1.categoryId })

      if (l1.children) {
        for (const l2 of l1.children) {
          map.set(l2.categoryId, { l1: l1.categoryId, l2: l2.categoryId })

          if (l2.children) {
            for (const l3 of l2.children) {
              map.set(l3.categoryId, { l1: l1.categoryId, l2: l2.categoryId, l3: l3.categoryId })
            }
          }
        }
      }
    }
    return map
  })()

  // Reset Child Categories on Parent Change
  // Sync State with URL Params
  useEffect(() => {
    if (!categoryTree || categoryTree.length === 0) return

    const categoryIdsParam = searchParams.getAll('categoryIds')
    if (categoryIdsParam.length === 0) {
      setLevel1Id(null)
      setLevel2Id(null)
      setLevel3Ids([])
      return
    }

    // Find deepest category level from URL
    // URL에 여러 ID가 있을 수 있음 (L3 다중 선택 등)
    // 여기서는 첫 번째 유효한 ID를 기준으로 L1, L2를 설정하고, L3는 모아서 설정

    let foundL1: number | null = null
    let foundL2: number | null = null
    const foundL3s: string[] = []

    // Process all Category IDs
    categoryIdsParam.forEach(idStr => {
      const id = Number(idStr)
      if (!id) return

      const path = categoryPathMap.get(id)
      if (path) {
        // L1이 변경되면 하위 상태(L2)도 초기화
        if (path.l1 && path.l1 !== foundL1) {
          foundL1 = path.l1
          foundL2 = null // L1이 바뀌면 L2는 반드시 초기화
        }
        // L2는 현재 L1의 자식일 때만 업데이트
        if (path.l2 && path.l1 === foundL1) {
          foundL2 = path.l2
        }
        if (path.l3) foundL3s.push(String(path.l3))
      }
    })

    // Update State
    // Only update if changed to avoid loops (though SetState handles this)
    if (foundL1 !== level1Id) setLevel1Id(foundL1)
    if (foundL2 !== level2Id) setLevel2Id(foundL2)

    // 배열 비교
    const isL3Same = foundL3s.length === level3Ids.length && foundL3s.every(id => level3Ids.includes(id))
    if (!isL3Same) setLevel3Ids(foundL3s)
  }, [searchParams, categoryTree, categoryPathMap])

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

    // Resolve Category IDs (Deepest selected level wins)
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

    // Procedure Filters (Inverted logic for "No ...")
    ;(activeFilters.procedure ?? []).forEach(filter => {
      const parameter = PROCEDURE_QUERY_MAP[filter]
      if (parameter) {
        // Special handling for "No ...인" filters
        if (filter.includes('없음')) {
          params.append(parameter, 'false')
        } else {
          params.append(parameter, 'true')
        }
      }
    })
    ;(activeFilters.region ?? []).forEach(region => {
      // Use mapping if available, otherwise use original label
      const shortRegion = REGION_QUERY_MAP[region] ?? region
      params.append('regions', shortRegion)
    })

    const trimmedText = searchTerm.trim()
    if (trimmedText) {
      params.append('text', trimmedText)
    }

    const sortValue = selectedSort || DEFAULT_SORT
    params.append('sort', sortValue)

    // 검색 시 첫 페이지로 초기화 (백엔드는 1-indexed)
    params.set('page', '1')

    const queryString = params.toString()
    const destination = `/lectures/search${queryString ? `?${queryString}` : ''}`
    router.push(destination)
  }

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString())
    // 백엔드는 1-indexed 페이지를 기대하므로 +1
    params.set('page', String(newPage + 1))
    router.push(`/lectures/search?${params.toString()}`)
  }

  // 페이지 번호 목록 생성 (최대 5개)
  const getPageNumbers = () => {
    const { currentPage, totalPages } = pageInfo
    const maxVisible = 5
    let start = Math.max(0, currentPage - Math.floor(maxVisible / 2))
    const end = Math.min(totalPages - 1, start + maxVisible - 1)

    // 끝에 가까우면 시작점 조정
    if (end - start + 1 < maxVisible) {
      start = Math.max(0, end - maxVisible + 1)
    }

    const pages = []
    for (let i = start; i <= end; i++) {
      pages.push(i)
    }
    return pages
  }

  // Convert categories to options for MultiSelect
  const level3Options = categoryTree
    ? level3Categories.map(c => ({ label: c.categoryName, value: String(c.categoryId) }))
    : []

  return (
    <div className="custom-container">
      <div className="custom-card">
        {/* 필터 */}
        <Card className="flex flex-col gap-6 bg-white/50 px-20 py-10">
          <div className="flex flex-wrap items-end gap-4">
            {/* 대분류 */}
            <FilterGroup label="대분류">
              <Select
                value={level1Id?.toString() ?? ''}
                onValueChange={v => {
                  setLevel1Id(v ? Number(v) : null)
                  setLevel2Id(null) // Reset child
                  setLevel3Ids([]) // Reset child
                }}
              >
                <SelectTrigger className={`${filterSelectTriggerClass} w-[220px]`}>
                  <SelectValue placeholder="대분류 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {level1Categories.map(cat => (
                      <SelectItem key={cat.categoryId} value={cat.categoryId.toString()}>
                        {cat.categoryName}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </FilterGroup>

            {/* 중분류 */}
            <FilterGroup label="중분류">
              <Select
                value={level2Id?.toString() ?? ''}
                onValueChange={v => {
                  setLevel2Id(v ? Number(v) : null)
                  setLevel3Ids([]) // Reset child
                }}
                disabled={!level1Id || level2Categories.length === 0}
              >
                <SelectTrigger className={`${filterSelectTriggerClass} w-[220px]`}>
                  <SelectValue placeholder="중분류 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {level2Categories.map(cat => (
                      <SelectItem key={cat.categoryId} value={cat.categoryId.toString()}>
                        {cat.categoryName}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </FilterGroup>

            {/* 소분류 */}
            <FilterGroup label="소분류">
              <MultiSelect
                options={level3Options}
                selected={level3Ids}
                onChange={setLevel3Ids}
                placeholder="소분류 선택"
                disabled={!level2Id || level3Categories.length === 0}
                className="w-[220px]"
              />
            </FilterGroup>
          </div>

          <FilterGroup label="모집 상태">
            {STATUS_FILTERS.map(status => (
              <FilterTag
                key={`status-${status}`}
                label={status}
                active={selectedStatus === status}
                onClick={() => handleStatusClick(status)}
              />
            ))}
          </FilterGroup>

          <FilterGroup label="비용">
            {COST_FILTERS.map(cost => (
              <FilterTag
                key={`cost-${cost}`}
                label={cost}
                active={selectedCost === cost}
                onClick={() => handleCostClick(cost)}
              />
            ))}
          </FilterGroup>

          <FilterGroup label="선발 절차">
            {PROCEDURE_FILTERS.map(procedure => (
              <FilterTag
                key={`procedure-${procedure}`}
                label={procedure}
                active={isActive('procedure', procedure)}
                onClick={() => toggleFilter('procedure', procedure)}
              />
            ))}
          </FilterGroup>

          <FilterGroup label="지역">
            {REGION_FILTERS.map(region => (
              <FilterTag
                key={`region-${region}`}
                label={region}
                active={isActive('region', region)}
                onClick={() => toggleFilter('region', region)}
              />
            ))}
          </FilterGroup>
        </Card>

        {/* 검색 */}
        <div className="flex w-full flex-wrap items-center gap-5 pt-4">
          <Select value={selectedSort} onValueChange={value => setSelectedSort(value)}>
            <SelectTrigger className={`${filterSelectTriggerClass} w-[180px]`}>
              <SelectValue placeholder="정렬 기준" />
            </SelectTrigger>
            <SelectContent>
              {SORT_OPTIONS.map(option => (
                <SelectItem key={`sort-${option.value}`} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Input
            className="text-shadow-accent min-w-[220px] flex-1"
            type="text"
            placeholder="검색어를 입력해주세요."
            value={searchTerm}
            onChange={event => setSearchTerm(event.target.value)}
          />
          <Button
            type="button"
            className="border-primary bg-primary focus-visible:ring-offset-primary/20 hover:bg-primary/90 w-[100px] text-white"
            onClick={handleSearch}
          >
            검색
          </Button>
        </div>
      </div>

      <div className="custom-card">
        {isLoading ? (
          <div className="py-10 text-center text-sm">강의 목록을 불러오는 중...</div>
        ) : isError ? (
          <div className="text-destructive py-10 text-center text-sm">강의 목록을 불러오지 못했습니다.</div>
        ) : lectures.length === 0 ? (
          <div className="py-10 text-center text-sm">검색 결과가 없습니다.</div>
        ) : (
          <>
            <LectureList lectures={lectures} />

            {/* 페이지네이션 */}
            {pageInfo.totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center gap-2">
                {/* 이전 페이지 */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pageInfo.currentPage - 1)}
                  disabled={pageInfo.isFirst}
                  className="h-9 px-3"
                >
                  이전
                </Button>

                {/* 페이지 번호 */}
                <div className="flex items-center gap-1">
                  {getPageNumbers().map(pageNum => (
                    <Button
                      key={pageNum}
                      variant={pageNum === pageInfo.currentPage ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handlePageChange(pageNum)}
                      className={`h-9 w-9 ${
                        pageNum === pageInfo.currentPage
                          ? 'bg-primary hover:bg-primary/90 text-white'
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      {pageNum + 1}
                    </Button>
                  ))}
                </div>

                {/* 다음 페이지 */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pageInfo.currentPage + 1)}
                  disabled={pageInfo.isLast}
                  className="h-9 px-3"
                >
                  다음
                </Button>

                {/* 전체 페이지 정보 */}
                <span className="ml-4 text-sm text-gray-500">
                  총 {pageInfo.totalElements}개 중 {pageInfo.currentPage * pageInfo.size + 1}-
                  {Math.min((pageInfo.currentPage + 1) * pageInfo.size, pageInfo.totalElements)}개
                </span>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
