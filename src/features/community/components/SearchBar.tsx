'use client'

import { useState, useEffect } from 'react'

import { FiSearch, FiX } from 'react-icons/fi'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

/**
 * 검색 입력 컴포넌트
 * - 디바운싱 적용 (300ms)
 * - 검색어 초기화 버튼
 */
export function SearchBar({ value, onChange, placeholder = '검색어를 입력하세요' }: SearchBarProps) {
  const [inputValue, setInputValue] = useState(value)

  // 외부에서 value가 변경되면 내부 상태도 업데이트
  useEffect(() => {
    setInputValue(value)
  }, [value])

  // 디바운싱 적용
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
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
        <FiSearch className="h-5 w-5 text-gray-400" />
      </div>
      <input
        type="text"
        value={inputValue}
        onChange={e => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="w-full rounded-full border border-gray-200 bg-white py-2.5 pr-10 pl-10 text-sm text-gray-900 placeholder-gray-400 shadow-sm transition-all hover:border-orange-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 focus:outline-none"
      />
      {inputValue && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
        >
          <FiX className="h-5 w-5" />
        </button>
      )}
    </div>
  )
}
