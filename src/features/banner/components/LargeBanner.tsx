'use client'

import Image from 'next/image'
import Link from 'next/link'
import 'swiper/css'
import 'swiper/css/pagination'
import { Autoplay, Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'

import { trackBannerClick } from '@/lib/analytics'

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

export default function LargeBanner() {
  const { data: banners, isLoading } = useBannersByTypeQuery('BIG')

  // 로딩 중이거나 데이터 없으면 빈 상태 표시
  if (isLoading) {
    return (
      <div className="bg-muted mx-auto mt-6 flex h-[210px] w-full max-w-7xl items-center justify-center overflow-hidden rounded-3xl">
        <div className="text-muted-foreground">배너 로딩 중...</div>
      </div>
    )
  }

  if (!banners || banners.length === 0) {
    return null
  }

  const handleBannerClick = (banner: (typeof banners)[0]) => {
    trackBannerClick({
      bannerId: banner.id,
      bannerType: 'BIG',
      bannerName: banner.lectureName,
      lectureId: banner.lectureId,
      url: banner.url,
    })
  }

  return (
    <div className="mx-auto mt-6 w-full max-w-7xl overflow-hidden rounded-3xl">
      <Swiper
        modules={[Pagination, Autoplay]}
        slidesPerView={1}
        loop={true}
        pagination={{ clickable: true }}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
      >
        {banners.map((banner, index) => {
          const href = getBannerLink(banner)
          const external = isExternalLink(href)

          const content = (
            <div className="relative h-[210px] w-full overflow-hidden">
              {banner.imageUrl ? (
                <Image
                  src={banner.imageUrl}
                  alt={banner.lectureName}
                  fill
                  sizes="(max-width: 1280px) 100vw, 1280px"
                  className="object-cover"
                  priority={index === 0}
                />
              ) : (
                <div className="flex h-full items-center justify-center bg-gray-100">
                  <span className="text-xl font-bold">{banner.lectureName}</span>
                </div>
              )}
            </div>
          )

          return (
            <SwiperSlide key={banner.id}>
              {external ? (
                <a href={href} target="_blank" rel="noopener noreferrer" onClick={() => handleBannerClick(banner)}>
                  {content}
                </a>
              ) : (
                <Link href={href} onClick={() => handleBannerClick(banner)}>
                  {content}
                </Link>
              )}
            </SwiperSlide>
          )
        })}
      </Swiper>
    </div>
  )
}
