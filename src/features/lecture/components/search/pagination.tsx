'use client'

import { ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight } from 'lucide-react'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const displayTotalPages = Math.max(1, totalPages)
  const pages: (number | 'ellipsis')[] = []
  const maxVisible = 5

  if (displayTotalPages <= maxVisible + 2) {
    for (let i = 1; i <= displayTotalPages; i++) pages.push(i)
  } else {
    pages.push(1)

    let start = Math.max(2, currentPage - 2)
    let end = Math.min(displayTotalPages - 1, currentPage + 2)

    if (currentPage < 4) {
      end = Math.min(5, displayTotalPages - 1)
    }
    if (currentPage > displayTotalPages - 3) {
      start = Math.max(2, displayTotalPages - 4)
    }

    if (start > 2) pages.push('ellipsis')

    for (let i = start; i <= end; i++) pages.push(i)

    if (end < displayTotalPages - 1) pages.push('ellipsis')

    pages.push(displayTotalPages)
  }

  const isFirst = currentPage === 1
  const isLast = currentPage >= displayTotalPages

  return (
    <div className="flex items-center gap-1">
      {/* First Button */}
      <button
        onClick={() => onPageChange(1)}
        disabled={isFirst}
        className={`
          w-9 h-9 rounded-lg border border-gray-300 flex items-center justify-center transition-colors
          ${isFirst ? 'opacity-40 cursor-not-allowed' : 'hover:bg-gray-100'}
        `}
      >
        <ChevronsLeft className="w-4 h-4 text-gray-600" />
      </button>

      {/* Previous Button */}
      <button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={isFirst}
        className={`
          w-9 h-9 rounded-lg border border-gray-300 flex items-center justify-center transition-colors
          ${isFirst ? 'opacity-40 cursor-not-allowed' : 'hover:bg-gray-100'}
        `}
      >
        <ChevronLeft className="w-4 h-4 text-gray-600" />
      </button>

      {/* Page Numbers */}
      {pages.map((page, idx) =>
        page === 'ellipsis' ? (
          <span key={`ellipsis-${idx}`} className="px-2 text-gray-400">
            ...
          </span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`
              w-9 h-9 rounded-lg flex items-center justify-center text-sm font-medium transition-colors
              ${page === currentPage
                ? 'bg-gray-700 text-white'
                : 'text-gray-600 hover:bg-gray-100'
              }
            `}
          >
            {page}
          </button>
        )
      )}

      {/* Next Button */}
      <button
        onClick={() => onPageChange(Math.min(displayTotalPages, currentPage + 1))}
        disabled={isLast}
        className={`
          w-9 h-9 rounded-lg border border-gray-300 flex items-center justify-center transition-colors
          ${isLast ? 'opacity-40 cursor-not-allowed' : 'hover:bg-gray-100'}
        `}
      >
        <ChevronRight className="w-4 h-4 text-gray-600" />
      </button>

      {/* Last Button */}
      <button
        onClick={() => onPageChange(displayTotalPages)}
        disabled={isLast}
        className={`
          w-9 h-9 rounded-lg border border-gray-300 flex items-center justify-center transition-colors
          ${isLast ? 'opacity-40 cursor-not-allowed' : 'hover:bg-gray-100'}
        `}
      >
        <ChevronsRight className="w-4 h-4 text-gray-600" />
      </button>
    </div>
  )
}
