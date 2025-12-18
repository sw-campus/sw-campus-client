import Link from 'next/link'

import { AddToCartButton } from '@/features/cart'
import type { Lecture } from '@/features/lecture/types/lecture.type'

const FALLBACK_TAG_VARIANTS = [
  'bg-sky-500/10 text-sky-600 border-sky-500/20',
  'bg-violet-500/10 text-violet-600 border-violet-500/20',
  'bg-rose-500/10 text-rose-600 border-rose-500/20',
  'bg-amber-500/10 text-amber-600 border-amber-500/20',
  'bg-indigo-500/10 text-indigo-600 border-indigo-500/20',
] as const

const getTagVariantClassName = (tagId: string, fallbackIndex: number) => {
  // Tag ids are shaped by mapLectureResponseToSummary:
  // cat-*, recruit-*, loc-*, days-*, times-*
  if (tagId.startsWith('cat-')) {
    return 'bg-accent/60 text-accent-foreground border-border/60'
  }

  if (tagId.startsWith('recruit-')) {
    // 내배카
    if (tagId.includes('CARD_REQUIRED')) {
      return 'bg-rose-500/10 text-rose-600 border-rose-500/20'
    }
    return 'bg-orange-500/10 text-orange-600 border-orange-500/20'
  }

  if (tagId.startsWith('loc-')) {
    // 오프라인/온오프혼합/온라인
    if (tagId.includes('ONLINE')) return 'bg-cyan-500/10 text-cyan-600 border-cyan-500/20'
    if (tagId.includes('OFFLINE')) return 'bg-violet-500/10 text-violet-600 border-violet-500/20'
    if (tagId.includes('MIXED')) return 'bg-blue-500/10 text-blue-600 border-blue-500/20'
  }

  if (tagId.startsWith('days-') || tagId.startsWith('times-')) {
    return 'bg-secondary text-secondary-foreground border-border/60'
  }

  return FALLBACK_TAG_VARIANTS[fallbackIndex % FALLBACK_TAG_VARIANTS.length]
}

export function LectureCard({ lecture }: { lecture: Lecture }) {
  const { id, title, organization, periodStart, periodEnd, tags, status, averageScore } = lecture

  const normalizedScore = averageScore ?? 0
  const normalizedReviewCount = lecture.reviewCount ?? 0

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'RECRUITING':
        return { text: '모집중', className: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' }
      case 'FINISHED':
        return { text: '마감', className: 'bg-muted text-muted-foreground border-border/60' }
      default:
        return null
    }
  }

  const statusBadge = getStatusBadge(status)

  return (
    <Link
      href={`/lectures/${id}`}
      className="group border-border/60 bg-card/60 text-card-foreground relative flex h-full flex-col overflow-hidden rounded-xl border p-6 backdrop-blur-xl"
    >
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

        {/* 제목 */}
        <h3 className="mb-2 line-clamp-2 h-14 text-2xl leading-7 font-extrabold tracking-tight">{title}</h3>

        {/* 기관명 */}
        <p className="text-muted-foreground mb-4 h-5 truncate text-sm leading-5">{organization}</p>

        {/* 별점: 항상 표시 (없으면 0.0(0)) */}
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
          {tags.slice(1).map((tag, idx) => (
            <span
              key={tag.id}
              className={`truncate rounded-full border px-2 py-0.5 text-[10px] leading-none ${getTagVariantClassName(tag.id, idx)}`}
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
    </Link>
  )
}
