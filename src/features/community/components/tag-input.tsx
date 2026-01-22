'use client'

import { useState } from 'react'

import { FiTag, FiX } from 'react-icons/fi'

import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface TagInputProps {
  tags: string[]
  onTagsChange: (tags: string[]) => void
  placeholder?: string
}

/**
 * 태그 입력 컴포넌트
 * - Enter 키로 태그 추가
 * - 중복 태그 방지
 * - 각 태그에 X 버튼으로 삭제
 */
export function TagInput({ tags, onTagsChange, placeholder = '태그 입력 후 Enter' }: TagInputProps) {
  const [inputValue, setInputValue] = useState('')
  const [isFocused, setIsFocused] = useState(false)

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      const trimmedValue = inputValue.trim()

      if (trimmedValue && !tags.includes(trimmedValue)) {
        onTagsChange([...tags, trimmedValue])
        setInputValue('')
      }
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    onTagsChange(tags.filter(tag => tag !== tagToRemove))
  }

  return (
    <div className="flex flex-col gap-2">
      {/* 입력 필드 */}
      <div className="relative">
        {/* 포커스 시 글로우 효과 */}
        <div
          className={cn(
            'pointer-events-none absolute -inset-0.5 rounded-xl bg-gradient-to-r from-blue-400 to-cyan-400 opacity-0 blur transition-opacity duration-300',
            isFocused && 'opacity-20'
          )}
        />

        <div
          className={cn(
            'relative flex items-center overflow-hidden rounded-xl border bg-white/80 backdrop-blur-sm transition-all duration-200',
            isFocused
              ? 'border-blue-300 shadow-lg shadow-blue-100/50'
              : 'border-gray-200/80 hover:border-gray-300'
          )}
        >
          {/* 태그 아이콘 */}
          <div className="pointer-events-none flex items-center pl-4">
            <FiTag
              className={cn(
                'h-4 w-4 transition-colors duration-200',
                isFocused ? 'text-blue-500' : 'text-gray-400'
              )}
            />
          </div>

          {/* 입력 필드 */}
          <input
            type="text"
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={placeholder}
            className="h-11 w-full flex-1 bg-transparent px-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none"
          />
        </div>
      </div>

      {/* 추가된 태그 뱃지 목록 */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {tags.map(tag => (
            <Badge
              key={tag}
              variant="secondary"
              className="h-7 gap-1.5 rounded-full bg-blue-50 px-3 text-blue-700 ring-1 ring-blue-200"
            >
              <FiTag className="h-3 w-3" />
              <span className="max-w-[120px] truncate text-[13px]">{tag}</span>
              <button
                type="button"
                onClick={() => handleRemoveTag(tag)}
                className="ml-0.5 flex h-4 w-4 items-center justify-center rounded-full transition-colors hover:bg-blue-200/50"
              >
                <FiX className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  )
}
