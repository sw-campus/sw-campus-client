'use client'

import { X, ChevronDown } from 'lucide-react'
import { useCategoryTree } from '@/features/category/hooks/use-category-tree'
import { REGION_FILTERS } from '@/features/lecture/types/filter.type'

export interface FilterValues {
  mainCategory: string
  subCategory: string
  detailCategory: string
  mainCategoryId: number | null
  subCategoryId: number | null
  detailCategoryId: number | null
  recruitStatus: string[]
  cost: string[]
  selectionProcess: string[]
  region: string
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
  const handleMainCategoryChange = (categoryId: number) => {
    const category = categoryTree.find((cat) => cat.categoryId === categoryId)
    onFilterChange({
      ...filterValues,
      mainCategoryId: categoryId,
      mainCategory: category?.categoryName ?? '',
      subCategoryId: null,
      subCategory: '',
      detailCategoryId: null,
      detailCategory: '',
    })
  }

  // 중분류 변경 핸들러
  const handleSubCategoryChange = (categoryId: number) => {
    const category = subCategories.find((cat) => cat.categoryId === categoryId)
    onFilterChange({
      ...filterValues,
      subCategoryId: categoryId,
      subCategory: category?.categoryName ?? '',
      detailCategoryId: null,
      detailCategory: '',
    })
  }

  // 소분류 변경 핸들러
  const handleDetailCategoryChange = (categoryId: number) => {
    const category = detailCategories.find((cat) => cat.categoryId === categoryId)
    onFilterChange({
      ...filterValues,
      detailCategoryId: categoryId,
      detailCategory: category?.categoryName ?? '',
    })
  }

  // 지역 변경 핸들러
  const handleRegionChange = (region: string) => {
    onFilterChange({
      ...filterValues,
      region,
    })
  }

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
                  <div className="relative">
                    <select
                      value={filterValues.mainCategoryId ?? ''}
                      onChange={(e) => {
                        const value = e.target.value
                        if (value) {
                          handleMainCategoryChange(Number(value))
                        }
                      }}
                      className="w-full p-2.5 bg-[#F2F2F2] rounded-lg text-xs text-black appearance-none cursor-pointer pr-8"
                    >
                      <option value="">전체</option>
                      {categoryTree.map((cat) => (
                        <option key={cat.categoryId} value={cat.categoryId}>
                          {cat.categoryName}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-4 h-4 text-black absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
                <div className="flex-1 flex flex-col gap-1">
                  <span className="text-xs text-[#888888]">중분류</span>
                  <div className="relative">
                    <select
                      value={filterValues.subCategoryId ?? ''}
                      onChange={(e) => {
                        const value = e.target.value
                        if (value) {
                          handleSubCategoryChange(Number(value))
                        }
                      }}
                      disabled={!filterValues.mainCategoryId}
                      className="w-full p-2.5 bg-[#F2F2F2] rounded-lg text-xs text-black appearance-none cursor-pointer pr-8 disabled:text-[#888888] disabled:cursor-not-allowed"
                    >
                      <option value="">전체</option>
                      {subCategories.map((cat) => (
                        <option key={cat.categoryId} value={cat.categoryId}>
                          {cat.categoryName}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-4 h-4 text-black absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
              </div>
              {/* Detail Category */}
              <div className="w-full flex flex-col gap-1">
                <span className="text-xs text-[#888888]">소분류</span>
                <div className="relative">
                  <select
                    value={filterValues.detailCategoryId ?? ''}
                    onChange={(e) => {
                      const value = e.target.value
                      if (value) {
                        handleDetailCategoryChange(Number(value))
                      }
                    }}
                    disabled={!filterValues.subCategoryId || detailCategories.length === 0}
                    className="w-full p-2.5 bg-[#F2F2F2] rounded-lg text-xs text-black appearance-none cursor-pointer pr-8 disabled:text-[#888888] disabled:cursor-not-allowed"
                  >
                    <option value="">전체</option>
                    {detailCategories.map((cat) => (
                      <option key={cat.categoryId} value={cat.categoryId}>
                        {cat.categoryName}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-[#888888] absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
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

          {/* Region Section */}
          <div className="w-full p-3 border-b border-[#020202] flex flex-col gap-6">
            <span className="text-base text-black">지역</span>
            <div className="relative">
              <select
                value={filterValues.region}
                onChange={(e) => handleRegionChange(e.target.value)}
                className="w-full p-2.5 bg-[#F2F2F2] rounded-lg text-xs text-black appearance-none cursor-pointer pr-8"
              >
                <option value="">전체 지역</option>
                {REGION_FILTERS.map((region) => (
                  <option key={region} value={region}>
                    {region}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-[#888888] absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
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
