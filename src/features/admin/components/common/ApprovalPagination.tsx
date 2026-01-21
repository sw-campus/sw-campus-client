'use client'

import { LuChevronLeft, LuChevronRight, LuChevronsLeft, LuChevronsRight } from 'react-icons/lu'

import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface ApprovalPaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function ApprovalPagination({ currentPage, totalPages, onPageChange }: ApprovalPaginationProps) {
  const displayTotalPages = Math.max(1, totalPages)
  const pages: (number | 'ellipsis')[] = []
  const maxVisible = 5

  if (displayTotalPages <= maxVisible + 2) {
    for (let i = 0; i < displayTotalPages; i++) pages.push(i)
  } else {
    pages.push(0)

    let start = Math.max(1, currentPage - 2)
    let end = Math.min(displayTotalPages - 2, currentPage + 2)

    if (currentPage < 3) {
      end = Math.min(4, displayTotalPages - 2)
    }
    if (currentPage > displayTotalPages - 4) {
      start = Math.max(1, displayTotalPages - 5)
    }

    if (start > 1) pages.push('ellipsis')

    for (let i = start; i <= end; i++) pages.push(i)

    if (end < displayTotalPages - 2) pages.push('ellipsis')

    pages.push(displayTotalPages - 1)
  }

  const isFirst = currentPage === 0
  const isLast = currentPage >= displayTotalPages - 1

  return (
    <div className="flex flex-col items-center gap-3 sm:gap-4">
      {/* 페이지네이션 버튼 - 모바일에서 가로 스크롤 */}
      <div className="-mx-4 w-full overflow-x-auto px-4 sm:mx-0 sm:w-auto sm:overflow-visible sm:px-0">
        <div className="flex items-center justify-center gap-0.5 sm:gap-1">
          {/* 처음 */}
          <Button variant="outline" size="sm" onClick={() => onPageChange(0)} disabled={isFirst} className="h-8 w-8 shrink-0 sm:h-9 sm:w-9">
            <LuChevronsLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </Button>
          {/* 이전 */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(Math.max(0, currentPage - 1))}
            disabled={isFirst}
            className="h-8 w-8 shrink-0 sm:h-9 sm:w-9"
          >
            <LuChevronLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </Button>

          {/* 페이지 번호 */}
          {pages.map((page, idx) =>
            page === 'ellipsis' ? (
              <span key={`ellipsis-${idx}`} className="text-muted-foreground px-1 sm:px-2">
                ...
              </span>
            ) : (
              <Button
                key={page}
                variant={currentPage === page ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onPageChange(page)}
                className={`h-8 w-8 shrink-0 text-xs sm:h-9 sm:w-9 sm:text-sm ${
                  currentPage === page ? 'bg-gray-700 text-white hover:bg-gray-600' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {page + 1}
              </Button>
            ),
          )}

          {/* 다음 */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(Math.min(displayTotalPages - 1, currentPage + 1))}
            disabled={isLast}
            className="h-8 w-8 shrink-0 sm:h-9 sm:w-9"
          >
            <LuChevronRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </Button>
          {/* 마지막 */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(displayTotalPages - 1)}
            disabled={isLast}
            className="h-8 w-8 shrink-0 sm:h-9 sm:w-9"
          >
            <LuChevronsRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </Button>
        </div>
      </div>

      {/* Go to page - 페이지가 많을 때만 표시, 모바일에서 숨김 */}
      {displayTotalPages > 5 && (
        <div className="hidden items-center gap-2 sm:flex">
          <span className="text-sm text-gray-500">Go to page:</span>
          <Select value={String(currentPage + 1)} onValueChange={value => onPageChange(Number(value) - 1)}>
            <SelectTrigger className="h-8 w-16">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: displayTotalPages }, (_, i) => (
                <SelectItem key={i} value={String(i + 1)}>
                  {i + 1}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  )
}
