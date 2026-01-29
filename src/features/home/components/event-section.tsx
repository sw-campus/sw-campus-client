'use client'

import Image from 'next/image'
import Link from 'next/link'
import 'swiper/css'
import 'swiper/css/navigation'
import { Navigation } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'

import { useBannersByTypeQuery } from '@/features/banner/hooks/use-banner-query'

export function EventSection() {
  const { data: events = [], isLoading } = useBannersByTypeQuery('EVENT')

  // 이벤트 배너가 없으면 섹션을 렌더링하지 않음
  if (!isLoading && events.length === 0) {
    return null
  }

  const renderEventCard = (event: (typeof events)[0]) => {
    const href = event.url || (event.lectureId ? `/lectures/${event.lectureId}` : '#')

    return (
      <Link
        href={href}
        className="relative block w-full overflow-hidden rounded-xl"
        style={{ backgroundColor: event.backgroundColor || undefined }}
      >
        {event.imageUrl && (
          <Image
            src={event.imageUrl}
            alt={event.lectureName || `이벤트 ${event.id}`}
            width={800}
            height={400}
            className="h-auto w-full"
          />
        )}
      </Link>
    )
  }

  return (
    <section className="container-responsive flex flex-col gap-6 py-[30px] md:gap-10 md:py-[50px]">
      {/* 섹션 헤더 */}
      <h2 className="text-center text-xl font-bold md:text-[32px]">
        소프트웨어 캠퍼스에서{' '}
        <br className="md:hidden" />
        <span className="text-brand-gold">진행 중인 이벤트</span>를 확인해보세요.
      </h2>

      {/* 이벤트 목록 */}
      {isLoading ? (
        <div className="flex flex-col gap-4 md:flex-row md:justify-center md:gap-6">
          {[1, 2].map(i => (
            <div
              key={i}
              className="bg-muted h-[200px] w-full animate-pulse rounded-xl md:max-w-[50%] md:flex-1"
            />
          ))}
        </div>
      ) : events.length === 1 ? (
        // 1개: 중앙 정렬, 50% 너비
        <div className="flex justify-center">
          <div className="w-full md:max-w-[50%]">{renderEventCard(events[0])}</div>
        </div>
      ) : events.length === 2 ? (
        // 2개: 나란히 표시
        <div className="flex flex-col gap-4 md:flex-row md:justify-center md:gap-6">
          {events.map(event => (
            <div key={event.id} className="w-full md:max-w-[50%] md:flex-1">
              {renderEventCard(event)}
            </div>
          ))}
        </div>
      ) : (
        // 3개 이상: 슬라이드
        <Swiper
          modules={[Navigation]}
          navigation
          slidesPerView={1}
          spaceBetween={16}
          breakpoints={{
            768: {
              slidesPerView: 2,
              spaceBetween: 24,
            },
          }}
          className="event-swiper w-full"
        >
          {events.map(event => (
            <SwiperSlide key={event.id}>{renderEventCard(event)}</SwiperSlide>
          ))}
        </Swiper>
      )}
    </section>
  )
}
