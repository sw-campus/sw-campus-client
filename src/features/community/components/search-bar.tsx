'use client'

import { useState, useEffect } from 'react'

import { FiSearch, FiX, FiTag } from 'react-icons/fi'

import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  /** 태그 배열 (URL에서 가져온 값) */
  tags?: string[]
  /** 태그 변경 콜백 - keywordOnly는 태그 추출 후 남은 키워드 */
  onTagsChange?: (tags: string[], keywordOnly?: string) => void
}

/**
 * 검색 입력 컴포넌트
 * - 디바운싱 적용 (300ms)
 * - #태그 형식으로 태그 추가 지원
 * - 모던한 글래스모피즘 스타일
 */
export function SearchBar({
  value,
  onChange,
  placeholder = '검색어를 입력하세요',
  tags = [],
  onTagsChange,
}: SearchBarProps) {
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
      // #태그 파싱
      const tagMatches = inputValue.match(/#[\w가-힣]+/g)
      if (tagMatches && tagMatches.length > 0 && onTagsChange) {
        const newTags = tagMatches.map(t => t.slice(1)) // # 제거
        const uniqueTags = [...new Set([...tags, ...newTags])] // 중복 제거

        // 태그 부분 제거하고 나머지 키워드만 남김
        const keywordOnly = inputValue.replace(/#[\w가-힣]+/g, '').trim()
        setInputValue(keywordOnly)

        // 태그와 키워드를 함께 전달 (한 번의 URL 업데이트로 처리)
        onTagsChange(uniqueTags, keywordOnly)
      } else {
        onChange(inputValue)
      }
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    if (onTagsChange) {
      onTagsChange(tags.filter(tag => tag !== tagToRemove))
    }
  }

  return (
    <div className="flex flex-col gap-2">
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
            placeholder={onTagsChange ? '검색어 또는 #태그 입력' : placeholder}
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

      {/* 태그 뱃지 목록 */}
      {tags.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5">
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
          {tags.length > 1 && (
            <button
              type="button"
              onClick={() => onTagsChange?.([])}
              className="text-xs font-medium text-gray-500 transition-colors hover:text-gray-700"
            >
              전체 해제
            </button>
          )}
        </div>
      )}
    </div>
  )
}
