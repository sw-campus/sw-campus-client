'use client'

import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'

interface PaginationProps {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null

  return (
    <div className="mt-6 flex items-center justify-center gap-1 sm:mt-8 sm:gap-2">
      <button
        onClick={() => onPageChange(Math.max(0, page - 1))}
        disabled={page === 0}
        className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 transition-all hover:border-orange-300 hover:bg-orange-50 hover:text-orange-600 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-gray-200 disabled:hover:bg-white disabled:hover:text-gray-600 sm:h-9 sm:w-9"
        aria-label="이전 페이지"
      >
        <FiChevronLeft className="h-4 w-4" />
      </button>

      <div className="flex items-center gap-0.5 sm:gap-1">
        {(() => {
          const maxVisible = 5
          let start = Math.max(0, page - Math.floor(maxVisible / 2))
          const end = Math.min(totalPages - 1, start + maxVisible - 1)
          if (end - start + 1 < maxVisible) {
            start = Math.max(0, end - maxVisible + 1)
          }
          const pages = []
          for (let i = start; i <= end; i++) {
            pages.push(i)
          }
          return pages.map(pageNum => (
            <button
              key={pageNum}
              onClick={() => onPageChange(pageNum)}
              className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium transition-all active:scale-95 sm:h-9 sm:w-9 sm:text-sm ${
                pageNum === page
                  ? 'bg-orange-500 text-white shadow-md shadow-orange-200'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {pageNum + 1}
            </button>
          ))
        })()}
      </div>

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages - 1}
        className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 transition-all hover:border-orange-300 hover:bg-orange-50 hover:text-orange-600 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-gray-200 disabled:hover:bg-white disabled:hover:text-gray-600 sm:h-9 sm:w-9"
        aria-label="다음 페이지"
      >
        <FiChevronRight className="h-4 w-4" />
      </button>
    </div>
  )
}
