'use client'

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
  const hasSelection = Boolean(lectureId)

  return (
    <div className="relative flex flex-col items-center gap-3 px-6 py-8 text-center">
      {hasSelection ? (
        <button
          type="button"
          onClick={onClear}
          aria-label={`${side === 'left' ? '왼쪽' : '오른쪽'} 선택 해제`}
          className="bg-background text-muted-foreground hover:text-foreground absolute top-3 right-3 inline-flex h-9 w-9 items-center justify-center rounded-full border"
        >
          <FiX />
        </button>
      ) : null}

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
        <div className={cn('text-xl font-bold', !hasSelection && 'text-muted-foreground')}>
          {hasSelection ? title : '미선택'}
        </div>
        <div className={cn('text-muted-foreground text-sm', !hasSelection && 'opacity-60')}>
          {hasSelection ? (orgName ?? '-') : '강의를 선택해 주세요'}
        </div>
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
    </div>
  )
}
