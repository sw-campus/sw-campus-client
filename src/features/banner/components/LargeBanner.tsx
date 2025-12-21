'use client'

import { useEffect, useRef, useState } from 'react'

import { FastAverageColor } from 'fast-average-color'
import Image from 'next/image'
import Link from 'next/link'
import 'swiper/css'
import 'swiper/css/pagination'
import { Autoplay, Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'

import { useBannersByTypeQuery } from '../hooks/useBannerQuery'

/**
 * 각 슬라이드별 배경색을 관리하는 커스텀 훅
 */
function useImageColors(imageUrls: string[]) {
  const [colors, setColors] = useState<Record<string, string>>({})
  const fac = useRef<FastAverageColor | null>(null)

  useEffect(() => {
    fac.current = new FastAverageColor()

    return () => {
      fac.current?.destroy()
    }
  }, [])

  useEffect(() => {
    if (!fac.current || imageUrls.length === 0) return

    imageUrls.forEach(async url => {
      if (!url || colors[url]) return

      try {
        const color = await fac.current!.getColorAsync(url)
        setColors(prev => ({
          ...prev,
          [url]: color.rgba,
        }))
      } catch (error) {
        console.error('Failed to extract color from image:', url, error)
      }
    })
  }, [imageUrls, colors])

  return colors
}

export default function LargeBanner() {
  const { data: banners, isLoading } = useBannersByTypeQuery('BIG')
  const [activeIndex, setActiveIndex] = useState(0)

  // 배너 이미지 URL 목록
  const imageUrls = banners?.map(b => b.imageUrl).filter((url): url is string => !!url) ?? []

  // 이미지에서 색상 추출
  const imageColors = useImageColors(imageUrls)

  // 현재 활성화된 슬라이드의 배경색
  const currentBanner = banners?.[activeIndex]
  const currentBgColor = currentBanner?.imageUrl ? imageColors[currentBanner.imageUrl] : undefined

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

  return (
    <div
      className="mx-auto mt-6 w-full max-w-7xl overflow-hidden rounded-3xl transition-colors duration-500"
      style={{ backgroundColor: currentBgColor ?? undefined }}
    >
      <Swiper
        modules={[Pagination, Autoplay]}
        slidesPerView={1}
        loop={banners.length > 1}
        pagination={{ clickable: true }}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        onSlideChange={swiper => {
          // loop 모드에서는 realIndex 사용
          setActiveIndex(swiper.realIndex)
        }}
      >
        {banners.map((banner, index) => (
          <SwiperSlide key={banner.id}>
            <Link href={`/lectures/${banner.lectureId}`}>
              <div className="relative flex w-full items-center justify-center sm:p-10">
                <div className="relative mx-auto h-[130px] w-full">
                  {banner.imageUrl ? (
                    <Image
                      src={banner.imageUrl}
                      alt={banner.lectureName}
                      fill
                      className="object-contain"
                      priority={index === 0}
                      crossOrigin="anonymous"
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
