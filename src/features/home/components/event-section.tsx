'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination } from 'swiper/modules'

import 'swiper/css'
import 'swiper/css/pagination'

interface Event {
  id: number
  title: string
  imageUrl: string
  link?: string
}

interface EventSectionProps {
  events?: Event[]
}

export function EventSection({ events = [] }: EventSectionProps) {
  // 더미 데이터
  const displayEvents: Event[] =
    events.length > 0
      ? events
      : [
          { id: 1, title: '이벤트 1', imageUrl: '' },
          { id: 2, title: '이벤트 2', imageUrl: '' },
          { id: 3, title: '이벤트 3', imageUrl: '' },
        ]

  return (
    <section className="flex flex-col gap-4 px-4 py-[30px] md:custom-container">
      {/* 섹션 헤더 */}
      <h2 className="text-xl font-bold md:text-2xl">
        SOFTWARE CAMPUS에서 진행 중인 이벤트를 확인해보세요.
      </h2>

      {/* 모바일: 이벤트 캐러셀 */}
      <div className="md:hidden">
        <Swiper
          modules={[Pagination]}
          pagination={{ clickable: true }}
          slidesPerView={1.1}
          spaceBetween={12}
          className="w-full"
        >
          {displayEvents.map((event) => (
            <SwiperSlide key={event.id}>
              <EventCard event={event} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* 데스크톱: 그리드 3열 */}
      <div className="hidden md:grid md:grid-cols-3 md:gap-4">
        {displayEvents.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </section>
  )
}

interface EventCardProps {
  event: Event
}

function EventCard({ event }: EventCardProps) {
  const content = (
    <div className="relative aspect-[3/1] w-full overflow-hidden rounded-lg bg-gradient-to-r from-primary/20 to-accent/20">
      {event.imageUrl ? (
        <Image
          src={event.imageUrl}
          alt={event.title}
          fill
          className="object-cover"
        />
      ) : (
        <div className="flex size-full items-center justify-center">
          <span className="text-sm font-medium text-muted-foreground">{event.title}</span>
        </div>
      )}
    </div>
  )

  if (event.link) {
    return (
      <Link href={event.link} className="block">
        {content}
      </Link>
    )
  }

  return content
}
