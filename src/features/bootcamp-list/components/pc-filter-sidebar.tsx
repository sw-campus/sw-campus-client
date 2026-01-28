'use client'

import { X, Menu, ChevronDown } from 'lucide-react'
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

  // 대분류 변경 핸들러
  const handleMainCategoryChange = (categoryId: number) => {
    const category = categoryTree.find((cat) => cat.categoryId === categoryId)
    onFilterChange({
      ...filterValues,
      mainCategoryId: categoryId,
      mainCategory: category?.categoryName ?? '',
      // 대분류 변경 시 중분류/소분류 초기화
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
      // 중분류 변경 시 소분류 초기화
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

  // 필터 닫힌 상태 - 40x40 검은색 토글 버튼
  if (!isOpen) {
    return (
      <button
        onClick={onToggle}
        className="w-10 h-10 p-2.5 bg-[#020202] rounded-xl flex items-center justify-center flex-shrink-0 self-start"
      >
        <Menu className="w-5 h-5 text-[#FEB706]" />
      </button>
    )
  }

  // 필터 열린 상태 - 331px width (피그마 스펙)
  return (
    <div className="w-[331px] flex-shrink-0 self-start h-fit bg-white rounded-xl p-5 flex flex-col gap-4 shadow-[4px_4px_20px_rgba(161,161,170,0.25)]">
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
              <div className="relative">
                <select
                  value={filterValues.mainCategoryId ?? ''}
                  onChange={(e) => {
                    const value = e.target.value
                    if (value) {
                      handleMainCategoryChange(Number(value))
                    }
                  }}
                  className="w-full h-10 px-3 bg-[#F9F9F9] rounded-lg text-sm text-black appearance-none cursor-pointer pr-8"
                >
                  <option value="">전체</option>
                  {categoryTree.map((cat) => (
                    <option key={cat.categoryId} value={cat.categoryId}>
                      {cat.categoryName}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-black absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
            <div className="flex-1 flex flex-col gap-1.5">
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
                  className="w-full h-10 px-3 bg-[#F9F9F9] rounded-lg text-sm text-black appearance-none cursor-pointer pr-8 disabled:text-[#888888] disabled:cursor-not-allowed"
                >
                  <option value="">전체</option>
                  {subCategories.map((cat) => (
                    <option key={cat.categoryId} value={cat.categoryId}>
                      {cat.categoryName}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-black absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>
          {/* 소분류 */}
          <div className="flex flex-col gap-1.5">
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
                className="w-full h-10 px-3 bg-[#F9F9F9] rounded-lg text-sm text-black appearance-none cursor-pointer pr-8 disabled:text-[#888888] disabled:cursor-not-allowed"
              >
                <option value="">전체</option>
                {detailCategories.map((cat) => (
                  <option key={cat.categoryId} value={cat.categoryId}>
                    {cat.categoryName}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-[#888888] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
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

      {/* 지역 섹션 */}
      <div className="py-4 flex flex-col gap-3">
        <span className="text-sm font-semibold text-black">지역</span>
        <div className="relative">
          <select
            value={filterValues.region}
            onChange={(e) => handleRegionChange(e.target.value)}
            className="w-full h-10 px-3 bg-[#F9F9F9] rounded-lg text-sm text-black appearance-none cursor-pointer pr-8"
          >
            <option value="">전체 지역</option>
            {REGION_FILTERS.map((region) => (
              <option key={region} value={region}>
                {region}
              </option>
            ))}
          </select>
          <ChevronDown className="w-4 h-4 text-[#888888] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {/* 필터 적용 버튼 */}
      <button
        onClick={onApply}
        className="w-full h-10 bg-[#262626] rounded-lg flex items-center justify-center mt-2"
      >
        <span className="text-sm text-white font-medium">필터 적용</span>
      </button>
    </div>
  )
}
