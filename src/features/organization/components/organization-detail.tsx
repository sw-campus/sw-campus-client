'use client'

import { ExternalLink } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import PhotoSlider from '@/features/lecture/components/detail/photo-slider'

import type { OrganizationDetail as OrganizationDetailType } from '../types/organization.type'
import { OrganizationProgramsSection } from './organization-programs-section'
import { OrganizationReviewsSection } from './organization-reviews-section'

interface OrganizationDetailProps {
  organization: OrganizationDetailType
  totalReviews?: number
  totalLectures?: number
}

export function OrganizationDetail({ organization, totalReviews = 0, totalLectures = 0 }: OrganizationDetailProps) {
  // Collect facility images that exist
  const facilityImages = [
    organization.facilityImageUrl,
    organization.facilityImageUrl2,
    organization.facilityImageUrl3,
    organization.facilityImageUrl4,
  ].filter(Boolean) as string[]

  // Use first facility image or default
  const heroImage = '/images/org/organization_detail_banner.jpg'

  return (
    <div className="w-full overflow-hidden">
      {/* ===== HERO BANNER ===== */}
      <div className="relative -mx-4 -mt-4 h-[250px] overflow-hidden md:-mx-6 md:-mt-6">
        <Image src={heroImage} alt={`${organization.name} 시설`} fill sizes="100vw" className="object-cover" priority />
        <div className="absolute inset-0 bg-linear-to-b from-black/50 via-black/40 to-black/60" />

        {/* Text on Image - Glassmorphism */}
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
          <div className="rounded-2xl bg-black/40 px-6 py-4 backdrop-blur-md">
            <span className="mb-1 block text-xs font-medium tracking-widest text-white/90 uppercase">훈련기관</span>
            <h1 className="text-xl font-bold text-white drop-shadow-lg md:text-2xl">{organization.name}</h1>
            {organization.homepage && (
              <Link
                href={organization.homepage}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-primary text-primary-foreground hover:bg-primary/90 mt-3 inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium transition-colors"
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
            className="text-foreground flex-1 border-b-2 border-transparent py-3 text-sm font-normal data-[state=active]:border-b-[#FEB706] data-[state=active]:font-semibold"
          >
            기관 소개
          </TabsTrigger>
          <TabsTrigger
            value="reviews"
            className="text-foreground flex-1 border-b-2 border-transparent py-3 text-sm font-normal data-[state=active]:border-b-[#FEB706] data-[state=active]:font-semibold"
          >
            후기
            {totalReviews > 0 && (
              <span className="text-xs font-normal text-[#888888]">({totalReviews.toLocaleString()})</span>
            )}
          </TabsTrigger>
          <TabsTrigger
            value="programs"
            className="text-foreground flex-1 border-b-2 border-transparent py-3 text-sm font-normal data-[state=active]:border-b-[#FEB706] data-[state=active]:font-semibold"
          >
            등록된 교육
            {totalLectures > 0 && (
              <span className="text-xs font-normal text-[#888888]">({totalLectures.toLocaleString()})</span>
            )}
          </TabsTrigger>
        </TabsList>

        {/* ===== TAB CONTENT ===== */}
        <div className="pt-6 pb-20">
          {/* 기관 소개 */}
          <TabsContent value="intro" className="mt-0">
            <div className="divide-y divide-border px-4 md:px-6">
              {/* 기관 설명 */}
              {organization.description && (
                <section className="py-6 first:pt-0">
                  <h2 className="text-foreground mb-2 text-base font-bold">이런 철학으로 운영해요</h2>
                  <p className="text-muted-foreground text-sm leading-relaxed">{organization.description}</p>
                </section>
              )}

              {/* 시설 이미지 - 슬라이드 */}
              {facilityImages.length > 0 && (
                <section className="py-6">
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
