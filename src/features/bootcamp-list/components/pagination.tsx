'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const pages = Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1)

  return (
    <div className="flex items-center gap-1.5">
      {/* Previous Button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`
          w-9 h-9 p-[7.5px] rounded-lg overflow-hidden flex items-center justify-center
          ${currentPage === 1
            ? 'bg-[#020202] opacity-30'
            : 'bg-[#020202]'
          }
        `}
      >
        <ChevronLeft className="w-4 h-4 text-[#FEB706]" />
      </button>

      {/* Page Numbers */}
      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`
            w-9 h-9 p-2.5 rounded-lg overflow-hidden flex items-center justify-center
            bg-[#FFFCF4]
          `}
        >
          <span
            className={`
              text-sm
              ${page === currentPage ? 'text-[#FEB706]' : 'text-[#888888]'}
            `}
          >
            {page}
          </span>
        </button>
      ))}

      {/* Next Button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="w-9 h-9 p-[7.5px] bg-[#020202] rounded-lg overflow-hidden flex items-center justify-center"
      >
        <ChevronRight className="w-4 h-4 text-[#FEB706]" />
      </button>
    </div>
  )
}
