'use client'

import { useRef } from 'react'

import Link from 'next/link'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import type { Swiper as SwiperType } from 'swiper'
import 'swiper/css'
import { Swiper, SwiperSlide } from 'swiper/react'

import { useBannersByTypeQuery } from '../hooks/useBannerQuery'

/**
 * D-day 계산 (마감일까지 남은 일수)
 */
function calculateDday(deadlineString: string): { text: string; isEvent: boolean } {
  const deadline = new Date(deadlineString)
  const today = new Date()

  // 시간 제거하고 날짜만 비교
  deadline.setHours(0, 0, 0, 0)
  today.setHours(0, 0, 0, 0)

  const diffTime = deadline.getTime() - today.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays < 0) {
    return { text: 'EVENT', isEvent: true }
  } else if (diffDays === 0) {
    return { text: 'D-Day', isEvent: false }
  } else {
    return { text: `D-${diffDays}`, isEvent: false }
  }
}

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
              className="h-[190px] w-[calc(33.33%-11px)] shrink-0 animate-pulse rounded-2xl border border-gray-200 bg-muted"
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
          const { text: ddayText, isEvent } = calculateDday(banner.lectureDeadline)

          return (
            <SwiperSlide key={banner.id}>
              <Link href={`/lectures/${banner.lectureId}`} className="block">
                <div className="flex h-[220px] flex-col justify-between rounded-2xl border border-gray-200 bg-white/60 p-5 shadow">
                  {/* 상단 기관명 + 배지 */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-700">{banner.orgName ?? ''}</span>
                    {/* D-day 배지: EVENT는 주황 배경, D-XX는 주황 텍스트 */}
                    <span
                      className={`rounded-md px-2 py-0.5 text-xs font-semibold ${isEvent
                        ? 'bg-orange-500 text-white'
                        : 'bg-orange-100 text-orange-600'
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

                  {/* 날짜 */}
                  <div className="mt-3 text-sm text-gray-600">
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
