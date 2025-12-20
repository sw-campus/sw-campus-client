'use client'

import Image from 'next/image'
import Link from 'next/link'
import 'swiper/css'
import 'swiper/css/pagination'
import { Autoplay, Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'

import { useBannersByTypeQuery } from '../hooks/useBannerQuery'

export default function LargeBanner() {
  const { data: banners, isLoading } = useBannersByTypeQuery('BIG')

  // 로딩 중이거나 데이터 없으면 빈 상태 표시
  if (isLoading) {
    return (
      <div className="mx-auto mt-6 flex h-[210px] w-full max-w-7xl items-center justify-center overflow-hidden rounded-3xl bg-muted">
        <div className="text-muted-foreground">배너 로딩 중...</div>
      </div>
    )
  }

  if (!banners || banners.length === 0) {
    return null
  }

  return (
    <div className="mx-auto mt-6 w-full max-w-7xl overflow-hidden rounded-3xl">
      <Swiper
        modules={[Pagination, Autoplay]}
        slidesPerView={1}
        loop={banners.length > 1}
        pagination={{ clickable: true }}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
      >
        {banners.map((banner, index) => (
          <SwiperSlide key={banner.id}>
            <Link href={`/lectures/${banner.lectureId}`}>
              <div className="relative flex w-full items-center justify-center bg-muted sm:p-10">
                <div className="relative mx-auto h-[130px] w-full">
                  {banner.imageUrl ? (
                    <Image
                      src={banner.imageUrl}
                      alt={banner.lectureName}
                      fill
                      className="object-contain"
                      priority={index === 0}
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <span className="text-xl font-bold">{banner.lectureName}</span>
                    </div>
                  )}
                </div>
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}
