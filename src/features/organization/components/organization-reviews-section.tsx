'use client'

import { useState } from 'react'

import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { getOrganizationReviews } from '@/features/lecture/api/review-api.client'
import { REVIEW_SORT_LABELS, type ReviewSortType } from '@/features/lecture/api/review-api.types'

import { OrganizationReviewCard } from './organization-review-card'
import { ReviewPagination } from './shared/review-pagination'

const PAGE_SIZE = 6

interface OrganizationReviewsSectionProps {
  organizationId: number
}

export function OrganizationReviewsSection({ organizationId }: OrganizationReviewsSectionProps) {
  const [currentPage, setCurrentPage] = useState(0)
  const [sortType, setSortType] = useState<ReviewSortType>('LATEST')

  const {
    data: reviewData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['organizationReviews', organizationId, currentPage, PAGE_SIZE, sortType],
    queryFn: () => getOrganizationReviews(organizationId, currentPage, PAGE_SIZE, sortType),
    staleTime: 1000 * 60,
  })

  const handleSortChange = (value: ReviewSortType) => {
    setSortType(value)
    setCurrentPage(0)
  }

  // 서버에서 블라인드 필터링된 후기 목록을 받음
  const reviews = reviewData?.reviews ?? []
  const totalCount = reviewData?.totalCount ?? 0
  const isUnblinded = reviewData?.isUnblinded ?? false

  // 블라인드 해제 사용자만 페이지네이션 표시
  const totalPages = isUnblinded ? Math.ceil(totalCount / PAGE_SIZE) : 0
  const hiddenCount = isUnblinded ? 0 : Math.max(0, totalCount - reviews.length)

  if (isLoading) {
    return (
      <section className="px-4">
        <h2 className="text-foreground mb-2 text-base font-bold">수강생 분들의 솔직한 후기예요.</h2>
        <div className="text-muted-foreground py-12 text-center text-sm">후기를 불러오는 중...</div>
      </section>
    )
  }

  if (isError) {
    return (
      <section className="px-4">
        <h2 className="text-foreground mb-2 text-base font-bold">수강생 분들의 솔직한 후기예요.</h2>
        <div className="text-destructive py-12 text-center text-sm">후기를 불러오지 못했습니다.</div>
      </section>
    )
  }

  if (reviews.length === 0 && currentPage === 0) {
    return (
      <section className="px-4">
        <h2 className="text-foreground mb-2 text-base font-bold">수강생 분들의 솔직한 후기예요.</h2>
        <Card className="bg-card flex h-48 flex-col items-center justify-center rounded-xl border text-center">
          <div className="mb-3 text-4xl">💬</div>
          <p className="text-foreground text-base font-medium">아직 작성된 후기가 없습니다.</p>
          <p className="text-muted-foreground mt-2 text-sm">첫 번째 후기를 남겨보세요!</p>
        </Card>
      </section>
    )
  }

  return (
    <section className="px-4">
      {/* Header with title and sort */}
      <div className="mb-6">
        <h2 className="text-foreground mb-4 text-base font-bold">수강생 분들의 솔직한 후기예요.</h2>
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground text-sm">총 {totalCount}개의 후기</p>
          {isUnblinded && (
            <Select value={sortType} onValueChange={handleSortChange}>
              <SelectTrigger className="border-border h-10 w-auto min-w-[120px]" aria-label="정렬 기준 선택">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(Object.keys(REVIEW_SORT_LABELS) as ReviewSortType[]).map(key => (
                  <SelectItem key={key} value={key}>
                    {REVIEW_SORT_LABELS[key]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      </div>

      {/* Review Cards - 모바일: 세로, 데스크탑: 3열 그리드 (items-start로 개별 높이 유지) */}
      <div className="space-y-3 md:grid md:grid-cols-3 md:items-start md:gap-4 md:space-y-0">
        {reviews.map(review => (
          <OrganizationReviewCard key={review.reviewId} review={review} />
        ))}
      </div>

      {/* 블라인드 상태 사용자에게 안내 오버레이 */}
      {!isUnblinded && hiddenCount > 0 && (
        <div className="relative mt-4 overflow-hidden rounded-xl border border-gray-200 bg-linear-to-b from-gray-50 to-white p-6 text-center shadow-sm">
          <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-transparent via-white/60 to-white/90" />
          <div className="relative z-10">
            <div className="mb-3 text-4xl">🔒</div>
            <p className="text-foreground mb-1 text-sm font-semibold">{hiddenCount}개의 후기가 더 있습니다</p>
            <p className="text-muted-foreground mb-4 text-xs">
              리뷰를 작성하거나 설문조사를 완료하면 모든 후기를 확인할 수 있어요
            </p>
            <Button asChild size="sm" className="w-full md:w-auto">
              <Link href="/login">로그인하고 후기 더 보기</Link>
            </Button>
          </div>
        </div>
      )}

      {/* Pagination - 블라인드 해제 사용자만 표시 */}
      {isUnblinded && totalPages > 1 && (
        <ReviewPagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      )}
    </section>
  )
}
