'use client'

import { useMemo, useState } from 'react'

import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { FilterGroup } from '@/features/lecture/components/lecture-search/FilterGroups'
import { FilterTag } from '@/features/lecture/components/lecture-search/FilterTag'
import {
  COST_FILTERS,
  PROCEDURE_FILTERS,
  REGION_FILTERS,
  SORT_OPTIONS,
  DEFAULT_SORT,
  COST_QUERY_MAP,
  PROCEDURE_QUERY_MAP,
} from '@/features/lecture/types/filter.type'
import { BOOT_NAV_DATA } from '@/features/navi/types/navigation.type'

const filterSelectTriggerClass =
  'flex items-center justify-between gap-1 rounded-full border border-gray-200 bg-white px-3 py-1 text-sm font-medium text-gray-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-white'

export default function LectureSearchPage() {
  const router = useRouter()
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null)
  const [selectedCost, setSelectedCost] = useState<string | null>(null)
  const [selectedSort, setSelectedSort] = useState(DEFAULT_SORT)
  const [searchTerm, setSearchTerm] = useState('')
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({
    procedure: [],
    region: [],
  })

  const availableSubcategories = useMemo(
    () => BOOT_NAV_DATA.find(item => item.title === selectedCategory)?.items ?? [],
    [selectedCategory],
  )

  const toggleFilter = (group: string, label: string) => {
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

  const isActive = (group: string, label: string) => (activeFilters[group] ?? []).includes(label)

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
    setSelectedSubcategory(null)
  }

  const handleCostClick = (cost: string) => {
    setSelectedCost(prev => (prev === cost ? null : cost))
  }

  const handleSearch = () => {
    const params = new URLSearchParams()

    if (selectedSubcategory) {
      params.append('categoryIds', selectedSubcategory)
    }

    if (selectedCost) {
      const costParam = COST_QUERY_MAP[selectedCost]
      if (costParam) {
        params.append(costParam, 'true')
      }
    }

    ;(activeFilters.procedure ?? []).forEach(filter => {
      const parameter = PROCEDURE_QUERY_MAP[filter]
      if (parameter) {
        params.append(parameter, 'true')
      }
    })
    ;(activeFilters.region ?? []).forEach(region => {
      params.append('regions', region)
    })

    const trimmedText = searchTerm.trim()
    if (trimmedText) {
      params.append('text', trimmedText)
    }

    const sortValue = selectedSort || DEFAULT_SORT
    params.append('sort', sortValue)

    const queryString = params.toString()
    const destination = `/lectures/search${queryString ? `?${queryString}` : ''}`
    router.push(destination)
  }

  return (
    <div className="custom-container">
      <div className="custom-card">
        {/* 필터 */}
        <Card className="flex flex-col gap-6 bg-white/50 px-20 py-10">
          <div className="flex flex-wrap items-end gap-4">
            <FilterGroup label="대분류">
              <Select value={selectedCategory ?? undefined} onValueChange={handleCategoryChange}>
                <SelectTrigger className={`${filterSelectTriggerClass} w-[220px]`}>
                  <SelectValue placeholder="대분류" />
                </SelectTrigger>
                <SelectContent>
                  {BOOT_NAV_DATA.map(item => (
                    <SelectItem key={`category-${item.title}`} value={item.title}>
                      {item.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FilterGroup>

            <FilterGroup label="중분류">
              <Select
                key={selectedCategory ?? 'no-category'}
                value={selectedSubcategory ?? undefined}
                onValueChange={value => setSelectedSubcategory(value)}
              >
                <SelectTrigger className={`${filterSelectTriggerClass} w-[220px]`}>
                  <SelectValue placeholder={selectedCategory ? '중분류' : '대분류 먼저 선택'} />
                </SelectTrigger>
                <SelectContent>
                  {selectedCategory ? (
                    availableSubcategories.length ? (
                      availableSubcategories.map(sub => (
                        <SelectItem key={`subcategory-${sub.title}`} value={sub.title}>
                          {sub.title}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem key={`fallback-subcategory-${selectedCategory}`} value={selectedCategory}>
                        {selectedCategory}
                      </SelectItem>
                    )
                  ) : (
                    <SelectItem value="no-category" disabled>
                      대분류를 먼저 선택해주세요
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </FilterGroup>
          </div>

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
            className="min-w-[220px] flex-1"
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

      <div className="custom-card"></div>
    </div>
  )
}
