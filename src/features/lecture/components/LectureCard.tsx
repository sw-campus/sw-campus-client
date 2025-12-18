'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

import { AddToCartButton } from '@/features/cart'
import type { Lecture } from '@/features/lecture/types/lecture.type'

const MotionLink = motion.create(Link)

export function LectureCard({ lecture }: { lecture: Lecture }) {
  const { id, title, organization, periodStart, periodEnd, tags, status, averageScore } = lecture

  const normalizedScore = averageScore ?? 0
  const normalizedReviewCount = lecture.reviewCount ?? 0

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'RECRUITING':
        return { text: '모집중', className: 'bg-accent/10 text-orange-500 font-semibold border-accent/20' }
      case 'FINISHED':
        return { text: '마감', className: 'bg-muted text-muted-foreground border-border/60' }
      default:
        return null
    }
  }

  const statusBadge = getStatusBadge(status)

  return (
    <MotionLink
      href={`/lectures/${id}`}
      className="group border-border/50 bg-card/40 text-card-foreground hover:border-accent hover:shadow-accent/10 relative flex h-full flex-col overflow-hidden rounded-xl border p-6 shadow-sm backdrop-blur-2xl transition-all duration-300 hover:shadow-2xl"
      initial="rest"
      whileHover="hover"
      animate="rest"
    >
      {/* Glass Shine Effect */}
      <motion.div
        className="pointer-events-none absolute -inset-full top-0 block h-full w-1/2 -skew-x-12 bg-linear-to-r from-transparent to-white opacity-40 blur-md"
        variants={{
          rest: { x: '-100%' },
          hover: { x: '400%', transition: { duration: 0.8, ease: 'easeInOut' } },
        }}
        style={{ left: '-100%' }}
      />

      <div className="relative z-10 flex h-full flex-col">
        {/* 상단: 카테고리 & 상태 */}
        <div className="mb-3 flex items-center justify-between gap-3">
          <p className="text-muted-foreground truncate text-xs font-semibold tracking-widest">
            {tags[0]?.name ?? 'CATEGORY'}
          </p>
          {statusBadge && (
            <span className={`shrink-0 rounded-full border px-2.5 py-0.5 text-xs font-medium ${statusBadge.className}`}>
              {statusBadge.text}
            </span>
          )}
        </div>

        <div className="mb-4 h-19">
          {/* 제목 */}
          <h3 className="mb-2 line-clamp-2 text-2xl leading-7 font-extrabold tracking-tight">{title}</h3>

          {/* 기관명 */}
          <p className="text-muted-foregroundtruncate line-clamp-1 text-sm leading-5">{organization}</p>
        </div>

        {/* 별점 */}
        <div className="mb-3 flex items-center gap-1.5">
          <span className={normalizedScore > 0 ? 'text-amber-500' : 'text-muted-foreground'}>★</span>
          <span className="text-base font-semibold tabular-nums">{normalizedScore.toFixed(1)}</span>
          <span className="text-muted-foreground text-sm tabular-nums">({normalizedReviewCount})</span>
        </div>

        <p className="text-muted-foreground mb-5 text-xs">
          {periodStart} ~ {periodEnd}
        </p>

        {/* 태그 */}
        <div className="mb-6 flex h-5 flex-nowrap items-center gap-1.5 overflow-hidden whitespace-nowrap">
          {tags.slice(1).map(tag => (
            <span
              key={tag.id}
              className="text-muted-foreground border-border/60 bg-muted/50 truncate rounded-full border px-2 py-0.5 text-[10px] leading-none font-medium"
            >
              {tag.name}
            </span>
          ))}
        </div>

        {/* 장바구니 버튼 */}
        <div className="mt-auto">
          <AddToCartButton item={{ lectureId: id }} className="w-full rounded-lg py-2">
            Add to cart
          </AddToCartButton>
        </div>
      </div>
    </MotionLink>
  )
}
