'use client'

import Image from 'next/image'
import Link from 'next/link'
import 'swiper/css'
import 'swiper/css/navigation'
import { Autoplay, Navigation } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'

import { trackBannerClick } from '@/lib/analytics'

import { useBannersByTypeQuery } from '../hooks/use-banner-query'

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

export default function SmallBanner() {
  const { data: banners, isLoading } = useBannersByTypeQuery('SMALL')

  if (isLoading) {
    return (
      <div className="relative flex w-full gap-2 overflow-visible">
        {[0, 1, 2].map(i => (
          <div
            key={i}
            className="bg-muted h-[90px] w-[calc(33.33%-11px)] shrink-0 animate-pulse border border-gray-200 md:h-[150px]"
          />
        ))}
      </div>
    )
  }

  if (!banners || banners.length === 0) {
    return null
  }

  const handleBannerClick = (banner: (typeof banners)[0]) => {
    trackBannerClick({
      bannerId: banner.id,
      bannerType: 'SMALL',
      bannerName: banner.lectureName,
      lectureId: banner.lectureId,
      url: banner.url,
    })
  }

  return (
    <div className="relative w-full">
      <Swiper
        modules={[Autoplay, Navigation]}
        rewind={true}
        navigation={true}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        spaceBetween={8}
        slidesPerView={2}
        breakpoints={{
          768: {
            slidesPerView: 4,
          },
        }}
      >
        {banners.map(banner => {
          const href = getBannerLink(banner)
          const external = isExternalLink(href)

          const content = (
            <div
              className="relative h-[90px] w-full overflow-hidden border border-gray-200 shadow md:h-[150px]"
              style={{ backgroundColor: banner.backgroundColor || '#ffffff' }}
            >
              {banner.imageUrl ? (
                <Image
                  src={banner.imageUrl}
                  alt={banner.lectureName}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-contain"
                />
              ) : (
                <div className="flex h-full items-center justify-center bg-gray-100">
                  <span className="text-lg font-bold text-gray-600">{banner.lectureName}</span>
                </div>
              )}
            </div>
          )

          return (
            <SwiperSlide key={banner.id}>
              {external ? (
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                  onClick={() => handleBannerClick(banner)}
                >
                  {content}
                </a>
              ) : (
                <Link href={href} className="block" onClick={() => handleBannerClick(banner)}>
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
