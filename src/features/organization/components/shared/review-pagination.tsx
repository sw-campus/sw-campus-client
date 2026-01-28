import { ChevronLeft, ChevronRight } from 'lucide-react'

import { Button } from '@/components/ui/button'

interface ReviewPaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function ReviewPagination({ currentPage, totalPages, onPageChange }: ReviewPaginationProps) {
  const displayTotalPages = Math.max(1, totalPages)
  const pages: (number | 'ellipsis')[] = []
  const maxVisible = 5

  if (displayTotalPages <= maxVisible + 2) {
    for (let i = 0; i < displayTotalPages; i++) pages.push(i)
  } else {
    pages.push(0)
    let start = Math.max(1, currentPage - 2)
    let end = Math.min(displayTotalPages - 2, currentPage + 2)
    if (currentPage < 3) end = Math.min(4, displayTotalPages - 2)
    if (currentPage > displayTotalPages - 4) start = Math.max(1, displayTotalPages - 5)
    if (start > 1) pages.push('ellipsis')
    for (let i = start; i <= end; i++) pages.push(i)
    if (end < displayTotalPages - 2) pages.push('ellipsis')
    pages.push(displayTotalPages - 1)
  }

  return (
    <div className="mt-8 flex items-center justify-center gap-1">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(Math.max(0, currentPage - 1))}
        disabled={currentPage === 0}
        aria-label="이전 페이지"
      >
        <ChevronLeft className="h-4 w-4" />
        이전
      </Button>
      {pages.map((page, idx) =>
        page === 'ellipsis' ? (
          <span key={`ellipsis-${idx}`} className="text-muted-foreground px-2">
            ...
          </span>
        ) : (
          <Button
            key={page}
            variant={currentPage === page ? 'default' : 'outline'}
            size="sm"
            onClick={() => onPageChange(page)}
            className="min-w-[36px]"
            aria-label={`${page + 1}페이지로 이동`}
            aria-current={currentPage === page ? 'page' : undefined}
          >
            {page + 1}
          </Button>
        ),
      )}
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(Math.min(displayTotalPages - 1, currentPage + 1))}
        disabled={currentPage >= displayTotalPages - 1}
        aria-label="다음 페이지"
      >
        다음
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  )
}
