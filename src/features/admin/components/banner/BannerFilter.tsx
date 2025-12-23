'use client'

import { useState } from 'react'

import { LuSearch } from 'react-icons/lu'

import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { cn } from '@/lib/utils'

import type { BannerPeriodStatus, BannerTypeFilter } from '../../types/banner.type'
import { BANNER_PERIOD_STATUS_LABEL, BANNER_TYPE_FILTER_LABEL } from '../../types/banner.type'

interface BannerFilterProps {
  currentStatus: BannerPeriodStatus
  currentType: BannerTypeFilter
  keyword: string
  onStatusChange: (status: BannerPeriodStatus) => void
  onTypeChange: (type: BannerTypeFilter) => void
  onKeywordChange: (keyword: string) => void
}

// 기간 상태 필터 옵션
const periodOptions: { label: string; value: BannerPeriodStatus }[] = [
  { label: BANNER_PERIOD_STATUS_LABEL.ALL, value: 'ALL' },
  { label: BANNER_PERIOD_STATUS_LABEL.SCHEDULED, value: 'SCHEDULED' },
  { label: BANNER_PERIOD_STATUS_LABEL.ACTIVE, value: 'ACTIVE' },
  { label: BANNER_PERIOD_STATUS_LABEL.ENDED, value: 'ENDED' },
]

// 배너 타입 필터 옵션
const typeOptions: { label: string; value: BannerTypeFilter }[] = [
  { label: BANNER_TYPE_FILTER_LABEL.ALL, value: 'ALL' },
  { label: BANNER_TYPE_FILTER_LABEL.BIG, value: 'BIG' },
  { label: BANNER_TYPE_FILTER_LABEL.MIDDLE, value: 'MIDDLE' },
  { label: BANNER_TYPE_FILTER_LABEL.SMALL, value: 'SMALL' },
]

export function BannerFilter({
  currentStatus,
  currentType,
  keyword,
  onStatusChange,
  onTypeChange,
  onKeywordChange,
}: BannerFilterProps) {
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
      {/* 좌측: 필터들 */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Period Status Filter Tabs */}
        <div className="flex gap-2">
          {periodOptions.map(option => {
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

        {/* Banner Type Select */}
        <Select value={currentType} onValueChange={(value: BannerTypeFilter) => onTypeChange(value)}>
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="배너 크기" />
          </SelectTrigger>
          <SelectContent>
            {typeOptions.map(option => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* 우측: 검색 */}
      <div className="relative w-full sm:w-64">
        <LuSearch className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
        <Input
          type="text"
          placeholder="강의명 검색..."
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          className="pl-9"
        />
      </div>
    </div>
  )
}
