'use client'

import { useState } from 'react'

import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'

import { Card } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { LectureCard as BootcampLectureCard } from '@/features/bootcamp-list/components/lecture-card'
import { useUnifiedAddToCart } from '@/features/cart/hooks/use-unified-add-to-cart'
import { useUnifiedCart } from '@/features/cart/hooks/use-unified-cart'
import { useUnifiedRemoveFromCart } from '@/features/cart/hooks/use-unified-remove-from-cart'
import { LectureListItem } from '@/features/lecture/components/lecture-list-item'
import { mapLectureResponseToSummary } from '@/features/lecture/utils/map-lecture-response-to-summary'

import { fetchOrganizationLectures, type LectureSortType } from '../api/organization-api'

import { ReviewPagination } from './shared/review-pagination'

const PROGRAMS_PAGE_SIZE = 12

interface OrganizationProgramsSectionProps {
  organizationId: number
}

export function OrganizationProgramsSection({ organizationId }: OrganizationProgramsSectionProps) {
  const router = useRouter()
  const [currentPage, setCurrentPage] = useState(0)
  const [sortType, setSortType] = useState<LectureSortType>('LATEST')

  // 장바구니 훅
  const { items: cartItems } = useUnifiedCart()
  const { addToCart, isPending: isAddPending } = useUnifiedAddToCart()
  const { mutate: removeFromCart, isPending: isRemovePending } = useUnifiedRemoveFromCart()

  const {
    data: lectureData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['organization', organizationId, 'lectures', currentPage, PROGRAMS_PAGE_SIZE, sortType],
    queryFn: () => fetchOrganizationLectures(organizationId, currentPage, PROGRAMS_PAGE_SIZE, sortType),
    staleTime: 1000 * 60,
  })

  const handleSortChange = (value: LectureSortType) => {
    setSortType(value)
    setCurrentPage(0)
  }

  const handleCompare = () => {
    router.push('/cart/compare')
  }

  const isInCart = (lectureId: string) => {
    return cartItems.some(item => String(item.lectureId) === String(lectureId))
  }

  const lectures = lectureData?.lectures ?? []
  const totalCount = lectureData?.page?.totalElements ?? 0
  const totalPages = lectureData?.page?.totalPages ?? 0

  if (isLoading) {
    return (
      <section className="px-4 md:px-6">
        <div className="text-muted-foreground py-12 text-center text-sm">프로그램을 불러오는 중...</div>
      </section>
    )
  }

  if (isError) {
    return (
      <section className="px-4 md:px-6">
        <Card className="bg-card flex h-48 flex-col items-center justify-center rounded-xl border text-center">
          <div className="mb-3 text-4xl">⚠️</div>
          <p className="text-destructive text-base font-medium">프로그램 목록을 불러오는 데 실패했습니다.</p>
          <p className="text-muted-foreground mt-2 text-sm">잠시 후 다시 시도해주세요.</p>
        </Card>
      </section>
    )
  }

  if (lectures.length === 0 && currentPage === 0) {
    return (
      <section className="px-4 md:px-6">
        <Card className="bg-card flex h-48 flex-col items-center justify-center rounded-xl border text-center">
          <div className="mb-3 text-4xl">📚</div>
          <p className="text-foreground text-base font-medium">등록된 프로그램이 없습니다.</p>
          <p className="text-muted-foreground mt-2 text-sm">추후 새로운 프로그램이 개설되면 업데이트됩니다.</p>
        </Card>
      </section>
    )
  }

  return (
    <section className="px-4 md:px-6">
      {/* Header with title and sort */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground text-sm">총 {totalCount}개의 프로그램</p>
          <Select value={sortType} onValueChange={handleSortChange}>
            <SelectTrigger className="border-border h-10 w-auto min-w-[120px]" aria-label="정렬 기준 선택">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="LATEST">최신순</SelectItem>
              <SelectItem value="SCORE_DESC">별점 높은순</SelectItem>
              <SelectItem value="START_SOON">개강 빠른순</SelectItem>
              <SelectItem value="REVIEW_COUNT_DESC">리뷰 많은순</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* 모바일: LectureListItem */}
      <div className="grid w-full min-w-0 grid-cols-1 gap-4 overflow-hidden md:hidden">
        {lectures.map(lecture => (
          <LectureListItem key={lecture.lectureId} lecture={lecture} />
        ))}
      </div>
      {/* 데스크탑: BootcampLectureCard (variant='desktop') */}
      <div className="hidden gap-4 md:grid md:grid-cols-2 lg:grid-cols-4">
        {lectures.map(lecture => {
          const lectureSummary = mapLectureResponseToSummary(lecture)
          const lectureId = String(lecture.lectureId)
          return (
            <BootcampLectureCard
              key={lecture.lectureId}
              lecture={lectureSummary}
              variant="desktop"
              isInCart={isInCart(lectureId)}
              onAddToCart={() => addToCart({ lectureId })}
              onRemoveFromCart={() => removeFromCart(lectureId)}
              onCompare={handleCompare}
              isPending={isAddPending || isRemovePending}
            />
          )
        })}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <ReviewPagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      )}
    </section>
  )
}
