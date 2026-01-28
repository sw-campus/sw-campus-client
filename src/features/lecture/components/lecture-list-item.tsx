'use client'

import { Check, Star } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { AddToCartButton } from '@/features/cart'
import { useUnifiedCart } from '@/features/cart/hooks/use-unified-cart'
import { useUnifiedRemoveFromCart } from '@/features/cart/hooks/use-unified-remove-from-cart'
import type { LectureResponseDto } from '@/features/lecture/types/lecture-response.type'

interface LectureListItemProps {
  lecture: LectureResponseDto
}

export function LectureListItem({ lecture }: LectureListItemProps) {
  const router = useRouter()
  const { items } = useUnifiedCart()
  const { mutate: removeFromCart } = useUnifiedRemoveFromCart()
  const isInCart = items.some((item) => item.lectureId === String(lecture.lectureId))
  const score = lecture.averageScore ?? 0
  const reviewCount = lecture.reviewCount ?? 0
  const hasReviews = score > 0

  return (
    <Link
      href={`/lectures/${lecture.lectureId}`}
      className="flex flex-col gap-4 rounded-xl border border-border bg-card p-4 shadow-sm transition-all hover:border-primary/30 hover:shadow-md"
    >
      {/* 상단: 카테고리 | 별점 + 리뷰수 + 모집중 */}
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">{lecture.categoryName || '부트캠프'}</span>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <Star
              className={`size-4 ${hasReviews ? 'fill-primary text-primary' : 'fill-muted-foreground/40 text-muted-foreground/40'}`}
            />
            <span className="text-sm font-medium">{score.toFixed(1)}</span>
            <span className="text-xs text-muted-foreground">({reviewCount})</span>
          </div>
          {lecture.status === 'RECRUITING' ? (
            <span className="flex items-center gap-1 rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-medium text-emerald-700">
              <span className="size-1.5 rounded-full bg-emerald-500" />
              모집중
            </span>
          ) : lecture.status === 'FINISHED' ? (
            <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
              마감
            </span>
          ) : null}
        </div>
      </div>

      {/* 중간: 강의명 + 기관명 */}
      <div className="flex flex-col gap-1">
        <h3 className="truncate text-base font-semibold">{lecture.lectureName}</h3>
        <span className="text-sm text-muted-foreground">{lecture.orgName}</span>
      </div>

      {/* 하단: 버튼 */}
      <div className="flex gap-2">
        {isInCart ? (
          <Button
            variant="outline"
            size="sm"
            className="h-9 flex-1 border-transparent bg-neutral-800 text-brand-gold hover:bg-neutral-800 hover:text-brand-gold"
            onClick={(e) => {
              e.preventDefault()
              removeFromCart(lecture.lectureId)
            }}
          >
            <Check className="size-4 text-brand-gold" />
            관심등록됨
          </Button>
        ) : (
          <AddToCartButton
            item={{ lectureId: lecture.lectureId }}
            variant="outline"
            size="sm"
            className="h-9 flex-1 border-transparent bg-brand-gold-light text-[#020202] hover:bg-brand-gold-light"
          >
            관심등록
          </AddToCartButton>
        )}
        <AddToCartButton
          item={{ lectureId: lecture.lectureId }}
          size="sm"
          className="h-9 flex-1 bg-brand-gold text-neutral-700 hover:bg-brand-gold"
          onClick={() => router.push('/cart/compare')}
        >
          비교하기
        </AddToCartButton>
      </div>
    </Link>
  )
}
