'use client'

import { useState } from 'react'
import { ArrowRight, Check, Star } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { AddToCartButton } from '@/features/cart'
import { useUnifiedCart } from '@/features/cart/hooks/use-unified-cart'
import { useUnifiedRemoveFromCart } from '@/features/cart/hooks/use-unified-remove-from-cart'
import { useCategoryTree } from '@/features/category'
import { useTopRatedLecturesByCategory } from '@/features/lecture/hooks/use-top-rated-lectures-by-category'
import { DEFAULT_PAGE_SIZE } from '@/features/lecture/types/filter.type'
import type { LectureResponseDto } from '@/features/lecture/types/lecture-response.type'

export function BootcampListSection() {
  // 카테고리 트리에서 첫 번째 대분류의 중분류(children)를 가져옴
  const { data: categoryTree } = useCategoryTree()
  const subcategories = categoryTree?.[0]?.children ?? []

  // 선택된 중분류 ID
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null)

  // 선택값이 없으면 첫 번째 중분류를 자동 선택처럼 동작
  const resolvedCategoryId = selectedCategoryId ?? subcategories[0]?.categoryId ?? null

  // 선택된 중분류의 평점 높은 강의 조회
  const { data: lecturesData, isLoading } = useTopRatedLecturesByCategory(resolvedCategoryId)

  // 선택된 카테고리명 파생
  const selectedCategoryName =
    subcategories.find((c) => c.categoryId === resolvedCategoryId)?.categoryName ?? ''

  return (
    <section className="bg-brand-gold-light">
      <div className="container-responsive flex flex-col gap-6 py-[30px] md:gap-10 md:py-[100px]">
      {/* 섹션 헤더 */}
      <div className="flex flex-col gap-6 md:gap-8">
        <h2 className="text-center text-xl font-bold md:text-[32px]">
          수강생 후기 <span className="text-brand-gold">BEST</span> 부트캠프들을 한눈에 살펴보세요.
        </h2>

        {/* 카테고리 탭 */}
        <div className="scrollbar-hide -mx-4 flex gap-2 overflow-x-auto px-4 md:mx-0 md:flex-wrap md:justify-center md:px-0">
          {subcategories.map((category) => (
            <button
              key={category.categoryId}
              onClick={() => setSelectedCategoryId(category.categoryId)}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                resolvedCategoryId === category.categoryId
                  ? 'bg-primary text-primary-foreground'
                  : 'border border-border bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {category.categoryName}
            </button>
          ))}
        </div>
      </div>

      {/* 부트캠프 리스트 */}
      {isLoading ? (
        <div className="flex h-48 items-center justify-center">
          <div className="size-8 animate-spin rounded-full border-4 border-muted border-t-primary" />
        </div>
      ) : lecturesData && lecturesData.length > 0 ? (
        <motion.div
          key={resolvedCategoryId}
          initial="hidden"
          animate="visible"
          className="flex flex-col gap-3 md:flex-row md:justify-center md:gap-6"
        >
          {lecturesData.slice(0, 4).map((lecture, index) => (
            <motion.div
              key={lecture.lectureId}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.12 }}
            >
              <BootcampListItem lecture={lecture} />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <div className="flex h-48 flex-col items-center justify-center gap-3 text-muted-foreground">
          <div className="rounded-full bg-muted/50 p-4">
            <span className="text-2xl">🔍</span>
          </div>
          <span>모집 중인 강의가 없습니다.</span>
        </div>
      )}

      {/* 더보기 버튼 */}
      <Button variant="outline" className="mx-auto h-auto min-w-[320px] gap-2 rounded-full px-8 py-4 text-base" asChild>
        <Link
          href={
            resolvedCategoryId
              ? `/lectures/search?categoryIds=${resolvedCategoryId}&size=${DEFAULT_PAGE_SIZE}`
              : '/lectures/search'
          }
        >
          <span className="font-bold text-brand-gold">{selectedCategoryName || '전체'}</span> 프로그램 더보기
          <ArrowRight className="size-5" />
        </Link>
      </Button>
      </div>
    </section>
  )
}

interface BootcampListItemProps {
  lecture: LectureResponseDto
}

function BootcampListItem({ lecture }: BootcampListItemProps) {
  const router = useRouter()
  const { items } = useUnifiedCart()
  const { mutate: removeFromCart } = useUnifiedRemoveFromCart()
  const isInCart = items.some((item) => item.lectureId === String(lecture.lectureId))
  const score = lecture.averageScore ?? 0
  const reviewCount = lecture.reviewCount ?? 0
  const hasReviews = score > 0

  // 날짜 포맷
  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return ''
    return dateStr.includes('T') ? dateStr.split('T')[0] : dateStr.slice(0, 10)
  }
  const dateRange =
    lecture.startAt && lecture.endAt
      ? `${formatDate(lecture.startAt)} ~ ${formatDate(lecture.endAt)}`
      : ''

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
      className="flex w-full flex-col gap-6 rounded-xl bg-white p-6 shadow-[4px_4px_20px_rgba(194,147,32,0.25)] transition-all hover:shadow-[4px_4px_24px_rgba(194,147,32,0.35)] md:w-[332px]"
    >
      {/* 콘텐츠 영역 */}
      <div className="flex flex-col gap-3">
        {/* 상단: 카테고리 | 별점 + 리뷰수 + 모집중 */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-[#555555]">{lecture.categoryName || '부트캠프'}</span>
          <div className="flex items-center gap-1">
            <Star
              className={`size-[18px] ${hasReviews ? 'fill-brand-gold text-brand-gold' : 'fill-muted-foreground/40 text-muted-foreground/40'}`}
            />
            <span className="text-base">{score.toFixed(1)}</span>
            <span className="text-xs text-[#555555]">({reviewCount})</span>
            {lecture.status === 'RECRUITING' && (
              <span className="ml-1 flex items-center gap-1 rounded-full bg-emerald-500/20 px-2.5 py-1 text-xs font-medium text-emerald-700">
                <span className="size-1.5 rounded-full bg-emerald-500" />
                모집중
              </span>
            )}
          </div>
        </div>

        {/* 강의명 */}
        <h3 className="line-clamp-3 h-[100px] break-keep text-2xl font-bold">{lecture.lectureName}</h3>

        {/* 기관명 */}
        <span className="text-base text-[#555555]">{lecture.orgName}</span>

        {/* 날짜 */}
        <span className="text-xs text-[#888888]">{dateRange || '-'}</span>

        {/* 태그 */}
        <div className="flex gap-1.5 overflow-hidden">
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
            size="sm"
            className="h-12 flex-1 rounded-lg border-transparent bg-neutral-800 text-base text-brand-gold hover:bg-neutral-800 hover:text-brand-gold"
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
            className="h-12 flex-1 rounded-lg border-transparent bg-brand-gold-light text-base text-[#020202] hover:bg-brand-gold-light"
          >
            관심등록
          </AddToCartButton>
        )}
        <AddToCartButton
          item={{ lectureId: lecture.lectureId }}
          size="sm"
          className="h-12 flex-1 rounded-lg bg-brand-gold text-base text-neutral-700 hover:bg-brand-gold"
          onClick={() => router.push('/cart/compare')}
        >
          비교하기
        </AddToCartButton>
      </div>
    </Link>
  )
}
