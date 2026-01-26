'use client'

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { FiX } from 'react-icons/fi'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type Side = 'left' | 'right'

export function LectureSummaryCard({
  side,
  title,
  thumbnailUrl,
  lectureId,
  orgName,
  price,
  onClear,
}: {
  side: Side
  title: string
  thumbnailUrl?: string | null
  lectureId?: string | null
  orgName?: string | null
  price?: number | null
  onClear: () => void
}) {
  const reduceMotion = useReducedMotion()
  const hasSelection = Boolean(lectureId)

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={lectureId ?? 'empty'}
        initial={reduceMotion ? false : { opacity: 0, y: 10, filter: 'blur(2px)' }}
        animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0, filter: 'blur(0px)' }}
        exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -6, filter: 'blur(2px)' }}
        transition={reduceMotion ? { duration: 0 } : { duration: 0.18, ease: 'easeOut' }}
        className="relative overflow-hidden rounded-[12px] border border-gray-100 bg-white p-3 md:rounded-lg md:border-border md:bg-card md:p-4"
      >
        {/* 닫기 버튼 */}
        {hasSelection ? (
          <motion.button
            type="button"
            onClick={onClear}
            aria-label={`${side === 'left' ? '왼쪽' : '오른쪽'} 선택 해제`}
            initial={reduceMotion ? false : { opacity: 0, scale: 0.96 }}
            animate={reduceMotion ? { opacity: 1 } : { opacity: 1, scale: 1 }}
            transition={reduceMotion ? { duration: 0 } : { duration: 0.12, ease: 'easeOut' }}
            className="bg-background text-muted-foreground hover:text-foreground absolute top-1.5 right-1.5 z-10 inline-flex h-5 w-5 items-center justify-center rounded-full border md:top-2 md:right-2 md:h-7 md:w-7"
          >
            <FiX className="h-3 w-3 md:h-4 md:w-4" />
          </motion.button>
        ) : null}

        {/* 모바일: 세로 레이아웃 (Figma: 132x86 썸네일) / 데스크탑: 가로 레이아웃 */}
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-4">
          {/* 직사각형 썸네일 - 모바일: h-[86px] rounded-[8px], 데스크탑: 128x80 */}
          <div className="bg-muted/30 relative h-[86px] w-full shrink-0 overflow-hidden rounded-[8px] md:h-20 md:w-32 md:rounded-md">
            {thumbnailUrl ? (
              <Image
                src={thumbnailUrl}
                alt=""
                fill
                sizes="(max-width: 768px) 132px, 128px"
                className="object-cover"
                unoptimized={thumbnailUrl.startsWith('http')}
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <span className="text-muted-foreground text-sm">{side === 'left' ? 'A' : 'B'}</span>
              </div>
            )}
          </div>

          {/* 정보 영역 */}
          <div className="min-w-0 flex-1 space-y-1">
            <div
              className={cn(
                'truncate text-center text-sm font-bold text-[#020202] md:text-left md:text-base md:font-semibold md:[display:-webkit-box] md:[-webkit-box-orient:vertical] md:[-webkit-line-clamp:2] md:whitespace-normal',
                !hasSelection && 'text-muted-foreground',
              )}
            >
              {hasSelection ? title : '미선택'}
            </div>

            {hasSelection && orgName && (
              <div className="text-muted-foreground hidden truncate text-sm md:block">{orgName}</div>
            )}

            {hasSelection && price !== undefined && price !== null && (
              <div className="hidden text-base font-semibold text-primary md:block">
                {price === 0 ? '무료' : `${price.toLocaleString()}원`}
              </div>
            )}

            {!hasSelection && (
              <div className="text-muted-foreground text-[10px] opacity-60 md:text-sm">강의를 선택해 주세요</div>
            )}
          </div>

          {/* 자세히 보기 버튼 - 모바일: bg-[#f9f9f9] rounded-[8px] h-[32px] */}
          <div className="shrink-0">
            {hasSelection ? (
              <Button
                asChild
                size="sm"
                variant="outline"
                className="h-8 w-full rounded-[8px] border-0 bg-[#f9f9f9] text-xs text-[#020202] hover:bg-[#f0f0f0] md:h-9 md:w-auto md:rounded-md md:border md:bg-transparent md:text-sm"
              >
                <Link href={`/lectures/${lectureId}`}>자세히 보기</Link>
              </Button>
            ) : (
              <Button
                disabled
                size="sm"
                variant="outline"
                className="h-8 w-full rounded-[8px] border-0 bg-[#f9f9f9] text-xs text-[#020202] md:h-9 md:w-auto md:rounded-md md:border md:bg-transparent md:text-sm"
              >
                자세히 보기
              </Button>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
