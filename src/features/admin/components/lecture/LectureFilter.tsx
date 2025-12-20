'use client'

import { useState } from 'react'

import { LuSearch } from 'react-icons/lu'

import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

import { LECTURE_AUTH_STATUS_FILTER_LABEL, type LectureAuthStatusFilter } from '../../types/lecture.type'

interface LectureFilterProps {
  currentStatus: LectureAuthStatusFilter
  keyword: string
  onStatusChange: (status: LectureAuthStatusFilter) => void
  onKeywordChange: (keyword: string) => void
}

const filterOptions: { label: string; value: LectureAuthStatusFilter }[] = [
  { label: LECTURE_AUTH_STATUS_FILTER_LABEL.ALL, value: 'ALL' },
  { label: LECTURE_AUTH_STATUS_FILTER_LABEL.PENDING, value: 'PENDING' },
  { label: LECTURE_AUTH_STATUS_FILTER_LABEL.APPROVED, value: 'APPROVED' },
  { label: LECTURE_AUTH_STATUS_FILTER_LABEL.REJECTED, value: 'REJECTED' },
]

export function LectureFilter({ currentStatus, keyword, onStatusChange, onKeywordChange }: LectureFilterProps) {
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
