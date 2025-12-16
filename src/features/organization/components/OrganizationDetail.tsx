'use client'

import Image from 'next/image'
import Link from 'next/link'

import { Card } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { LectureList } from '@/features/lecture/components/LectureList'
import type { Lecture } from '@/features/lecture/types/lecture.type'

import type { Review } from '../api/mockReviews'
import type { OrganizationDetail as OrganizationDetailType } from '../types/organization.type'

interface OrganizationDetailProps {
  organization: OrganizationDetailType
  lectures?: Lecture[]
  reviews?: Review[]
}

export function OrganizationDetail({ organization, lectures = [], reviews = [] }: OrganizationDetailProps) {
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
            <section>
              <h2 className="text-foreground mb-6 text-xl font-bold">수강생 분들의 솔직한 후기예요.</h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {reviews.map(review => (
                  <Card
                    key={review.id}
                    className="group bg-card/40 flex flex-col justify-between border-0 p-5 shadow-sm backdrop-blur-xl transition-all duration-200 hover:scale-[1.02] hover:shadow-lg"
                  >
                    <div>
                      {/* Quote mark */}
                      <span className="text-primary/30 mb-2 block text-4xl leading-none select-none">"</span>
                      {/* Quote text */}
                      <h3 className="text-foreground mb-3 text-base leading-snug font-bold">{review.quote}</h3>
                      {/* Description */}
                      <p className="text-muted-foreground mb-4 line-clamp-3 text-sm leading-relaxed">
                        {review.description}
                      </p>
                    </div>
                    {/* Author */}
                    <div className="border-border/30 flex items-center gap-3 border-t pt-4">
                      <div className="bg-primary/10 text-primary flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold">
                        {review.author.charAt(0)}
                      </div>
                      <div>
                        <p className="text-foreground text-sm font-semibold">{review.author}</p>
                        <p className="text-muted-foreground text-xs">{review.role}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </section>
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
