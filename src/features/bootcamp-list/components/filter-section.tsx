'use client'

import { useState, useRef, useEffect } from 'react'
import { Search, SlidersHorizontal, ChevronDown } from 'lucide-react'

const SORT_OPTIONS = [
  { value: '최신순', label: '최신순' },
  { value: '평점순', label: '평점순' },
  { value: '후기순', label: '후기순' },
]

interface FilterSectionProps {
  searchValue: string
  onSearchChange: (value: string) => void
  onSearch: () => void
  sortValue: string
  onSortChange: (value: string) => void
  onFilterClick: () => void
}

export function FilterSection({
  searchValue,
  onSearchChange,
  onSearch,
  sortValue,
  onSortChange,
  onFilterClick,
}: FilterSectionProps) {
  const [isSortOpen, setIsSortOpen] = useState(false)
  const sortRef = useRef<HTMLDivElement>(null)

  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
        setIsSortOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSortSelect = (value: string) => {
    onSortChange(value)
    setIsSortOpen(false)
  }

  return (
    <div className="w-full flex flex-col gap-2">
      {/* Filter Button */}
      <button
        onClick={onFilterClick}
        className="w-full h-10 p-2.5 bg-[#020202] rounded-lg overflow-hidden flex items-center justify-center gap-2.5"
      >
        <SlidersHorizontal className="w-5 h-5 text-[#FEB706]" />
        <span className="text-xs text-[#FEB706]">Filter</span>
      </button>

      {/* Search Row */}
      <div className="w-full flex items-center gap-2">
        <div className="flex-1 h-10 px-4 py-2 bg-white rounded-lg outline outline-1 outline-[#020202] flex items-center gap-1">
          <Search className="w-4 h-4 text-[#888888]" />
          <input
            type="text"
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="검색어 입력"
            className="flex-1 text-xs text-[#020202] placeholder:text-[#888888] outline-none"
          />
        </div>
        <button
          onClick={onSearch}
          className="h-10 px-4 py-2 bg-[#020202] rounded-lg flex items-center justify-center whitespace-nowrap"
        >
          <span className="text-xs text-white">검색</span>
        </button>
      </div>

      {/* Sort Dropdown */}
      <div ref={sortRef} className="relative">
        <button
          onClick={() => setIsSortOpen(!isSortOpen)}
          className="w-full h-10 px-4 py-2 bg-white rounded-lg outline outline-1 outline-[#020202] flex items-center justify-between"
        >
          <span className="text-xs text-[#020202]">{sortValue}</span>
          <ChevronDown className={`w-4 h-4 text-black transition-transform ${isSortOpen ? 'rotate-180' : ''}`} />
        </button>
        {isSortOpen && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 z-50 overflow-hidden">
            {SORT_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() => handleSortSelect(option.value)}
                className={`w-full px-4 py-2.5 text-xs text-left hover:bg-gray-50 transition-colors ${
                  sortValue === option.value ? 'bg-[#FEB706]/10 text-[#FEB706] font-medium' : 'text-[#020202]'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
