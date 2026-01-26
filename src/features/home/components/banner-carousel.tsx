'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination, Autoplay } from 'swiper/modules'

import 'swiper/css'
import 'swiper/css/pagination'

import { useBannersByTypeQuery } from '@/features/banner/hooks/use-banner-query'
import type { Banner } from '@/features/banner/types/banner.type'

export function BannerCarousel() {
  const { data: bigBanners } = useBannersByTypeQuery('BIG')
  const { data: middleBanners } = useBannersByTypeQuery('MIDDLE')
  const { data: smallBanners } = useBannersByTypeQuery('SMALL')

  return (
    <section className="flex flex-col gap-3 px-4 py-[30px] md:custom-container">
      {/* 대배너 */}
      {bigBanners && bigBanners.length > 0 && (
        <Swiper
          modules={[Pagination, Autoplay]}
          pagination={{ clickable: true }}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          className="w-full overflow-hidden rounded-lg"
        >
          {bigBanners.map((banner) => (
            <SwiperSlide key={banner.id}>
              <BannerItem banner={banner} height="h-[140px]" />
            </SwiperSlide>
          ))}
        </Swiper>
      )}

      {/* 중배너 */}
      {middleBanners && middleBanners.length > 0 && (
        <Swiper
          modules={[Pagination, Autoplay]}
          pagination={{ clickable: true }}
          autoplay={{ delay: 6000, disableOnInteraction: false }}
          className="w-full overflow-hidden rounded-lg"
        >
          {middleBanners.map((banner) => (
            <SwiperSlide key={banner.id}>
              <BannerItem banner={banner} height="h-[100px]" />
            </SwiperSlide>
          ))}
        </Swiper>
      )}

      {/* 소배너 캐러셀 */}
      {smallBanners && smallBanners.length > 0 && (
        <Swiper
          modules={[Pagination]}
          pagination={{ clickable: true }}
          slidesPerView={1}
          spaceBetween={12}
          className="w-full"
        >
          {smallBanners.map((banner) => (
            <SwiperSlide key={banner.id}>
              <BannerItem banner={banner} height="h-[100px]" />
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </section>
  )
}

interface BannerItemProps {
  banner: Banner
  height?: string
}

function BannerItem({ banner, height = 'h-[100px]' }: BannerItemProps) {
  const href = banner.url || `/lectures/${banner.lectureId}`
  const isExternal = href.startsWith('http://') || href.startsWith('https://')

  const content = (
    <div
      className={`relative ${height} w-full overflow-hidden rounded-lg`}
      style={{ backgroundColor: banner.backgroundColor || '#f3f4f6' }}
    >
      {banner.imageUrl ? (
        <Image
          src={banner.imageUrl}
          alt={banner.lectureName}
          fill
          className="object-cover"
        />
      ) : (
        <div className="flex size-full items-center justify-center">
          <span className="text-sm font-semibold">{banner.lectureName}</span>
        </div>
      )}
    </div>
  )

  if (isExternal) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer">
        {content}
      </a>
    )
  }

  return <Link href={href}>{content}</Link>
}

