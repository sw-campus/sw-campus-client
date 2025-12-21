'use client'

import { useRef } from 'react'

import Link from 'next/link'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import type { Swiper as SwiperType } from 'swiper'
import 'swiper/css'
import { Swiper, SwiperSlide } from 'swiper/react'

import { useBannersByTypeQuery } from '../hooks/useBannerQuery'
import { calculateDday, formatDate, getRecruitTag } from '../utils/bannerUtils'

export default function SmallBanner() {
  const swiperRef = useRef<SwiperType | null>(null)
  const { data: banners, isLoading } = useBannersByTypeQuery('TEXT')

  if (isLoading) {
    return (
      <div className="relative mx-auto mt-4 w-full overflow-visible rounded-3xl">
        <div className="flex gap-4 overflow-visible">
          {[0, 1, 2].map(i => (
            <div
              key={i}
              className="bg-muted h-[190px] w-[calc(33.33%-11px)] shrink-0 animate-pulse rounded-2xl border border-gray-200"
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
          const { text: ddayText, isClosed } = calculateDday(banner.lectureDeadline)

          return (
            <SwiperSlide key={banner.id}>
              <Link href={`/lectures/${banner.lectureId}`} className="block">
                <div className="flex h-[195px] flex-col rounded-2xl border border-gray-200 bg-white/60 p-5 shadow">
                  {/* 상단 콘텐츠 그룹 */}
                  <div>
                    {/* 기관명 + 배지 */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-gray-700">{banner.orgName ?? ''}</span>
                      {/* D-day 배지: 마감은 회색 배경, D-XX는 주황 텍스트 */}
                      <span
                        className={`rounded-md px-2 py-0.5 text-xs font-semibold ${
                          isClosed ? 'bg-gray-400 text-white' : 'bg-orange-100 text-orange-600'
                        }`}
                      >
                        {ddayText}
                      </span>
                    </div>

                    {/* 제목 */}
                    <div className="mt-1 line-clamp-2 text-base font-bold">{banner.lectureName}</div>

                    {/* 설명 - 회색 배경 라운드 박스 */}
                    <div className="mt-2 line-clamp-2 rounded-xl bg-gray-100/70 px-3 py-2 text-sm">
                      {banner.content}
                    </div>
                  </div>

                  {/* 날짜 - mt-auto로 하단에 고정 */}
                  <div className="mt-auto text-sm text-gray-600">
                    {formatDate(banner.lectureStartAt)} 개강 · {getRecruitTag(banner.recruitType)}
                  </div>
                </div>
              </Link>
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
