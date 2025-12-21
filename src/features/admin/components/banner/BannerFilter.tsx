'use client'

import { useState } from 'react'

import { LuSearch } from 'react-icons/lu'

import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

import type { BannerPeriodStatus } from '../../types/banner.type'
import { BANNER_PERIOD_STATUS_LABEL } from '../../types/banner.type'

interface BannerFilterProps {
  currentStatus: BannerPeriodStatus
  keyword: string
  onStatusChange: (status: BannerPeriodStatus) => void
  onKeywordChange: (keyword: string) => void
}

const filterOptions: { label: string; value: BannerPeriodStatus }[] = [
  { label: BANNER_PERIOD_STATUS_LABEL.ALL, value: 'ALL' },
  { label: BANNER_PERIOD_STATUS_LABEL.SCHEDULED, value: 'SCHEDULED' },
  { label: BANNER_PERIOD_STATUS_LABEL.ACTIVE, value: 'ACTIVE' },
  { label: BANNER_PERIOD_STATUS_LABEL.ENDED, value: 'ENDED' },
]

export function BannerFilter({ currentStatus, keyword, onStatusChange, onKeywordChange }: BannerFilterProps) {
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

      {/* Search Input */}
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
