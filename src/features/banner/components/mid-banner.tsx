'use client'

import { useRef } from 'react'

import Image from 'next/image'
import Link from 'next/link'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'
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
  const prevRef = useRef<HTMLButtonElement>(null)
  const nextRef = useRef<HTMLButtonElement>(null)
  const { data: middleBanners, isLoading: isMiddleLoading } = useBannersByTypeQuery('MIDDLE')
  const { data: smallBanners, isLoading: isSmallLoading } = useBannersByTypeQuery('SMALL')

  const isLoading = isMiddleLoading || isSmallLoading

  if (isLoading) {
    return (
      <div className="flex flex-col gap-2 overflow-visible md:gap-3">
        <div className="flex gap-2">
          {[0, 1].map(i => (
            <div
              key={i}
              className="bg-muted flex aspect-[630/180] w-[calc(50%-4px)] shrink-0 animate-pulse items-center justify-between rounded-lg border border-gray-200 md:rounded-2xl"
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
    <div className="flex flex-col gap-2 overflow-visible md:gap-3">
      {/* 중형 배너 슬라이더 - 중배너가 있을 때만 표시 */}
      {hasMiddleBanners && (
        <div className="relative">
            <Swiper
              modules={[Autoplay, Navigation]}
              rewind={true}
              autoplay={{
                delay: 5000,
                disableOnInteraction: false,
              }}
              navigation={true}
              onSwiper={(swiper) => {
                if (swiper.params.navigation && typeof swiper.params.navigation !== 'boolean') {
                  swiper.params.navigation.prevEl = prevRef.current
                  swiper.params.navigation.nextEl = nextRef.current
                  swiper.navigation.init()
                  swiper.navigation.update()
                }
              }}
              spaceBetween={8}
              slidesPerView={1.5}
            >
              {middleBanners.map(banner => {
                const href = getBannerLink(banner)
                const external = isExternalLink(href)

                const content = (
                  <div
                    className="relative aspect-[630/180] w-full overflow-hidden rounded-lg border border-gray-200 shadow-lg md:rounded-2xl"
                    style={{ backgroundColor: banner.backgroundColor || '#ffffff' }}
                  >
                    {banner.imageUrl ? (
                      <Image
                        src={banner.imageUrl}
                        alt={banner.lectureName}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-contain object-center"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <span className="text-xl font-bold">{banner.lectureName}</span>
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

            {/* 커스텀 네비게이션 버튼 */}
            <button
              ref={prevRef}
              className="absolute top-1/2 left-0 z-10 -translate-x-4 -translate-y-1/2 rounded-full bg-white/80 p-2.5 shadow-lg transition-all hover:scale-110 hover:text-orange-400 active:scale-95"
              aria-label="이전 슬라이드"
            >
              <FiChevronLeft className="h-5 w-5" />
            </button>
            <button
              ref={nextRef}
              className="absolute top-1/2 right-0 z-10 translate-x-4 -translate-y-1/2 rounded-full bg-white/80 p-2.5 shadow-lg transition-all hover:scale-110 hover:text-orange-400 active:scale-95"
              aria-label="다음 슬라이드"
            >
              <FiChevronRight className="h-5 w-5" />
            </button>
        </div>
      )}

      {/* 작은 배너 */}
      <SmallBanner />
    </div>
  )
}
