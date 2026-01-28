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
  orgName: _orgName,
  price: _price,
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
  const sideLabel = side === 'left' ? 'A 강의' : 'B 강의'

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={lectureId ?? 'empty'}
        initial={reduceMotion ? false : { opacity: 0, y: 10, filter: 'blur(2px)' }}
        animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0, filter: 'blur(0px)' }}
        exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -6, filter: 'blur(2px)' }}
        transition={reduceMotion ? { duration: 0 } : { duration: 0.18, ease: 'easeOut' }}
        className="relative w-full min-w-0 overflow-hidden rounded-xl bg-white p-3 shadow-[4px_4px_20px_0px_rgba(161,161,170,0.25)] md:p-5"
      >
        {/* 데스크톱: 라벨 + X 헤더 (항상 공간 확보, 미선택 시 invisible) */}
        <div className={cn('mb-3 hidden items-center justify-between md:flex', !hasSelection && 'md:invisible')}>
          <span className="text-sm text-foreground">{sideLabel}</span>
          {hasSelection ? (
            <button
              type="button"
              onClick={onClear}
              aria-label={`${side === 'left' ? '왼쪽' : '오른쪽'} 선택 해제`}
              className="text-muted-foreground hover:text-foreground"
            >
              <FiX className="size-4" />
            </button>
          ) : (
            <div className="size-4" />
          )}
        </div>

        {/* 모바일: 닫기 버튼 (오버레이) */}
        {hasSelection && (
          <motion.button
            type="button"
            onClick={onClear}
            aria-label={`${side === 'left' ? '왼쪽' : '오른쪽'} 선택 해제`}
            initial={reduceMotion ? false : { opacity: 0, scale: 0.96 }}
            animate={reduceMotion ? { opacity: 1 } : { opacity: 1, scale: 1 }}
            transition={reduceMotion ? { duration: 0 } : { duration: 0.12, ease: 'easeOut' }}
            className="bg-background text-muted-foreground hover:text-foreground absolute top-1.5 right-1.5 z-10 inline-flex size-5 items-center justify-center rounded-full border md:hidden"
          >
            <FiX className="size-3" />
          </motion.button>
        )}

        <div className="flex flex-col gap-3">
          {/* 썸네일 - 모바일: h-[86px], 데스크톱: h-[181px] */}
          <div className="bg-muted/30 relative h-[86px] w-full shrink-0 overflow-hidden rounded-lg md:h-[181px]">
            {thumbnailUrl ? (
              <Image
                src={thumbnailUrl}
                alt=""
                fill
                sizes="(max-width: 768px) 132px, 511px"
                className="object-cover"
                unoptimized={thumbnailUrl.startsWith('http')}
              />
            ) : (
              <div className="flex size-full items-center justify-center">
                <span className="text-muted-foreground text-sm md:text-lg">{side === 'left' ? 'A' : 'B'}</span>
              </div>
            )}
          </div>

          {/* 제목 */}
          <div
            className={cn(
              'truncate text-center text-sm font-bold text-foreground md:text-xl',
              !hasSelection && 'text-muted-foreground',
            )}
          >
            {hasSelection ? title : '미선택'}
          </div>

          {/* 자세히 보기 버튼 */}
          {hasSelection ? (
            <Button
              asChild
              size="sm"
              variant="outline"
              className="h-8 w-full rounded-lg border-0 bg-[#f9f9f9] text-xs text-foreground hover:bg-[#f0f0f0] md:h-12 md:text-base"
            >
              <Link href={`/lectures/${lectureId}`}>자세히 보기</Link>
            </Button>
          ) : (
            <Button
              disabled
              size="sm"
              variant="outline"
              className="h-8 w-full rounded-lg border-0 bg-[#f9f9f9] text-xs text-foreground md:h-12 md:text-base"
            >
              자세히 보기
            </Button>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
