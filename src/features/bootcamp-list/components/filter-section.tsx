'use client'

import { Search, SlidersHorizontal, ChevronDown } from 'lucide-react'

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
  onSortChange: _onSortChange,
  onFilterClick,
}: FilterSectionProps) {
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
      <button className="w-full h-10 px-4 py-2 bg-white rounded-lg outline outline-1 outline-[#020202] flex items-center justify-between">
        <span className="text-xs text-[#888888]">{sortValue}</span>
        <ChevronDown className="w-4 h-4 text-black" />
      </button>
    </div>
  )
}
