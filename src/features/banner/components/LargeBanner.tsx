'use client'

import Image from 'next/image'
import 'swiper/css'
import 'swiper/css/pagination'
import { Pagination, Autoplay } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'

// TODO: 클릭하면 상세페이지로 이동
const banners = [
  { src: '/images/banners/banner-1.png', bg: '#B7DFFF' },
  { src: '/images/banners/banner-2.png', bg: '#000000' },
  { src: '/images/banners/banner-3.png', bg: '#FFFFFF' },
  { src: '/images/banners/banner-4.jpg', bg: '#EB6E44' },
]

export function LargeBanner() {
  return (
    <div className="mx-auto mt-6 w-full max-w-7xl overflow-hidden rounded-3xl">
      <Swiper
        modules={[Pagination, Autoplay]}
        slidesPerView={1}
        loop
        pagination={{ clickable: true }}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
      >
        {banners.map((banner, index) => (
          <SwiperSlide key={index}>
            <div className="flex h-[200px] w-full items-center justify-center" style={{ backgroundColor: banner.bg }}>
              <Image
                src={banner.src}
                alt={`banner-${index}`}
                width={1920}
                height={400}
                className="h-auto max-h-[200px] w-auto object-contain"
                priority={index === 0}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}
