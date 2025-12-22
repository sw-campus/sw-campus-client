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
  orgName,
  thumbnailUrl,
  lectureId,
  onClear,
}: {
  side: Side
  title: string
  orgName?: string | null
  thumbnailUrl?: string | null
  lectureId?: string | null
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
        className="relative flex flex-col items-center gap-3 px-6 py-8 text-center"
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
            className="bg-background text-muted-foreground hover:text-foreground absolute top-3 right-3 inline-flex h-9 w-9 items-center justify-center rounded-full border"
          >
            <FiX />
          </motion.button>
        ) : null}

        {/* 이미지 */}
        <div className="bg-muted/30 relative h-24 w-24 overflow-hidden rounded-full">
          {thumbnailUrl ? (
            <Image
              src={thumbnailUrl}
              alt=""
              fill
              sizes="96px"
              className="object-cover"
              unoptimized={thumbnailUrl.startsWith('http')}
            />
          ) : null}
        </div>

        <div className="space-y-1">
          <div
            className={cn(
              '[display:-webkit-box] overflow-hidden text-xl leading-snug font-bold break-keep [-webkit-box-orient:vertical] [-webkit-line-clamp:2]',
              !hasSelection && 'text-muted-foreground',
            )}
          >
            {hasSelection ? title : '미선택'}
          </div>
          {!hasSelection && <div className="text-muted-foreground text-sm opacity-60">강의를 선택해 주세요</div>}
        </div>

        {hasSelection ? (
          <Button asChild className="mt-2 w-40">
            <Link href={`/lectures/${lectureId}`}>자세히 보기</Link>
          </Button>
        ) : (
          <Button disabled className="mt-2 w-40">
            자세히 보기
          </Button>
        )}
      </motion.div>
    </AnimatePresence>
  )
}
