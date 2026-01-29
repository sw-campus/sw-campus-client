'use client'

import Image from 'next/image'
import Link from 'next/link'
import 'swiper/css'
import 'swiper/css/navigation'
import { Autoplay, Navigation } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'

import SmallBanner from '@/features/banner/components/small-banner'
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

export default function MidBanner() {
  const { data: middleBanners, isLoading: isMiddleLoading } = useBannersByTypeQuery('MIDDLE')
  const { data: smallBanners, isLoading: isSmallLoading } = useBannersByTypeQuery('SMALL')

  const isLoading = isMiddleLoading || isSmallLoading

  if (isLoading) {
    return (
      <div className="flex flex-col gap-1 overflow-visible md:gap-2">
        <div className="flex gap-2">
          {[0, 1].map(i => (
            <div
              key={i}
              className="bg-muted flex h-[90px] w-[calc(50%-4px)] shrink-0 animate-pulse items-center justify-between border border-gray-200 md:h-[150px]"
            />
          ))}
        </div>
      </div>
    )
  }

  const hasMiddleBanners = middleBanners && middleBanners.length > 0
  const hasSmallBanners = smallBanners && smallBanners.length > 0

  // 중배너와 소배너 모두 없으면 아무것도 렌더링하지 않음
  if (!hasMiddleBanners && !hasSmallBanners) {
    return null
  }

  const handleBannerClick = (banner: NonNullable<typeof middleBanners>[0]) => {
    trackBannerClick({
      bannerId: banner.id,
      bannerType: 'MIDDLE',
      bannerName: banner.lectureName,
      lectureId: banner.lectureId,
      url: banner.url,
    })
  }

  return (
    <div className="flex flex-col gap-1 overflow-visible md:gap-2">
      {/* 중형 배너 슬라이더 - 중배너가 있을 때만 표시 */}
      {hasMiddleBanners && (
        <div className="relative">
          <Swiper
            modules={[Autoplay, Navigation]}
            rewind={true}
            navigation={true}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
            }}
            spaceBetween={8}
            slidesPerView={1}
            breakpoints={{
              768: {
                slidesPerView: middleBanners.length === 1 ? 1 : 2,
              },
            }}
          >
            {middleBanners.map(banner => {
              const href = getBannerLink(banner)
              const external = isExternalLink(href)

              const content = (
                <div
                  className="relative h-[90px] w-full overflow-hidden border border-gray-200 shadow-lg md:h-[150px]"
                  style={{ backgroundColor: banner.backgroundColor || '#ffffff' }}
                >
                  {banner.imageUrl ? (
                    <Image
                      src={banner.imageUrl}
                      alt={banner.lectureName || '배너 이미지'}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-contain object-center"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <span className="text-xl font-bold">{banner.lectureName || '이벤트 배너'}</span>
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
      )}

      {/* 작은 배너 */}
      <SmallBanner />
    </div>
  )
}
