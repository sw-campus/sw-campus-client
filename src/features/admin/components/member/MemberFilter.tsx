'use client'

import { useState } from 'react'

import { LuSearch } from 'react-icons/lu'

import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

import { FilterOption } from '../../types/approval.type'
import type { MemberRoleFilter } from '../../types/member.type'

// Reuse FilterOption type

interface MemberFilterProps {
  currentRole: MemberRoleFilter
  keyword: string
  onRoleChange: (role: MemberRoleFilter) => void
  onKeywordChange: (keyword: string) => void
  searchPlaceholder?: string
}

const ROLE_OPTIONS: FilterOption<MemberRoleFilter>[] = [
  { label: '전체', value: 'ALL' },
  { label: '일반회원', value: 'USER' },
  { label: '기관회원', value: 'ORGANIZATION' },
  { label: '관리자', value: 'ADMIN' },
]

export function MemberFilter({
  currentRole,
  keyword,
  onRoleChange,
  onKeywordChange,
  searchPlaceholder,
}: MemberFilterProps) {
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
      {/* Role Filter Tabs */}
      <div className="flex gap-2">
        {ROLE_OPTIONS.map(option => {
          const isActive = currentRole === option.value

          return (
            <button
              key={option.value}
              onClick={() => onRoleChange(option.value)}
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
