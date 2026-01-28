'use client'

import { X, ChevronDown } from 'lucide-react'
import { useCategoryTree } from '@/features/category/hooks/use-category-tree'
import { REGION_FILTERS } from '@/features/lecture/types/filter.type'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Checkbox } from '@/components/ui/checkbox'

export interface FilterValues {
  mainCategory: string
  subCategory: string
  detailCategories: string[]
  mainCategoryId: number | null
  subCategoryId: number | null
  detailCategoryIds: number[]
  recruitStatus: string[]
  cost: string[]
  selectionProcess: string[]
  regions: string[]
}

interface FilterModalProps {
  isOpen: boolean
  onClose: () => void
  filterValues: FilterValues
  onFilterChange: (values: FilterValues) => void
  onApply: () => void
}

const COST_OPTIONS = ['무료(내배카O)', '무료(내배카X)', '유료(자부담)']
const SELECTION_OPTIONS = ['면접 없음', '코딩테스트 없음', '사전학습과제 없음']
const RECRUIT_OPTIONS = ['모집 중', '마감']

export function FilterModal({
  isOpen,
  onClose,
  filterValues,
  onFilterChange,
  onApply,
}: FilterModalProps) {
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

  if (!isOpen) return null

  const toggleArrayValue = (
    key: 'recruitStatus' | 'cost' | 'selectionProcess',
    value: string
  ) => {
    const current = filterValues[key]
    const updated = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value]
    onFilterChange({ ...filterValues, [key]: updated })
  }

  // 대분류 변경 핸들러
  const handleMainCategoryChange = (value: string) => {
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
      subCategoryId: null,
      subCategory: '',
      detailCategoryIds: [],
      detailCategories: [],
    })
  }

  // 중분류 변경 핸들러
  const handleSubCategoryChange = (value: string) => {
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
      detailCategoryIds: [],
      detailCategories: [],
    })
  }

  // 안전한 배열 접근
  const regions = filterValues.regions ?? []
  const detailCategoryIds = filterValues.detailCategoryIds ?? []
  const detailCategoriesArr = filterValues.detailCategories ?? []

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

  return (
    <div className="fixed inset-0 z-50 px-4 py-8 bg-black/70 overflow-auto flex items-start justify-center">
      <div className="w-full max-w-[331px] p-4 bg-white rounded-xl shadow-[4px_4px_20px_rgba(161,161,170,0.25)] flex flex-col gap-4 my-auto">
        {/* Header */}
        <div className="w-full flex items-center justify-between">
          <h2 className="text-xl font-semibold text-[#020202]">검색필터</h2>
          <button onClick={onClose} className="p-2">
            <X className="w-4 h-4 text-[#020202]" />
          </button>
        </div>

        {/* Filter Sections */}
        <div className="w-full flex flex-col">
          {/* Category Section */}
          <div className="w-full p-3 border-t border-b border-[#020202] flex flex-col gap-6">
            <span className="text-base text-black">카테고리</span>
            <div className="w-full flex flex-col gap-3">
              {/* Main & Sub Category Row */}
              <div className="w-full flex gap-1">
                <div className="flex-1 flex flex-col gap-1">
                  <span className="text-xs text-[#888888]">대분류</span>
                  <Select
                    value={filterValues.mainCategoryId?.toString() ?? 'all'}
                    onValueChange={handleMainCategoryChange}
                  >
                    <SelectTrigger className="w-full h-10 bg-[#F2F2F2] border-none rounded-lg text-xs text-black">
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
                <div className="flex-1 flex flex-col gap-1">
                  <span className="text-xs text-[#888888]">중분류</span>
                  <Select
                    value={filterValues.subCategoryId?.toString() ?? 'all'}
                    onValueChange={handleSubCategoryChange}
                    disabled={!filterValues.mainCategoryId}
                  >
                    <SelectTrigger className="w-full h-10 bg-[#F2F2F2] border-none rounded-lg text-xs text-black disabled:text-[#888888] disabled:cursor-not-allowed">
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
              {/* Detail Category (다중 선택 드롭다운) */}
              <div className="w-full flex flex-col gap-1">
                <span className="text-xs text-[#888888]">소분류</span>
                <Popover>
                  <PopoverTrigger asChild>
                    <button
                      disabled={!filterValues.subCategoryId || detailCategories.length === 0}
                      className="w-full h-10 px-3 bg-[#F2F2F2] rounded-lg text-xs text-black flex items-center justify-between disabled:text-[#888888] disabled:cursor-not-allowed"
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

          {/* Lecture Conditions Section */}
          <div className="w-full p-3 border-b border-[#020202] flex flex-col gap-6">
            <span className="text-base text-black">강의 조건</span>

            {/* Recruit Status */}
            <div className="w-full flex flex-col gap-1">
              <span className="text-xs text-[#888888]">모집 상태</span>
              <div className="w-full flex gap-1">
                {RECRUIT_OPTIONS.map((option) => (
                  <FilterChip
                    key={option}
                    label={option}
                    isSelected={filterValues.recruitStatus.includes(option)}
                    onClick={() => toggleArrayValue('recruitStatus', option)}
                  />
                ))}
              </div>
            </div>

            {/* Cost */}
            <div className="w-full flex flex-col gap-1">
              <span className="text-xs text-[#888888]">비용</span>
              <div className="w-full flex gap-1">
                {COST_OPTIONS.map((option) => (
                  <FilterChip
                    key={option}
                    label={option}
                    isSelected={filterValues.cost.includes(option)}
                    onClick={() => toggleArrayValue('cost', option)}
                    compact
                  />
                ))}
              </div>
            </div>

            {/* Selection Process */}
            <div className="w-full flex flex-col gap-1">
              <span className="text-xs text-[#888888]">선발 절차</span>
              <div className="w-full flex flex-col gap-1">
                {SELECTION_OPTIONS.map((option) => (
                  <FilterChip
                    key={option}
                    label={option}
                    isSelected={filterValues.selectionProcess.includes(option)}
                    onClick={() => toggleArrayValue('selectionProcess', option)}
                    fullWidth
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Region Section (다중 선택 드롭다운) */}
          <div className="w-full p-3 border-b border-[#020202] flex flex-col gap-6">
            <span className="text-base text-black">지역</span>
            <Popover>
              <PopoverTrigger asChild>
                <button className="w-full h-10 px-3 bg-[#F2F2F2] rounded-lg text-xs text-black flex items-center justify-between">
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
        </div>

        {/* Apply Button */}
        <button
          onClick={onApply}
          className="w-full h-10 bg-[#020202] rounded-lg flex items-center justify-center"
        >
          <span className="text-xs text-white">필터 적용</span>
        </button>
      </div>
    </div>
  )
}

// Filter Chip Component
interface FilterChipProps {
  label: string
  isSelected: boolean
  onClick: () => void
  fullWidth?: boolean
  compact?: boolean
}

function FilterChip({ label, isSelected, onClick, fullWidth = false, compact = false }: FilterChipProps) {
  return (
    <button
      onClick={onClick}
      className={`
        ${fullWidth ? 'w-full' : 'flex-1'}
        ${compact ? 'px-1.5 py-2' : 'px-3 py-2'}
        rounded-lg flex items-center justify-center whitespace-nowrap min-w-0
        ${isSelected ? 'bg-[#FEB706] text-[#020202]' : 'bg-[#F2F2F2] text-black'}
      `}
    >
      <span className="text-xs truncate">{label}</span>
    </button>
  )
}
