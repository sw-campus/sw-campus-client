'use client'

import { useRef } from 'react'

import Image from 'next/image'
import Link from 'next/link'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import type { Swiper as SwiperType } from 'swiper'
import 'swiper/css'
import { Swiper, SwiperSlide } from 'swiper/react'

import { useBannersByTypeQuery } from '../hooks/useBannerQuery'

/**
 * 배너 링크 URL을 반환하는 함수
 * url이 있으면 해당 URL로, 없으면 강의 상세 페이지로 이동
 */
function getBannerLink(banner: { url: string | null; lectureId: number }): string {
  return banner.url || `/lectures/${banner.lectureId}`
}

/**
 * 외부 링크 여부 확인
 */
function isExternalLink(url: string): boolean {
  return url.startsWith('http://') || url.startsWith('https://')
}

export default function SmallBanner() {
  const swiperRef = useRef<SwiperType | null>(null)
  const { data: banners, isLoading } = useBannersByTypeQuery('SMALL')

  if (isLoading) {
    return (
      <div className="relative mx-auto mt-4 w-full overflow-visible rounded-3xl">
        <div className="flex gap-4 overflow-visible">
          {[0, 1, 2].map(i => (
            <div
              key={i}
              className="bg-muted h-[200px] w-[calc(33.33%-11px)] shrink-0 animate-pulse rounded-2xl border border-gray-200"
            />
          ))}
        </div>
      </div>
    )
  }

  if (!banners || banners.length === 0) {
    return null
  }

  return (
    <div className="relative mx-auto mt-4 w-full rounded-3xl">
      <Swiper
        onBeforeInit={swiper => {
          swiperRef.current = swiper
        }}
        loop={banners.length > 3}
        spaceBetween={16}
        slidesPerView={3}
        breakpoints={{
          0: { slidesPerView: 1 },
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
      >
        {banners.map(banner => {
          const href = getBannerLink(banner)
          const external = isExternalLink(href)

          const content = (
            <div className="relative h-[200px] w-full overflow-hidden rounded-2xl border border-gray-200 bg-white shadow">
              {banner.imageUrl ? (
                <Image src={banner.imageUrl} alt={banner.lectureName} fill className="object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center bg-gray-100">
                  <span className="text-lg font-bold text-gray-600">{banner.lectureName}</span>
                </div>
              )}
            </div>
          )

          return (
            <SwiperSlide key={banner.id}>
              {external ? (
                <a href={href} target="_blank" rel="noopener noreferrer" className="block">
                  {content}
                </a>
              ) : (
                <Link href={href} className="block">
                  {content}
                </Link>
              )}
            </SwiperSlide>
          )
        })}
      </Swiper>

      {/* 커스텀 네비게이션 버튼 */}
      <button
        onClick={() => swiperRef.current?.slidePrev()}
        className="absolute top-1/2 left-0 z-10 -translate-x-4 -translate-y-1/2 rounded-full bg-white/80 p-2.5 shadow-lg transition-all hover:scale-110 hover:text-orange-400 active:scale-95"
        aria-label="이전 슬라이드"
      >
        <FiChevronLeft className="h-5 w-5" />
      </button>
      <button
        onClick={() => swiperRef.current?.slideNext()}
        className="absolute top-1/2 right-0 z-10 translate-x-4 -translate-y-1/2 rounded-full bg-white/80 p-2.5 shadow-lg transition-all hover:scale-110 hover:text-orange-400 active:scale-95"
        aria-label="다음 슬라이드"
      >
        <FiChevronRight className="h-5 w-5" />
      </button>
    </div>
  )
}
