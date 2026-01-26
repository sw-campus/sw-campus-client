'use client'

import Image from 'next/image'

import { cn } from '@/lib/utils'

interface MiniLectureCardProps {
  title: string
  thumbnailUrl: string | null
  side: 'left' | 'right'
}

/**
 * Sticky 헤더 내 축소형 강의 카드
 * - LectureSummaryCard의 읽기 전용 축소 버전
 * - 드래그/클리어 기능 제외
 * - 직사각형 썸네일 (Desktop: 80x50px, Mobile: 60x40px)
 */
export function MiniLectureCard({ title, thumbnailUrl, side }: MiniLectureCardProps) {
  const hasSelection = Boolean(title)

  return (
    <div className="flex items-center gap-2 md:gap-3">
      {/* 직사각형 썸네일 */}
      <div
        className={cn(
          'relative h-10 w-14 shrink-0 overflow-hidden rounded-md md:h-12 md:w-20',
          hasSelection ? 'bg-muted/30' : 'bg-muted/50',
        )}
      >
        {thumbnailUrl ? (
          <Image
            src={thumbnailUrl}
            alt=""
            fill
            sizes="80px"
            className="object-cover"
            unoptimized={thumbnailUrl.startsWith('http')}
          />
        ) : (
          <div className="flex size-full items-center justify-center">
            <span className="text-muted-foreground text-xs md:text-sm">{side === 'left' ? 'A' : 'B'}</span>
          </div>
        )}
      </div>

      {/* 제목 */}
      <div
        className={cn(
          'max-w-[100px] text-xs font-medium leading-tight md:max-w-[160px] md:text-sm',
          '[display:-webkit-box] overflow-hidden break-keep [-webkit-box-orient:vertical] [-webkit-line-clamp:2]',
          !hasSelection && 'text-muted-foreground',
        )}
      >
        {hasSelection ? title : '미선택'}
      </div>
    </div>
  )
}
