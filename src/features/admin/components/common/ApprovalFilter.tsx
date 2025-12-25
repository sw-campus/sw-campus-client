'use client'

import { useState } from 'react'

import { LuSearch } from 'react-icons/lu'

import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

import type { ApprovalStatusFilter, FilterOption } from '../../types/approval.type'
import { DEFAULT_FILTER_OPTIONS } from '../../types/approval.type'

interface ApprovalFilterProps {
  currentStatus: ApprovalStatusFilter
  keyword: string
  onStatusChange: (status: ApprovalStatusFilter) => void
  onKeywordChange: (keyword: string) => void
  /**
   * 검색 placeholder 텍스트
   * @default "검색..."
   */
  searchPlaceholder?: string
  /**
   * 필터 옵션 목록 (기본값: 전체/승인대기/승인완료/반려)
   */
  filterOptions?: FilterOption<ApprovalStatusFilter>[]
  /**
   * 상태 필터 숨김 여부
   */
  hideStatusFilter?: boolean
}

export function ApprovalFilter({
  currentStatus,
  keyword,
  onStatusChange,
  onKeywordChange,
  searchPlaceholder,
  filterOptions = DEFAULT_FILTER_OPTIONS,
  hideStatusFilter = false,
}: ApprovalFilterProps) {
  const [inputValue, setInputValue] = useState(keyword)

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onKeywordChange(inputValue)
    }
  }

  const handleBlur = () => {
    onKeywordChange(inputValue)
  }

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      {/* Status Filter Tabs */}
      {!hideStatusFilter && (
        <div className="flex gap-2">
          {filterOptions.map(option => {
            const isActive = currentStatus === option.value

            return (
              <button
                key={option.value}
                onClick={() => onStatusChange(option.value)}
                className={cn(
                  'rounded-lg px-4 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                )}
              >
                {option.label}
              </button>
            )
          })}
        </div>
      )}

      {/* Search Input */}
      {searchPlaceholder && (
        <div className="relative w-full sm:w-64">
          <LuSearch className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <Input
            type="text"
            placeholder={searchPlaceholder}
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
            className="pl-9"
          />
        </div>
      )}
    </div>
  )
}
