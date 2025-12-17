'use client'

import { useState } from 'react'

import { useQuery } from '@tanstack/react-query'
import { ChevronDown, ChevronUp, Star } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import { Card } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { getOrganizationReviews } from '@/features/lecture/api/reviewApi.client'
import { CATEGORY_LABELS, type Review } from '@/features/lecture/api/reviewApi.types'
import { LectureList } from '@/features/lecture/components/LectureList'
import { formatDate, StarRating } from '@/features/lecture/components/detail/DetailShared'
import type { Lecture } from '@/features/lecture/types/lecture.type'

import type { OrganizationDetail as OrganizationDetailType } from '../types/organization.type'

interface OrganizationDetailProps {
  organization: OrganizationDetailType
  lectures?: Lecture[]
}

function OrganizationReviewCard({ review }: { review: Review }) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <Card className="group bg-card/40 flex flex-col border-0 p-5 shadow-sm backdrop-blur-xl transition-all duration-200 hover:scale-[1.02] hover:shadow-lg">
      {/* Header: Rating */}
      <div className="mb-4 flex items-center gap-2">
        <StarRating score={review.score} />
        <span className="text-lg font-bold text-yellow-500">{review.score.toFixed(1)}</span>
      </div>

      {/* Content: Comment */}
      <p className="text-muted-foreground mb-4 flex-1 text-sm leading-relaxed">{review.comment}</p>

      {/* Detail Scores Toggle */}
      {review.detailScores && review.detailScores.length > 0 && (
        <>
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-primary hover:text-primary/80 mb-3 flex items-center gap-1 text-xs font-medium transition-colors"
          >
            {isExpanded ? (
              <>
                상세 점수 접기 <ChevronUp className="h-4 w-4" />
              </>
            ) : (
              <>
                상세 점수 보기 <ChevronDown className="h-4 w-4" />
              </>
            )}
          </button>

          {isExpanded && (
            <div className="mb-4 space-y-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
              {review.detailScores.map(detail => (
                <div key={detail.category} className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-800">
                      {CATEGORY_LABELS[detail.category] || detail.category}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <StarRating score={detail.score} size="sm" />
                      <span className="min-w-[2rem] text-right text-sm font-bold text-yellow-500">
                        {detail.score.toFixed(1)}
                      </span>
                    </div>
                  </div>
                  {detail.comment && (
                    <p className="rounded-md bg-gray-50 px-3 py-2 text-sm leading-relaxed text-gray-600">
                      {detail.comment}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Footer: Author */}
      <div className="border-border/30 flex items-center gap-3 border-t pt-4">
        <div className="bg-primary/10 text-primary flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold">
          {review.nickname.charAt(0)}
        </div>
        <div>
          <p className="text-foreground text-sm font-semibold">{review.nickname}</p>
          <p className="text-muted-foreground text-xs">{formatDate(review.createdAt)}</p>
        </div>
      </div>
    </Card>
  )
}

function OrganizationReviewsSection({ organizationId }: { organizationId: number }) {
  const {
    data: reviews,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['organizationReviews', organizationId],
    queryFn: () => getOrganizationReviews(organizationId),
    staleTime: 1000 * 60,
  })

  if (isLoading) {
    return (
      <section>
        <h2 className="text-foreground mb-6 text-xl font-bold">수강생 분들의 솔직한 후기예요.</h2>
        <div className="text-muted-foreground py-12 text-center text-sm">후기를 불러오는 중...</div>
      </section>
    )
  }

  if (isError) {
    return (
      <section>
        <h2 className="text-foreground mb-6 text-xl font-bold">수강생 분들의 솔직한 후기예요.</h2>
        <div className="text-destructive py-12 text-center text-sm">후기를 불러오지 못했습니다.</div>
      </section>
    )
  }

  if (!reviews || reviews.length === 0) {
    return (
      <section>
        <h2 className="text-foreground mb-6 text-xl font-bold">수강생 분들의 솔직한 후기예요.</h2>
        <Card className="bg-card/40 flex h-60 flex-col items-center justify-center border-0 text-center shadow-sm backdrop-blur-xl">
          <div className="mb-3 text-4xl">💬</div>
          <p className="text-foreground text-lg font-medium">아직 작성된 후기가 없습니다.</p>
          <p className="text-muted-foreground mt-2 text-sm">첫 번째 후기를 남겨보세요!</p>
        </Card>
      </section>
    )
  }

  return (
    <section>
      <h2 className="text-foreground mb-6 text-xl font-bold">수강생 분들의 솔직한 후기예요.</h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {reviews.map(review => (
          <OrganizationReviewCard key={review.reviewId} review={review} />
        ))}
      </div>
    </section>
  )
}

export function OrganizationDetail({ organization, lectures = [] }: OrganizationDetailProps) {
  // Collect facility images that exist
  const facilityImages = [
    organization.facilityImageUrl,
    organization.facilityImageUrl2,
    organization.facilityImageUrl3,
    organization.facilityImageUrl4,
  ].filter(Boolean) as string[]

  // Use first facility image as hero background, or a default
  const heroImage = facilityImages[0] || `https://picsum.photos/seed/${organization.id}/1200/400`

  return (
    <div className="w-full">
      {/* ===== HERO BANNER ===== */}
      <div className="relative -mx-6 -mt-6 mb-8 h-56 overflow-hidden rounded-t-xl md:h-72">
        <Image src={heroImage} alt={`${organization.name} 배경`} fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/20" />

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          {/* Logo */}
          <div className="mb-4 flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-white shadow-lg ring-4 ring-white/20 md:h-24 md:w-24">
            {organization.logoUrl ? (
              <Image
                src={organization.logoUrl}
                alt={organization.name}
                width={96}
                height={96}
                className="h-full w-full object-contain p-2"
              />
            ) : (
              <span className="text-4xl">🏢</span>
            )}
          </div>

          {/* Name */}
          <h1 className="mb-4 text-2xl font-bold text-white drop-shadow-lg md:text-3xl">{organization.name}</h1>

          {/* Homepage Button */}
          <Link
            href={organization.homepage || '#'}
            target={organization.homepage ? '_blank' : undefined}
            rel={organization.homepage ? 'noopener noreferrer' : undefined}
            className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-6 py-2.5 text-sm font-semibold shadow-lg transition-all duration-200 hover:scale-105"
          >
            홈페이지 바로가기
          </Link>
        </div>
      </div>

      {/* ===== ACCESSIBLE TABS (Radix UI) ===== */}
      <Tabs defaultValue="intro" className="w-full">
        <TabsList className="no-scrollbar mb-8 flex h-auto w-full gap-3 overflow-x-auto bg-transparent p-0 whitespace-nowrap">
          <TabsTrigger
            value="intro"
            className="data-[state=active]:bg-foreground data-[state=active]:text-background data-[state=inactive]:bg-card/60 data-[state=inactive]:text-muted-foreground hover:bg-card/80 hover:text-foreground rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-200 data-[state=active]:shadow-md"
          >
            기관 소개
          </TabsTrigger>
          <TabsTrigger
            value="reviews"
            className="data-[state=active]:bg-foreground data-[state=active]:text-background data-[state=inactive]:bg-card/60 data-[state=inactive]:text-muted-foreground hover:bg-card/80 hover:text-foreground rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-200 data-[state=active]:shadow-md"
          >
            수강생 후기
          </TabsTrigger>
          <TabsTrigger
            value="programs"
            className="data-[state=active]:bg-foreground data-[state=active]:text-background data-[state=inactive]:bg-card/60 data-[state=inactive]:text-muted-foreground hover:bg-card/80 hover:text-foreground rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-200 data-[state=active]:shadow-md"
          >
            등록된 프로그램
          </TabsTrigger>
        </TabsList>

        {/* ===== TAB CONTENT ===== */}
        <div className="pb-20">
          {/* 기관 소개 */}
          <TabsContent value="intro">
            <div className="space-y-10">
              {/* Facility Images */}
              {facilityImages.length > 0 && (
                <section>
                  <h2 className="text-foreground mb-5 text-xl font-bold">{organization.name}의 현장이에요.</h2>
                  <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
                    {facilityImages.map((url, index) => (
                      <div
                        key={url}
                        className="group bg-muted aspect-square overflow-hidden rounded-xl shadow-sm transition-all duration-200 hover:shadow-lg"
                      >
                        <Image
                          src={url}
                          alt={`${organization.name} 현장 이미지 ${index + 1}`}
                          width={400}
                          height={400}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Philosophy */}
              <section>
                <h2 className="text-foreground mb-5 text-xl font-bold">이런 철학으로 운영해요</h2>
                <Card className="bg-card/40 border-0 p-6 shadow-sm backdrop-blur-xl transition-all duration-200 hover:shadow-md md:p-8">
                  <p className="text-muted-foreground text-base leading-relaxed whitespace-pre-line md:text-lg">
                    {organization.description}
                  </p>
                </Card>
              </section>
            </div>
          </TabsContent>

          {/* 수강생 후기 */}
          <TabsContent value="reviews">
            <OrganizationReviewsSection organizationId={organization.id} />
          </TabsContent>

          {/* 등록된 프로그램 */}
          <TabsContent value="programs">
            <section>
              {lectures.length > 0 ? (
                <LectureList lectures={lectures} />
              ) : (
                <Card className="bg-card/40 flex h-60 flex-col items-center justify-center border-0 text-center shadow-sm backdrop-blur-xl">
                  <div className="mb-3 text-4xl">📚</div>
                  <p className="text-foreground text-lg font-medium">등록된 프로그램이 없습니다.</p>
                  <p className="text-muted-foreground mt-2 text-sm">추후 새로운 프로그램이 개설되면 업데이트됩니다.</p>
                </Card>
              )}
            </section>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}
