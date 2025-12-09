'use client'

import { useRef } from 'react'

import Link from 'next/link'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import type { Swiper as SwiperType } from 'swiper'
import 'swiper/css'
import { Swiper, SwiperSlide } from 'swiper/react'

const bootcamps = [
  {
    academy: 'IM뱅크',
    title: 'iM Digital Banker Academy 데이터 분석 전문가 양성과정 7-8기',
    desc: '우수 수료생 iM뱅크 채용 우대✨',
    badge: 'D-27',
    date: '1/27',
    tag: '무료(내배카)',
    href: '/',
  },
  {
    academy: '한화시스템',
    title: 'BEYOND SW캠프 24기',
    desc: '요즘 필수 #실무역량 오프라인에서 제대로!',
    badge: 'D-1',
    date: '12/9',
    tag: '무료(내배카)',
    href: '/',
  },
  {
    academy: 'kakao enterprise',
    title: 'AlaaS 마스터 클래스 4기',
    desc: '현직자 특강 & 인턴 기회 제공🔥',
    badge: 'EVENT',
    date: '12/22',
    tag: '무료(내배카)',
    href: '/',
  },
  {
    academy: '중앙정보기술',
    title: '클라우드 풀스택 취업캠프 18기',
    desc: '취업연계 교육 고용24 수강평5.0 이민규 홍순구🔥',
    badge: 'EVENT',
    date: '12/22',
    tag: '무료(내배카)',
    href: '/',
  },
]

export default function SmallBanner() {
  const swiperRef = useRef<SwiperType | null>(null)

  return (
    <div className="relative mx-auto mt-4 w-full rounded-3xl">
      <Swiper
        onBeforeInit={swiper => {
          swiperRef.current = swiper
        }}
        loop
        spaceBetween={16}
        slidesPerView={3}
        breakpoints={{
          0: { slidesPerView: 1.2 },
          768: { slidesPerView: 2.2 },
          1024: { slidesPerView: 3 },
        }}
      >
        {bootcamps.map((item, idx) => (
          <SwiperSlide key={idx}>
            <Link href={item.href} className="block">
              <div className="flex h-[190px] flex-col justify-between rounded-2xl border border-gray-200 bg-white/60 p-5 shadow">
                {/* 상단 로고 + 배지 */}
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-700">{item.academy}</span>
                  <span className="bg-accent rounded-md px-2 py-0.5 text-xs font-semibold">{item.badge}</span>
                </div>

                {/* 제목 */}
                <div className="mt-1 line-clamp-2 text-base font-bold">{item.title}</div>

                {/* 설명 */}
                <div className="mt-2 line-clamp-1 rounded-xl bg-gray-100/70 px-3 py-2 text-sm">{item.desc}</div>

                {/* 날짜 */}
                <div className="mt-3 text-sm text-gray-600">
                  {item.date} 개강 · {item.tag}
                </div>
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* 커스텀 네비게이션 버튼 */}
      <button
        onClick={() => swiperRef.current?.slidePrev()}
        className="absolute top-1/2 left-0 z-10 -translate-x-4 -translate-y-1/2 rounded-full bg-white/30 p-2.5 shadow-lg transition-all hover:scale-10 hover:text-orange-400 active:scale-95"
        aria-label="이전 슬라이드"
      >
        <FiChevronLeft className="h-5 w-5" />
      </button>
      <button
        onClick={() => swiperRef.current?.slideNext()}
        className="absolute top-1/2 right-0 z-10 translate-x-4 -translate-y-1/2 rounded-full bg-white/30 p-2.5 shadow-lg transition-all hover:scale-110 hover:text-orange-400 active:scale-95"
        aria-label="다음 슬라이드"
      >
        <FiChevronRight className="h-5 w-5" />
      </button>
    </div>
  )
}
