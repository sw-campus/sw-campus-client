'use client'

import { useState, useEffect } from 'react'

import { FiSearch, FiX } from 'react-icons/fi'

import { cn } from '@/lib/utils'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

/**
 * 검색 입력 컴포넌트
 * - 디바운싱 적용 (300ms)
 * - 모던한 글래스모피즘 스타일
 * - 포커스 애니메이션
 */
export function SearchBar({ value, onChange, placeholder = '검색어를 입력하세요' }: SearchBarProps) {
  const [inputValue, setInputValue] = useState(value)
  const [isFocused, setIsFocused] = useState(false)

  useEffect(() => {
    setInputValue(value)
  }, [value])

  useEffect(() => {
    const timer = setTimeout(() => {
      if (inputValue !== value) {
        onChange(inputValue)
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [inputValue, onChange, value])

  const handleClear = () => {
    setInputValue('')
    onChange('')
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onChange(inputValue)
    }
  }

  return (
    <div className="relative">
      {/* 포커스 시 글로우 효과 */}
      <div
        className={cn(
          'pointer-events-none absolute -inset-0.5 rounded-xl bg-gradient-to-r from-orange-400 to-amber-400 opacity-0 blur transition-opacity duration-300',
          isFocused && 'opacity-20'
        )}
      />

      <div
        className={cn(
          'relative flex items-center overflow-hidden rounded-xl border bg-white/80 backdrop-blur-sm transition-all duration-200',
          isFocused
            ? 'border-orange-300 shadow-lg shadow-orange-100/50'
            : 'border-gray-200/80 hover:border-gray-300'
        )}
      >
        {/* 검색 아이콘 */}
        <div className="pointer-events-none flex items-center pl-4">
          <FiSearch
            className={cn(
              'h-4 w-4 transition-colors duration-200',
              isFocused ? 'text-orange-500' : 'text-gray-400'
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

        {/* 클리어 버튼 */}
        {inputValue && (
          <button
            type="button"
            onClick={handleClear}
            className="mr-2 flex h-6 w-6 items-center justify-center rounded-full text-gray-400 transition-all hover:bg-gray-100 hover:text-gray-600 active:scale-90"
          >
            <FiX className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    </div>
  )
}
