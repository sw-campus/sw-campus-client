'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { MultiSelect } from '@/components/ui/multi-select'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup } from '@/components/ui/select'
import type { CategoryTreeNode } from '@/features/category/types/category.type'
import {
  COST_FILTERS,
  PROCEDURE_FILTERS,
  REGION_FILTERS,
  STATUS_FILTERS,
  FilterGroupKey,
} from '@/features/lecture/types/filter.type'

import { FilterGroup } from './FilterGroups'
import { FilterTag } from './FilterTag'

const filterSelectTriggerClass =
  'flex items-center justify-between gap-1 rounded-lg border border-gray-200 bg-white/60 px-3 py-2 text-sm font-medium text-gray-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'

interface LectureSearchSidebarProps {
  level1Id: number | null
  level2Id: number | null
  level3Ids: string[]
  onLevel1Change: (value: number | null) => void
  onLevel2Change: (value: number | null) => void
  onLevel3Change: (value: string[]) => void
  level1Categories: CategoryTreeNode[]
  level2Categories: CategoryTreeNode[]
  level3Categories: CategoryTreeNode[]
  selectedCost: string | null
  selectedStatus: string | null
  activeFilters: Record<FilterGroupKey, string[]>
  onCostClick: (cost: string) => void
  onStatusClick: (status: string) => void
  toggleFilter: (group: FilterGroupKey, label: string) => void
  isActive: (group: FilterGroupKey, label: string) => boolean
  onSearch: () => void
}

// 섹션 박스 컴포넌트
function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-gray-200/80 bg-white/30 p-3">
      <h4 className="mb-3 text-xs font-bold tracking-wider text-gray-500 uppercase">{title}</h4>
      {children}
    </div>
  )
}

export function LectureSearchSidebar({
  level1Id,
  level2Id,
  level3Ids,
  onLevel1Change,
  onLevel2Change,
  onLevel3Change,
  level1Categories,
  level2Categories,
  level3Categories,
  selectedCost,
  selectedStatus,
  activeFilters,
  onCostClick,
  onStatusClick,
  toggleFilter,
  isActive,
  onSearch,
}: LectureSearchSidebarProps) {
  const level3Options = level3Categories.map(c => ({
    label: c.categoryName,
    value: String(c.categoryId),
  }))

  const regionOptions = REGION_FILTERS.map(region => ({
    label: region,
    value: region,
  }))

  const selectedRegions = activeFilters.region ?? []

  const handleRegionChange = (values: string[]) => {
    const currentRegions = activeFilters.region ?? []
    currentRegions.forEach(r => {
      if (!values.includes(r)) toggleFilter('region', r)
    })
    values.forEach(r => {
      if (!currentRegions.includes(r)) toggleFilter('region', r)
    })
  }

  return (
    <Card className="sticky top-4 flex h-fit w-full flex-col gap-3 border-white/20 bg-white/50 p-4 backdrop-blur-xl lg:w-[300px]">
      <h3 className="text-base font-bold text-gray-800">검색 필터</h3>

      {/* 카테고리 섹션 */}
      <FilterSection title="📚 카테고리">
        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-2">
            <FilterGroup label="대분류">
              <Select value={level1Id?.toString() ?? ''} onValueChange={v => onLevel1Change(v ? Number(v) : null)}>
                <SelectTrigger className={filterSelectTriggerClass}>
                  <SelectValue placeholder="전체" />
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

            <FilterGroup label="중분류">
              <Select
                value={level2Id?.toString() ?? ''}
                onValueChange={v => onLevel2Change(v ? Number(v) : null)}
                disabled={!level1Id || level2Categories.length === 0}
              >
                <SelectTrigger className={filterSelectTriggerClass}>
                  <SelectValue placeholder="전체" />
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
          </div>

          <FilterGroup label="소분류">
            <MultiSelect
              options={level3Options}
              selected={level3Ids}
              onChange={onLevel3Change}
              placeholder="전체"
              disabled={!level2Id || level3Categories.length === 0}
              className="w-full"
            />
          </FilterGroup>
        </div>
      </FilterSection>

      {/* 강의 조건 섹션 */}
      <FilterSection title="⚙️ 강의 조건">
        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-3">
            <FilterGroup label="모집 상태">
              <div className="flex flex-wrap gap-1.5">
                {STATUS_FILTERS.map(status => (
                  <FilterTag
                    key={`status-${status}`}
                    label={status}
                    active={selectedStatus === status}
                    onClick={() => onStatusClick(status)}
                  />
                ))}
              </div>
            </FilterGroup>

            <FilterGroup label="비용">
              <div className="flex flex-wrap gap-1.5">
                {COST_FILTERS.map(cost => (
                  <FilterTag
                    key={`cost-${cost}`}
                    label={cost}
                    active={selectedCost === cost}
                    onClick={() => onCostClick(cost)}
                  />
                ))}
              </div>
            </FilterGroup>
          </div>

          <FilterGroup label="선발 절차">
            <div className="flex flex-wrap gap-1.5">
              {PROCEDURE_FILTERS.map(procedure => (
                <FilterTag
                  key={`procedure-${procedure}`}
                  label={procedure}
                  active={isActive('procedure', procedure)}
                  onClick={() => toggleFilter('procedure', procedure)}
                />
              ))}
            </div>
          </FilterGroup>
        </div>
      </FilterSection>

      {/* 지역 섹션 */}
      <FilterSection title="📍 지역">
        <MultiSelect
          options={regionOptions}
          selected={selectedRegions}
          onChange={handleRegionChange}
          placeholder="전체 지역"
          className="w-full"
        />
      </FilterSection>

      {/* 검색 버튼 */}
      <Button type="button" className="bg-primary hover:bg-primary/90 mt-1 w-full text-white" onClick={onSearch}>
        필터 적용
      </Button>
    </Card>
  )
}
