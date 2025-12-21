'use client'

import { useRef } from 'react'

import Image from 'next/image'
import Link from 'next/link'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import type { Swiper as SwiperType } from 'swiper'
import 'swiper/css'
import { Swiper, SwiperSlide } from 'swiper/react'

import SmallBanner from '@/features/banner/components/SmallBanner'

import { useBannersByTypeQuery } from '../hooks/useBannerQuery'

/**
 * 날짜 포맷팅 (MM/DD 형식)
 */
function formatDate(dateString: string): string {
  const date = new Date(dateString)
  const month = date.getMonth() + 1
  const day = date.getDate()
  return `${month}/${day}`
}

/**
 * 모집 유형에 따른 태그 텍스트
 */
function getRecruitTag(recruitType: string): string {
  switch (recruitType) {
    case 'CARD_REQUIRED':
      return '내배카 필요 O'
    case 'GENERAL':
      return '내배카 필요 X'
    default:
      return ''
  }
}

export default function MidBanner() {
  const swiperRef = useRef<SwiperType | null>(null)
  const { data: banners, isLoading } = useBannersByTypeQuery('SMALL')

  if (isLoading) {
    return (
      <div className="custom-container">
        <div className="custom-card">
          <div className="flex gap-4 overflow-visible">
            {[0, 1].map(i => (
              <div
                key={i}
                className="bg-muted flex h-[190px] w-[calc(50%-8px)] shrink-0 animate-pulse items-center justify-between rounded-2xl border border-gray-200 p-8"
              />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!banners || banners.length === 0) {
    return null
  }

  return (
    <div className="custom-container overflow-visible">
      <div className="custom-card overflow-visible">
        {/* 중형 배너 슬라이더 */}
        <div className="relative">
          <Swiper
            onBeforeInit={swiper => {
              swiperRef.current = swiper
            }}
            loop={banners.length > 2}
            spaceBetween={16}
            slidesPerView={2}
            breakpoints={{
              0: { slidesPerView: 1 },
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 2 },
            }}
          >
            {banners.map(banner => (
              <SwiperSlide key={banner.id}>
                <Link href={`/lectures/${banner.lectureId}`} className="block">
                  <div className="flex h-[190px] items-center justify-between rounded-2xl border border-gray-200 bg-white px-8 py-5 shadow-lg">
                    <div className="flex min-w-0 flex-col">
                      {/* 기관명 - 주황색 */}
                      <div className="font-semibold text-orange-600">{banner.orgName ?? ''}</div>

                      {/* 강의명 */}
                      <div className="mt-1 line-clamp-2 text-lg font-bold">{banner.lectureName}</div>

                      {/* 설명 - 회색 배경 라운드 박스 */}
                      <div className="mt-2 line-clamp-2 rounded-xl bg-gray-100 px-3 py-2 text-sm">{banner.content}</div>

                      {/* 개강일 */}
                      <div className="mt-2 text-sm text-gray-600">
                        {formatDate(banner.lectureStartAt)} 개강 · {getRecruitTag(banner.recruitType)}
                      </div>
                    </div>

                    {/* 오른쪽 이미지 */}
                    {banner.imageUrl && (
                      <Image
                        src={banner.imageUrl}
                        width={95}
                        height={95}
                        alt={banner.lectureName}
                        className="h-[95px] w-[95px] shrink-0 rounded-xl object-cover"
                      />
                    )}
                  </div>
                </Link>
              </SwiperSlide>
            ))}
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

        {/* 작은 배너 */}
        <SmallBanner />
      </div>
    </div>
  )
}
