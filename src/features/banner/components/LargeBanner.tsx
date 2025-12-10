'use client'

import Image from 'next/image'
import Link from 'next/link'
import 'swiper/css'
import 'swiper/css/pagination'
import { Pagination, Autoplay } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'

const banners = [
  { src: '/images/large-banner/banner-1.png', bg: '#B7DFFF', href: '/' },
  { src: '/images/large-banner/banner-2.png', bg: '#000000', href: '/' },
  { src: '/images/large-banner/banner-3.png', bg: '#FFFFFF', href: '/' },
  { src: '/images/large-banner/banner-4.jpg', bg: '#EB6E44', href: '/' },
]

export default function LargeBanner() {
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
            <Link href={banner.href}>
              <div
                className="relative flex w-full items-center justify-center sm:p-10"
                style={{ backgroundColor: banner.bg }}
              >
                <div className="relative mx-auto h-[130px] w-full">
                  <Image
                    src={banner.src}
                    alt={`banner-${index}`}
                    fill
                    className="object-contain"
                    priority={index === 0}
                  />
                </div>
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}
