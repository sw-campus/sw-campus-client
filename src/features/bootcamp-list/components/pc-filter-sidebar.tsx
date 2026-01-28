'use client'

import { X, Menu, ChevronDown } from 'lucide-react'
import { useCategoryTree } from '@/features/category/hooks/use-category-tree'
import { REGION_FILTERS } from '@/features/lecture/types/filter.type'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { FilterValues } from './filter-modal'

interface PCFilterSidebarProps {
  isOpen: boolean
  onToggle: () => void
  filterValues: FilterValues
  onFilterChange: (values: FilterValues) => void
  onApply: () => void
  onReset: () => void
}

const COST_OPTIONS = ['무료(내배카O)', '무료(내배카X)', '유료(자부담)']
const SELECTION_OPTIONS = ['면접 없음', '코딩테스트 없음', '사전학습과제 없음']
const RECRUIT_OPTIONS = ['모집 중', '마감']

export function PCFilterSidebar({
  isOpen,
  onToggle,
  filterValues,
  onFilterChange,
  onApply,
  onReset: _onReset,
}: PCFilterSidebarProps) {
  // 카테고리 트리 데이터 가져오기
  const { data: categoryTree = [] } = useCategoryTree()

  // 선택된 대분류의 하위 카테고리 (중분류)
  const selectedMainCategory = categoryTree.find(
    (cat) => cat.categoryId === filterValues.mainCategoryId
  )
  const subCategories = selectedMainCategory?.children ?? []

  // 선택된 중분류의 하위 카테고리 (소분류)
  const selectedSubCategory = subCategories.find(
    (cat) => cat.categoryId === filterValues.subCategoryId
  )
  const detailCategories = selectedSubCategory?.children ?? []

  const handleCheckboxChange = (
    field: 'recruitStatus' | 'cost' | 'selectionProcess',
    value: string
  ) => {
    const currentValues = filterValues[field]
    const newValues = currentValues.includes(value)
      ? currentValues.filter((v) => v !== value)
      : [...currentValues, value]

    onFilterChange({
      ...filterValues,
      [field]: newValues,
    })
  }

  // 안전한 배열 접근
  const regions = filterValues.regions ?? []
  const detailCategoryIds = filterValues.detailCategoryIds ?? []
  const detailCategoriesArr = filterValues.detailCategories ?? []

  // 대분류 변경 핸들러 (Select용)
  const handleMainCategorySelectChange = (value: string) => {
    if (value === 'all') {
      onFilterChange({
        ...filterValues,
        mainCategoryId: null,
        mainCategory: '',
        subCategoryId: null,
        subCategory: '',
        detailCategoryIds: [],
        detailCategories: [],
      })
      return
    }
    const categoryId = Number(value)
    const category = categoryTree.find((cat) => cat.categoryId === categoryId)
    onFilterChange({
      ...filterValues,
      mainCategoryId: categoryId,
      mainCategory: category?.categoryName ?? '',
      // 대분류 변경 시 중분류/소분류 초기화
      subCategoryId: null,
      subCategory: '',
      detailCategoryIds: [],
      detailCategories: [],
    })
  }

  // 중분류 변경 핸들러 (Select용)
  const handleSubCategorySelectChange = (value: string) => {
    if (value === 'all') {
      onFilterChange({
        ...filterValues,
        subCategoryId: null,
        subCategory: '',
        detailCategoryIds: [],
        detailCategories: [],
      })
      return
    }
    const categoryId = Number(value)
    const category = subCategories.find((cat) => cat.categoryId === categoryId)
    onFilterChange({
      ...filterValues,
      subCategoryId: categoryId,
      subCategory: category?.categoryName ?? '',
      // 중분류 변경 시 소분류 초기화
      detailCategoryIds: [],
      detailCategories: [],
    })
  }

  // 소분류 토글 핸들러 (다중 선택)
  const handleDetailCategoryToggle = (categoryId: number, categoryName: string) => {
    const isSelected = detailCategoryIds.includes(categoryId)
    if (isSelected) {
      onFilterChange({
        ...filterValues,
        detailCategoryIds: detailCategoryIds.filter((id) => id !== categoryId),
        detailCategories: detailCategoriesArr.filter((name) => name !== categoryName),
      })
    } else {
      onFilterChange({
        ...filterValues,
        detailCategoryIds: [...detailCategoryIds, categoryId],
        detailCategories: [...detailCategoriesArr, categoryName],
      })
    }
  }

  // 지역 토글 핸들러 (다중 선택)
  const handleRegionToggle = (region: string) => {
    const isSelected = regions.includes(region)
    if (isSelected) {
      onFilterChange({
        ...filterValues,
        regions: regions.filter((r) => r !== region),
      })
    } else {
      onFilterChange({
        ...filterValues,
        regions: [...regions, region],
      })
    }
  }

  // 선택된 소분류 표시 텍스트
  const detailCategoryDisplayText = detailCategoryIds.length === 0
    ? '전체'
    : detailCategoryIds.length === 1
      ? detailCategoriesArr[0]
      : `${detailCategoriesArr[0]} 외 ${detailCategoryIds.length - 1}개`

  // 선택된 지역 표시 텍스트
  const regionDisplayText = regions.length === 0
    ? '전체 지역'
    : regions.length === 1
      ? regions[0]
      : `${regions[0]} 외 ${regions.length - 1}개`

  // 토글 버튼: 항상 flex flow 안에 위치
  // - 닫힌 상태: 항상 표시
  // - 열린 상태 + 플로팅: 표시 (사이드바가 플로팅이므로 버튼이 flow에 남아야 함)
  // - 열린 상태 + 인라인: 숨김 (사이드바가 인라인이므로 버튼 불필요)
  // * 플로팅/인라인 전환 기준: --breakpoint-filter-inline (globals.css)
  return (
    <>
      <button
        onClick={onToggle}
        className={`w-10 h-10 p-2.5 bg-[#020202] rounded-xl flex items-center justify-center flex-shrink-0 self-start ${
          isOpen ? 'filter-inline:hidden' : ''
        }`}
      >
        <Menu className="w-5 h-5 text-[#FEB706]" />
      </button>

      {isOpen && (
        <>
          {/* 백드롭 - 플로팅 모드에서만 표시 (기준: --breakpoint-filter-inline) */}
          <div
            className="fixed inset-0 z-40 bg-black/30 filter-inline:hidden"
            onClick={onToggle}
          />

          {/* 필터 패널 (기준: --breakpoint-filter-inline in globals.css) */}
          {/* 미만: absolute 플로팅 */}
          {/* 이상: static 인라인 (기존 동작) */}
          <div className="absolute left-6 top-6 z-50 filter-inline:static filter-inline:z-auto w-[331px] flex-shrink-0 self-start h-fit bg-white rounded-xl p-5 flex flex-col gap-4 shadow-[4px_4px_20px_rgba(161,161,170,0.25)] max-h-[calc(100vh-48px)] overflow-y-auto filter-inline:max-h-none filter-inline:overflow-visible">
            {/* Header */}
            <div className="flex items-center justify-between pb-2">
              <h2 className="text-lg font-semibold text-[#020202]">검색필터</h2>
              <button
                onClick={onToggle}
                className="w-6 h-6 flex items-center justify-center"
              >
                <X className="w-4 h-4 text-[#020202]" />
              </button>
            </div>

            {/* 카테고리 섹션 */}
            <div className="py-4 border-t border-b border-gray-200 flex flex-col gap-4">
              <span className="text-sm font-semibold text-black">카테고리</span>
              <div className="flex flex-col gap-3">
                {/* 대분류 + 중분류 (가로 배치) */}
                <div className="flex gap-2">
                  <div className="flex-1 flex flex-col gap-1.5">
                    <span className="text-xs text-[#888888]">대분류</span>
                    <Select
                      value={filterValues.mainCategoryId?.toString() ?? 'all'}
                      onValueChange={handleMainCategorySelectChange}
                    >
                      <SelectTrigger className="w-full h-10 bg-[#F9F9F9] border-none rounded-lg text-sm text-black">
                        <SelectValue placeholder="전체" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">전체</SelectItem>
                        {categoryTree.map((cat) => (
                          <SelectItem key={cat.categoryId} value={cat.categoryId.toString()}>
                            {cat.categoryName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex-1 flex flex-col gap-1.5">
                    <span className="text-xs text-[#888888]">중분류</span>
                    <Select
                      value={filterValues.subCategoryId?.toString() ?? 'all'}
                      onValueChange={handleSubCategorySelectChange}
                      disabled={!filterValues.mainCategoryId}
                    >
                      <SelectTrigger className="w-full h-10 bg-[#F9F9F9] border-none rounded-lg text-sm text-black disabled:text-[#888888] disabled:cursor-not-allowed">
                        <SelectValue placeholder="전체" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">전체</SelectItem>
                        {subCategories.map((cat) => (
                          <SelectItem key={cat.categoryId} value={cat.categoryId.toString()}>
                            {cat.categoryName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                {/* 소분류 (다중 선택 드롭다운) */}
                <div className="flex flex-col gap-1.5">
                  <span className="text-xs text-[#888888]">소분류</span>
                  <Popover>
                    <PopoverTrigger asChild>
                      <button
                        disabled={!filterValues.subCategoryId || detailCategories.length === 0}
                        className="w-full h-10 px-3 bg-[#F9F9F9] rounded-lg text-sm text-black flex items-center justify-between disabled:text-[#888888] disabled:cursor-not-allowed"
                      >
                        <span className="truncate">{detailCategoryDisplayText}</span>
                        <ChevronDown className="w-4 h-4 flex-shrink-0 opacity-50" />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[280px] p-2 max-h-[300px] overflow-y-auto" align="start">
                      <div className="flex flex-col gap-1">
                        {detailCategories.map((cat) => (
                          <label
                            key={cat.categoryId}
                            className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-[#FEB706]/10 cursor-pointer"
                          >
                            <Checkbox
                              checked={detailCategoryIds.includes(cat.categoryId)}
                              onCheckedChange={() => handleDetailCategoryToggle(cat.categoryId, cat.categoryName)}
                              className="data-[state=checked]:bg-[#FEB706] data-[state=checked]:border-[#FEB706]"
                            />
                            <span className="text-sm">{cat.categoryName}</span>
                          </label>
                        ))}
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>

            {/* 강의 조건 섹션 */}
            <div className="py-4 border-b border-gray-200 flex flex-col gap-4">
              <span className="text-sm font-semibold text-black">강의 조건</span>
              <div className="flex flex-col gap-4">
                {/* 모집 상태 */}
                <div className="flex flex-col gap-2">
                  <span className="text-xs text-[#888888]">모집 상태</span>
                  <div className="flex gap-2">
                    {RECRUIT_OPTIONS.map((option) => (
                      <button
                        key={option}
                        onClick={() => handleCheckboxChange('recruitStatus', option)}
                        className={`flex-1 h-9 px-3 rounded-lg text-sm transition-colors ${
                          filterValues.recruitStatus.includes(option)
                            ? 'bg-[#FEB706] text-[#020202] font-medium'
                            : 'bg-[#F9F9F9] text-black'
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 비용 */}
                <div className="flex flex-col gap-2">
                  <span className="text-xs text-[#888888]">비용</span>
                  <div className="flex gap-2">
                    {COST_OPTIONS.map((option) => (
                      <button
                        key={option}
                        onClick={() => handleCheckboxChange('cost', option)}
                        className={`flex-1 h-9 px-2 rounded-lg text-xs transition-colors whitespace-nowrap ${
                          filterValues.cost.includes(option)
                            ? 'bg-[#FEB706] text-[#020202] font-medium'
                            : 'bg-[#F9F9F9] text-black'
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 선발 절차 */}
                <div className="flex flex-col gap-2">
                  <span className="text-xs text-[#888888]">선발 절차</span>
                  <div className="flex flex-col gap-2">
                    {SELECTION_OPTIONS.map((option) => (
                      <button
                        key={option}
                        onClick={() => handleCheckboxChange('selectionProcess', option)}
                        className={`w-full h-9 px-3 rounded-lg text-sm text-left transition-colors ${
                          filterValues.selectionProcess.includes(option)
                            ? 'bg-[#FEB706] text-[#020202] font-medium'
                            : 'bg-[#F9F9F9] text-black'
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* 지역 섹션 (다중 선택 드롭다운) */}
            <div className="py-4 flex flex-col gap-3">
              <span className="text-sm font-semibold text-black">지역</span>
              <Popover>
                <PopoverTrigger asChild>
                  <button className="w-full h-10 px-3 bg-[#F9F9F9] rounded-lg text-sm text-black flex items-center justify-between">
                    <span className="truncate">{regionDisplayText}</span>
                    <ChevronDown className="w-4 h-4 flex-shrink-0 opacity-50" />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-[280px] p-2 max-h-[300px] overflow-y-auto" align="start">
                  <div className="flex flex-col gap-1">
                    {REGION_FILTERS.map((region) => (
                      <label
                        key={region}
                        className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-[#FEB706]/10 cursor-pointer"
                      >
                        <Checkbox
                          checked={regions.includes(region)}
                          onCheckedChange={() => handleRegionToggle(region)}
                          className="data-[state=checked]:bg-[#FEB706] data-[state=checked]:border-[#FEB706]"
                        />
                        <span className="text-sm">{region}</span>
                      </label>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            {/* 필터 적용 버튼 */}
            <button
              onClick={onApply}
              className="w-full h-10 bg-[#262626] rounded-lg flex items-center justify-center mt-2"
            >
              <span className="text-sm text-white font-medium">필터 적용</span>
            </button>
          </div>
        </>
      )}
    </>
  )
}
