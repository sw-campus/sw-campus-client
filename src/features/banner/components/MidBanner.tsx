'use client'

import { useRef } from 'react'

import Image from 'next/image'
import Link from 'next/link'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import type { Swiper as SwiperType } from 'swiper'
import 'swiper/css'
import { Swiper, SwiperSlide } from 'swiper/react'

import SmallBanner from '@/features/banner/components/SmallBanner'
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

export default function MidBanner() {
  const swiperRef = useRef<SwiperType | null>(null)
  const { data: middleBanners, isLoading: isMiddleLoading } = useBannersByTypeQuery('MIDDLE')
  const { data: smallBanners, isLoading: isSmallLoading } = useBannersByTypeQuery('SMALL')

  const isLoading = isMiddleLoading || isSmallLoading

  if (isLoading) {
    return (
      <div className="custom-container">
        <div className="custom-card">
          <div className="flex gap-4 overflow-visible">
            {[0, 1].map(i => (
              <div
                key={i}
                className="bg-muted flex h-[190px] w-[calc(50%-8px)] shrink-0 animate-pulse items-center justify-between rounded-2xl border border-gray-200"
              />
            ))}
          </div>
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

  return (
    <div className="custom-container overflow-visible">
      <div className="custom-card overflow-visible">
        {/* 중형 배너 슬라이더 - 중배너가 있을 때만 표시 */}
        {hasMiddleBanners && (
          <div className="relative">
            <Swiper
              onBeforeInit={swiper => {
                swiperRef.current = swiper
              }}
              loop={middleBanners.length > 2}
              spaceBetween={16}
              slidesPerView={2}
              breakpoints={{
                0: { slidesPerView: 1 },
                768: { slidesPerView: 2 },
                1024: { slidesPerView: 2 },
              }}
            >
              {middleBanners.map(banner => {
                const href = getBannerLink(banner)
                const external = isExternalLink(href)

                const content = (
                  <div className="relative h-[190px] w-full overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg">
                    {banner.imageUrl ? (
                      <Image
                        src={banner.imageUrl}
                        alt={banner.lectureName}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <span className="text-xl font-bold">{banner.lectureName}</span>
                      </div>
                    )}
                  </div>
                )

                const handleClick = () => {
                  trackBannerClick({
                    bannerId: banner.id,
                    bannerType: 'MIDDLE',
                    bannerName: banner.lectureName,
                    lectureId: banner.lectureId,
                    url: banner.url,
                  })
                }

                return (
                  <SwiperSlide key={banner.id}>
                    {external ? (
                      <a href={href} target="_blank" rel="noopener noreferrer" className="block" onClick={handleClick}>
                        {content}
                      </a>
                    ) : (
                      <Link href={href} className="block" onClick={handleClick}>
                        {content}
                      </Link>
                    )}
                  </SwiperSlide>
                )
              })}
            </Swiper>

            {/* 커스텀 네비게이션 버튼 */}
            <button
              onClick={() => swiperRef.current?.slidePrev()}
              className="absolute top-1/2 left-0 z-10 -translate-x-4 -translate-y-1/2 rounded-full bg-white/80 p-2.5 shadow-lg transition-all hover:scale-110 hover:text-orange-400 active:scale-95"
              aria-label="이전 슬라이드"
            >
              <FiChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={() => swiperRef.current?.slideNext()}
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
    </div>
  )
}
