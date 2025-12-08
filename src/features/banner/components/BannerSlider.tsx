'use client'

import 'swiper/css'
import 'swiper/css/navigation'
import { Navigation } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'

const bootcamps = [
  {
    academy: 'IM뱅크',
    title: 'iM Digital Banker Academy 데이터 분석 전문가 양성과정 7-8기',
    desc: '우수 수료생 iM뱅크 채용 우대✨',
    badge: 'D-27',
    date: '1/27 개강 · 무료',
    tag: '내배카',
  },
  {
    academy: '한화시스템',
    title: 'BEYOND SW캠프 24기',
    desc: '요즘 필수 #실무역량 오프라인에서 제대로!',
    badge: 'D-1',
    date: '12/9 개강 · 무료',
    tag: '내배카',
  },
  {
    academy: 'kakao enterprise',
    title: 'AlaaS 마스터 클래스 4기',
    desc: '현직자 특강 & 인턴 기회 제공🔥',
    badge: 'EVENT',
    date: '12/22 개강 · 무료',
    tag: '내배카',
  },
  {
    academy: '중앙정보기술',
    title: '클라우드 풀스택 취업캠프 18기',
    desc: '취업연계 교육 고용24 수강평5.0 이민규 홍순구🔥',
    badge: 'EVENT',
    date: '12/22 개강 · 무료',
    tag: '내배카',
  },
]

export default function BootcampSlider() {
  return (
    <div className="mx-auto mt-6 w-full max-w-7xl rounded-3xl bg-white/40 p-6 shadow-xl backdrop-blur-xl">
      <Swiper
        modules={[Navigation]}
        navigation
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
            <div className="flex h-full flex-col justify-between rounded-2xl border border-gray-200 bg-white p-4 shadow">
              {/* 상단 로고 + 배지 */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-700">{item.academy}</span>
                <span className="rounded-md bg-yellow-300 px-2 py-0.5 text-xs font-semibold">{item.badge}</span>
              </div>

              {/* 제목 */}
              <div className="mt-1 text-base font-bold">{item.title}</div>

              {/* 설명 */}
              <div className="mt-2 rounded-xl bg-gray-100 px-3 py-2 text-sm">{item.desc}</div>

              {/* 날짜 */}
              <div className="mt-3 text-sm text-gray-600">
                {item.date} · 무료 ({item.tag})
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}
