'use client'

import { LuChevronLeft, LuChevronRight } from 'react-icons/lu'

import { Button } from '@/components/ui/button'

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
    // 페이지가 적으면 모두 표시
    for (let i = 0; i < displayTotalPages; i++) pages.push(i)
  } else {
    // 첫 페이지
    pages.push(0)

    // 현재 페이지 주변 (앞뒤로 2개씩)
    let start = Math.max(1, currentPage - 2)
    let end = Math.min(displayTotalPages - 2, currentPage + 2)

    // 처음에 가까우면 더 많이 보여주기
    if (currentPage < 3) {
      end = Math.min(4, displayTotalPages - 2)
    }
    // 끝에 가까우면 더 많이 보여주기
    if (currentPage > displayTotalPages - 4) {
      start = Math.max(1, displayTotalPages - 5)
    }

    // 시작 부분 생략
    if (start > 1) pages.push('ellipsis')

    // 중간 페이지들
    for (let i = start; i <= end; i++) pages.push(i)

    // 끝 부분 생략
    if (end < displayTotalPages - 2) pages.push('ellipsis')

    // 마지막 페이지
    pages.push(displayTotalPages - 1)
  }

  return (
    <div className="flex items-center justify-center gap-1">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(Math.max(0, currentPage - 1))}
        disabled={currentPage === 0}
      >
        <LuChevronLeft className="h-4 w-4" />
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
      >
        다음
        <LuChevronRight className="h-4 w-4" />
      </Button>
    </div>
  )
}
