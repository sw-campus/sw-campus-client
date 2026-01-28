'use client'

import { Check, Star } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { AddToCartButton } from '@/features/cart/components/add-to-cart-button'
import { useUnifiedCart } from '@/features/cart/hooks/use-unified-cart'
import { useUnifiedRemoveFromCart } from '@/features/cart/hooks/use-unified-remove-from-cart'
import type { LectureResponseDto } from '@/features/lecture/types/lecture-response.type'

interface BootcampListItemProps {
  lecture: LectureResponseDto
}

export function BootcampListItem({ lecture }: BootcampListItemProps) {
  const router = useRouter()
  const { items } = useUnifiedCart()
  const { mutate: removeFromCart } = useUnifiedRemoveFromCart()
  const isInCart = items.some(item => item.lectureId === String(lecture.lectureId))
  const score = lecture.averageScore ?? 0
  const reviewCount = lecture.reviewCount ?? 0
  const hasReviews = score > 0

  // 날짜 포맷
  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return ''
    return dateStr.includes('T') ? dateStr.split('T')[0] : dateStr.slice(0, 10)
  }
  const dateRange =
    lecture.startAt && lecture.endAt ? `${formatDate(lecture.startAt)} ~ ${formatDate(lecture.endAt)}` : ''

  // 내배카 필요 여부
  const recruitTypeMap: Record<string, string> = {
    CARD_REQUIRED: '내배카 필요 O',
    GENERAL: '내배카 필요 X',
    KDT: 'KDT(우수형)',
  }
  const recruitLabel = lecture.recruitType ? recruitTypeMap[lecture.recruitType] || lecture.recruitType : null

  // 온/오프라인
  const locMap: Record<string, string> = {
    ONLINE: '온라인',
    OFFLINE: '오프라인',
    MIXED: '온오프혼합',
  }
  const locLabel = lecture.lectureLoc ? locMap[lecture.lectureLoc] || lecture.lectureLoc : null

  return (
    <Link
      href={`/lectures/${lecture.lectureId}`}
      className="flex w-full flex-col gap-3 rounded-xl bg-white p-4 shadow-[4px_4px_20px_rgba(194,147,32,0.25)] transition-all hover:shadow-[4px_4px_24px_rgba(194,147,32,0.35)] md:w-[332px] md:gap-6 md:p-6"
    >
      {/* 콘텐츠 영역 */}
      <div className="flex flex-col gap-1 md:gap-3">
        {/* 상단: 카테고리 | 별점 + 리뷰수 + 모집중 */}
        <div className="flex items-center justify-between gap-2">
          <span className="shrink-0 text-xs text-[#555555] md:text-sm">{lecture.categoryName || '부트캠프'}</span>
          <div className="flex shrink-0 items-center gap-1">
            <Star
              className={`size-4 md:size-[18px] ${hasReviews ? 'fill-brand-gold text-brand-gold' : 'fill-muted-foreground/40 text-muted-foreground/40'}`}
            />
            <span className="text-sm md:text-base">{score.toFixed(1)}</span>
            <span className="text-[10px] text-[#555555] md:text-xs">({reviewCount})</span>
            {lecture.status === 'RECRUITING' && (
              <span className="ml-1 flex items-center gap-1 rounded-full bg-emerald-500/20 px-2 py-0.5 text-[11px] font-medium text-emerald-700 md:px-2.5 md:py-1 md:text-xs">
                <span className="size-1.5 rounded-full bg-emerald-500" />
                모집중
              </span>
            )}
          </div>
        </div>

        {/* 강의명 */}
        <h3 className="line-clamp-1 text-sm font-bold break-keep md:line-clamp-3 md:h-[100px] md:text-2xl">{lecture.lectureName}</h3>

        {/* 기관명 */}
        <span className="text-sm text-[#555555] md:text-base">{lecture.orgName}</span>

        {/* 날짜 - 모바일에서 숨김 */}
        <span className="hidden text-xs text-[#888888] md:block">{dateRange || '-'}</span>

        {/* 태그 - 모바일에서 숨김 */}
        <div className="hidden gap-1.5 overflow-hidden md:flex">
          {recruitLabel && (
            <span className="rounded-full bg-amber-400/20 px-2 py-0.5 text-[11px] font-medium text-amber-700">
              #{recruitLabel}
            </span>
          )}
          {locLabel && (
            <span className="rounded-full bg-amber-400/20 px-2 py-0.5 text-[11px] font-medium text-amber-700">
              #{locLabel}
            </span>
          )}
          {lecture.totalDays && (
            <span className="rounded-full bg-amber-400/20 px-2 py-0.5 text-[11px] font-medium text-amber-700">
              #{lecture.totalDays}일 과정
            </span>
          )}
        </div>
      </div>

      {/* 하단: 버튼 */}
      <div className="flex gap-2">
        {isInCart ? (
          <Button
            variant="outline"
            size="icon-sm"
            className="text-brand-gold hover:text-brand-gold h-8 flex-1 rounded-lg border-transparent bg-neutral-800 text-xs hover:bg-neutral-800 md:h-12 md:text-base"
            onClick={e => {
              e.preventDefault()
              removeFromCart(lecture.lectureId)
            }}
          >
            <Check className="text-brand-gold size-4" />
            관심등록됨
          </Button>
        ) : (
          <AddToCartButton
            item={{ lectureId: String(lecture.lectureId) }}
            variant="outline"
            size="icon-sm"
            className="bg-brand-gold-light hover:bg-brand-gold-light h-8 flex-1 rounded-lg border-transparent text-xs text-[#020202] md:h-12 md:text-base"
          >
            관심등록
          </AddToCartButton>
        )}
        <AddToCartButton
          item={{ lectureId: String(lecture.lectureId) }}
          size="icon-sm"
          className="bg-brand-gold hover:bg-brand-gold h-8 flex-1 rounded-lg text-xs text-neutral-700 md:h-12 md:text-base"
          onClick={() => router.push('/cart/compare')}
        >
          비교하기
        </AddToCartButton>
      </div>
    </Link>
  )
}
