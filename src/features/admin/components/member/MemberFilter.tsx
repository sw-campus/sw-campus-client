'use client'

import { useState } from 'react'

import { LuBuilding, LuList, LuSearch, LuShield, LuUser } from 'react-icons/lu'

import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

import type { MemberRoleFilter } from '../../types/member.type'

interface MemberFilterProps {
  currentRole: MemberRoleFilter
  keyword: string
  onRoleChange: (role: MemberRoleFilter) => void
  onKeywordChange: (keyword: string) => void
  searchPlaceholder?: string
}

// 역할 필터 옵션 (색상 및 아이콘 포함)
const ROLE_OPTIONS: {
  label: string
  value: MemberRoleFilter
  icon: React.ElementType
  activeClass: string
}[] = [
  {
    label: '전체',
    value: 'ALL',
    icon: LuList,
    activeClass: 'bg-gray-800 text-white dark:bg-gray-200 dark:text-gray-900',
  },
  {
    label: '일반회원',
    value: 'USER',
    icon: LuUser,
    activeClass: 'bg-blue-500 text-white',
  },
  {
    label: '기관회원',
    value: 'ORGANIZATION',
    icon: LuBuilding,
    activeClass: 'bg-emerald-500 text-white',
  },
  {
    label: '관리자',
    value: 'ADMIN',
    icon: LuShield,
    activeClass: 'bg-amber-500 text-white',
  },
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
          const Icon = option.icon

          return (
            <button
              key={option.value}
              onClick={() => onRoleChange(option.value)}
              className={cn(
                'flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200',
                isActive
                  ? option.activeClass
                  : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground',
              )}
            >
              <Icon className="h-4 w-4" />
              {option.label}
            </button>
          )
        })}
      </div>

      {/* Search Input */}
      {searchPlaceholder && (
        <div className="relative w-full sm:w-72">
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
