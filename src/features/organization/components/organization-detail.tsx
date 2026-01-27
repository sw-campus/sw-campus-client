'use client'

import { useState } from 'react'

import { useQuery } from '@tanstack/react-query'
import { ChevronDown, ChevronUp, ChevronLeft, ChevronRight, ExternalLink, Star, User } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { getOrganizationReviews } from '@/features/lecture/api/review-api.client'
import {
  CATEGORY_LABELS,
  REVIEW_SORT_LABELS,
  type Review,
  type ReviewSortType,
} from '@/features/lecture/api/review-api.types'
import { LectureCard } from '@/features/lecture/components/lecture-card'
import { LectureListItem } from '@/features/lecture/components/lecture-list-item'
import PhotoSlider from '@/features/lecture/components/detail/photo-slider'
import { mapLectureResponseToSummary } from '@/features/lecture/utils/map-lecture-response-to-summary'

import {
  fetchOrganizationLectures,
  type LectureSortType,
} from '../api/organization-api'
import type { OrganizationDetail as OrganizationDetailType } from '../types/organization.type'

// 별점 컴포넌트
function StarRatingDisplay({ score, size = 'md' }: { score: number; size?: 'sm' | 'md' }) {
  const starSize = size === 'sm' ? 'h-4 w-4' : 'h-[18px] w-[18px]'
  return (
    <div className="flex items-center gap-0">
      {[1, 2, 3, 4, 5].map(i => (
        <Star
          key={i}
          className={`${starSize} ${i <= score ? 'fill-amber-400 text-amber-400' : 'fill-muted text-muted'}`}
        />
      ))}
    </div>
  )
}

interface OrganizationDetailProps {
  organization: OrganizationDetailType
  totalReviews?: number
  totalLectures?: number
}

function OrganizationReviewCard({ review }: { review: Review }) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <Card className="rounded-xl border-0 bg-card p-4 shadow-[4px_4px_15px_0px_rgba(161,161,170,0.25)]">
      {/* Header: User Info + Rating + Lecture Link */}
      <div className="mb-4 flex items-start justify-between">
        <div className="flex items-center gap-3">
          {/* User Avatar */}
          <div className="bg-muted flex h-10 w-10 items-center justify-center rounded-full">
            <User className="text-muted-foreground h-5 w-5" />
          </div>
          {/* User Info */}
          <div>
            <p className="text-foreground text-sm font-medium">ID : {review.nickname}</p>
            <div className="mt-1 flex items-center gap-2">
              <span className="text-sm font-medium text-amber-500">{review.score.toFixed(1)}</span>
              <StarRatingDisplay score={review.score} />
            </div>
          </div>
        </div>
        {/* Lecture Link */}
        <Link
          href={`/lectures/${review.lectureId}#review`}
          className="text-muted-foreground hover:text-foreground flex items-center gap-1 text-xs transition-colors"
        >
          강의 보기
          <ChevronRight className="h-4 w-4" />
        </Link>
      </div>

      {/* Content: Comment */}
      <p className="text-foreground mb-4 text-sm leading-relaxed">{review.comment}</p>

      {/* Detail Scores Toggle */}
      {review.detailScores && review.detailScores.length > 0 && (
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-muted-foreground hover:text-foreground flex items-center gap-1 text-xs transition-colors"
        >
          상세 점수 보기
          {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
      )}

      {/* Detail Scores Expanded */}
      {isExpanded && review.detailScores && review.detailScores.length > 0 && (
        <div className="mt-4 space-y-3 rounded-lg bg-muted p-4">
          {review.detailScores.map(detail => (
            <div key={detail.category} className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-foreground text-sm font-medium">
                  {CATEGORY_LABELS[detail.category] || detail.category}
                </span>
                <div className="flex items-center gap-2">
                  <StarRatingDisplay score={detail.score} size="sm" />
                  <span className="text-sm font-medium text-amber-500">{detail.score.toFixed(1)}</span>
                </div>
              </div>
              {detail.comment && <p className="text-muted-foreground text-sm leading-relaxed">{detail.comment}</p>}
            </div>
          ))}
        </div>
      )}
    </Card>
  )
}

const PAGE_SIZE = 6

function ReviewPagination({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}) {
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

function OrganizationReviewsSection({ organizationId }: { organizationId: number }) {
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
              <SelectTrigger className="h-10 w-auto min-w-[120px] border-border" aria-label="정렬 기준 선택">
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
            <Button asChild size="sm" className="w-full sm:w-auto">
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

const PROGRAMS_PAGE_SIZE = 12

function OrganizationProgramsSection({ organizationId }: { organizationId: number }) {
  const [currentPage, setCurrentPage] = useState(0)
  const [sortType, setSortType] = useState<LectureSortType>('LATEST')

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
            <SelectTrigger className="h-10 w-auto min-w-[120px] border-border" aria-label="정렬 기준 선택">
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
      {/* 데스크탑: LectureCard */}
      <div className="hidden gap-4 md:grid md:grid-cols-2 lg:grid-cols-4">
        {lectures.map(lecture => (
          <LectureCard key={lecture.lectureId} lecture={mapLectureResponseToSummary(lecture)} />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <ReviewPagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      )}
    </section>
  )
}

export function OrganizationDetail({
  organization,
  totalReviews = 0,
  totalLectures = 0,
}: OrganizationDetailProps) {
  // Collect facility images that exist
  const facilityImages = [
    organization.facilityImageUrl,
    organization.facilityImageUrl2,
    organization.facilityImageUrl3,
    organization.facilityImageUrl4,
  ].filter(Boolean) as string[]

  // Use first facility image or default
  const heroImage = facilityImages[0] || `https://picsum.photos/seed/${organization.id}/1200/400`

  return (
    <div className="w-full overflow-hidden">
      {/* ===== HERO BANNER ===== */}
      <div className="relative -mx-4 -mt-4 h-[250px] overflow-hidden md:-mx-6 md:-mt-6">
        <Image
          src={heroImage}
          alt={`${organization.name} 시설`}
          fill
          sizes="100vw"
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/60" />

        {/* Text on Image - Glassmorphism */}
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
          <div className="rounded-2xl bg-black/40 px-6 py-4 backdrop-blur-md">
            <span className="mb-1 block text-xs font-medium uppercase tracking-widest text-white/90">훈련기관</span>
            <h1 className="text-xl font-bold text-white drop-shadow-lg md:text-2xl">{organization.name}</h1>
            {organization.homepage && (
              <Link
                href={organization.homepage}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                홈페이지
                <ExternalLink className="h-3.5 w-3.5" />
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* ===== ACCESSIBLE TABS (Radix UI) ===== */}
      <Tabs defaultValue="intro" className="w-full">
        <TabsList className="flex h-auto w-full border-b border-[#888888]/50">
          <TabsTrigger
            value="intro"
            className="flex-1 border-b-2 border-transparent py-3 text-sm font-normal text-foreground data-[state=active]:border-b-[#FEB706] data-[state=active]:font-semibold"
          >
            기관 소개
          </TabsTrigger>
          <TabsTrigger
            value="reviews"
            className="flex-1 border-b-2 border-transparent py-3 text-sm font-normal text-foreground data-[state=active]:border-b-[#FEB706] data-[state=active]:font-semibold"
          >
            후기
            {totalReviews > 0 && (
              <span className="text-xs font-normal text-[#888888]">({totalReviews.toLocaleString()})</span>
            )}
          </TabsTrigger>
          <TabsTrigger
            value="programs"
            className="flex-1 border-b-2 border-transparent py-3 text-sm font-normal text-foreground data-[state=active]:border-b-[#FEB706] data-[state=active]:font-semibold"
          >
            등록된 교육
            {totalLectures > 0 && (
              <span className="text-xs font-normal text-[#888888]">({totalLectures.toLocaleString()})</span>
            )}
          </TabsTrigger>
        </TabsList>

        {/* ===== TAB CONTENT ===== */}
        <div className="pb-20 pt-6">
          {/* 기관 소개 */}
          <TabsContent value="intro" className="mt-0">
            <div className="space-y-6 px-4 md:px-6">
              {/* 기관 설명 */}
              {organization.description && (
                <section>
                  <h2 className="text-foreground mb-2 text-base font-bold">이런 철학으로 운영해요</h2>
                  <p className="text-muted-foreground text-sm leading-relaxed">{organization.description}</p>
                </section>
              )}

              {/* 시설 이미지 - 슬라이드 */}
              {facilityImages.length > 0 && (
                <section>
                  <h2 className="text-foreground mb-3 text-base font-bold">교육 현장</h2>
                  <PhotoSlider photos={facilityImages} />
                </section>
              )}

            </div>
          </TabsContent>

          {/* 수강생 후기 */}
          <TabsContent value="reviews" className="mt-0">
            <OrganizationReviewsSection organizationId={organization.id} />
          </TabsContent>

          {/* 등록된 프로그램 */}
          <TabsContent value="programs" className="mt-0">
            <OrganizationProgramsSection organizationId={organization.id} />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}

