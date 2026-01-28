'use client'

import { useState } from 'react'

import { Star } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { AiComparePreview } from '@/components/common/ai-compare-preview'
import { InterestLectureList } from '@/components/common/interest-lecture-list'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { InterestLectureSection, ComparisonCard } from '@/features/bootcamp-list'
import { useUnifiedCart } from '@/features/cart/hooks/use-unified-cart'
import { useUnifiedRemoveFromCart } from '@/features/cart/hooks/use-unified-remove-from-cart'
import type { CartItem } from '@/features/cart/types/cart.type'
import { useCartCompareStore } from '@/store/cart-compare.store'

export function AiCompareSection() {
  const router = useRouter()
  const { items, isLoading } = useUnifiedCart()
  const { mutate: removeFromCart } = useUnifiedRemoveFromCart()
  const { setLeftId, setRightId } = useCartCompareStore()

  // 고정 슬롯: [왼쪽, 오른쪽] — 초기 빈 상태, 해제 시 해당 자리만 비움
  const [selectedSlots, setSelectedSlots] = useState<[string | null, string | null]>([null, null])

  // 모바일 관심 과정 섹션 토글
  const [isInterestSectionOpen, setIsInterestSectionOpen] = useState(false)

  // InterestLectureList용 selectedIds (null 제외)
  const selectedIds = selectedSlots.filter((id): id is string => id !== null)

  // 선택 토글 함수 (고정 슬롯)
  const toggleSelect = (lectureId: string) => {
    setSelectedSlots(prev => {
      if (prev[0] === lectureId) return [null, prev[1]]
      if (prev[1] === lectureId) return [prev[0], null]
      if (prev[0] === null) return [lectureId, prev[1]]
      if (prev[1] === null) return [prev[0], lectureId]
      return [lectureId, prev[1]]
    })
  }

  // 카트에서 제거 시 선택 슬롯에서도 제거
  const handleRemoveFromCart = (lectureId: string) => {
    removeFromCart(lectureId)
    setSelectedSlots(prev => [prev[0] === lectureId ? null : prev[0], prev[1] === lectureId ? null : prev[1]])
  }

  // 비교 페이지로 이동
  const handleGoToCompare = () => {
    if (selectedSlots[0] && selectedSlots[1]) {
      setLeftId(selectedSlots[0])
      setRightId(selectedSlots[1])
    }
    router.push('/cart/compare')
  }

  // 비교할 과정들 (슬롯 순서 유지, null이면 null)
  const compareSlots: (CartItem | null)[] = selectedSlots.map(id =>
    id !== null ? (items.find(item => item.lectureId === id) ?? null) : null,
  )

  // 카테고리 잠금: 선택된 항목 중 첫 번째의 카테고리
  const firstSelected = compareSlots.find(item => item !== null)
  const lockedCategory = firstSelected ? (firstSelected.categoryName ?? null) : null

  if (isLoading) {
    return (
      <section className="container-responsive flex flex-col items-center gap-4 pt-[30px] pb-4 md:gap-6 md:pt-[100px] md:pb-[50px]">
        <h2 className="text-foreground text-center text-xl font-bold md:text-[32px]">
          <span className="text-brand-gold">AI 비교분석</span> 기능으로
          <br className="md:hidden" /> 최적의 강의를 한눈에 비교해보세요.
        </h2>
        <div className="flex h-40 w-full items-center justify-center">
          <span className="text-muted-foreground">로딩 중...</span>
        </div>
      </section>
    )
  }

  if (items.length === 0) {
    return (
      <section className="container-responsive flex flex-col items-center gap-4 pt-[30px] pb-4 md:gap-6 md:pt-[100px] md:pb-[50px]">
        <h2 className="text-foreground text-center text-xl font-bold md:text-[32px]">
          <span className="text-brand-gold">AI 비교분석</span> 기능으로
          <br className="md:hidden" /> 최적의 강의를 한눈에 비교해보세요.
        </h2>
        <Card className="w-full shadow-lg">
          <CardContent className="flex flex-col items-center gap-4 p-8">
            <Star className="text-muted-foreground/50 size-12" />
            <p className="text-muted-foreground text-center text-sm">관심 과정을 등록하면 AI가 비교 분석해드려요.</p>
            <Button asChild>
              <Link href="/lectures/search?categoryIds=1&size=12">강의 둘러보기</Link>
            </Button>
          </CardContent>
        </Card>
      </section>
    )
  }

  return (
    <section className="container-responsive flex flex-col items-center gap-4 pt-[30px] pb-4 md:gap-6 md:pt-[100px] md:pb-[50px]">
      {/* 섹션 타이틀 — 데스크톱에서만 표시 (모바일은 InterestLectureSection의 closedMessage 사용) */}
      <h2 className="text-foreground hidden text-center text-xl font-bold md:block md:text-[32px]">
        <span className="text-brand-gold">AI 비교분석</span> 기능으로
        <br className="md:hidden" /> 최적의 강의를 한눈에 비교해보세요.
      </h2>

      {/* ========== MOBILE LAYOUT ========== */}
      <div className="flex w-full flex-col gap-4 md:hidden">
        {/* 관심 과정 섹션 (아코디언) — lectures/search 모바일과 동일 */}
        <InterestLectureSection
          items={items}
          selectedIds={selectedIds}
          onToggleSelect={toggleSelect}
          onRemove={handleRemoveFromCart}
          isOpen={isInterestSectionOpen}
          onToggleOpen={() => setIsInterestSectionOpen(prev => !prev)}
          isLoading={isLoading}
          closedMessage={
            <p className="text-center text-base leading-relaxed text-[#020202]">
              <span className="font-semibold text-[#FEB706]">AI 비교분석 기능</span>으로
              <br />
              최적의 강의를 한 눈에 비교해보세요.
            </p>
          }
        />

        {/* VS 비교 섹션 — 열려있고 2개 선택 시 표시 */}
        {isInterestSectionOpen && selectedIds.length >= 2 && (
          <div className="flex w-full flex-col gap-4">
            <div className="relative flex items-center gap-4">
              <ComparisonCard
                title={items.find(c => c.lectureId === selectedIds[0])?.title || ''}
                imageUrl={items.find(c => c.lectureId === selectedIds[0])?.thumbnailUrl || ''}
              />

              {/* VS Badge */}
              <div className="absolute top-1/2 left-1/2 z-10 flex h-[45px] w-[45px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[#020202]">
                <span className="text-base font-bold text-[#FEB706]">VS</span>
              </div>

              <ComparisonCard
                title={items.find(c => c.lectureId === selectedIds[1])?.title || ''}
                imageUrl={items.find(c => c.lectureId === selectedIds[1])?.thumbnailUrl || ''}
              />
            </div>

            {/* AI 비교 분석 버튼 */}
            <button
              onClick={handleGoToCompare}
              className="flex h-10 w-full items-center justify-center rounded-xl bg-[#F9F9F9] shadow-[2px_2px_10px_rgba(161,161,170,0.25)]"
            >
              <span className="text-xs text-[#020202]">AI 비교 분석 자세히 보기</span>
            </button>
          </div>
        )}
      </div>

      {/* ========== DESKTOP LAYOUT — 1:3 비율 ========== */}
      <div className="hidden h-[clamp(300px,50vh,500px)] w-full gap-4 md:grid md:grid-cols-4">
        {/* 관심 과정 카드 (1/4) */}
        <Card className="min-h-0 shadow-lg">
          <CardContent className="flex min-h-0 flex-1 flex-col px-4">
            <InterestLectureList
              items={items}
              selectedIds={selectedIds}
              onToggleSelect={toggleSelect}
              onRemove={handleRemoveFromCart}
              lockedCategory={lockedCategory}
              variant="card"
              className="min-h-0 flex-1"
            />
          </CardContent>
        </Card>

        {/* VS 비교 프리뷰 (3/4) */}
        <div className="col-span-3 flex min-h-0">
          <AiComparePreview selectedItems={compareSlots} />
        </div>
      </div>
    </section>
  )
}
