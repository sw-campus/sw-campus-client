'use client'

import { useState } from 'react'

import { Star } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useUnifiedCart } from '@/features/cart/hooks/use-unified-cart'
import type { CartItem } from '@/features/cart/types/cart.type'

export function AiCompareSection() {
  const { items, isLoading } = useUnifiedCart()

  // 사용자가 수동으로 선택을 변경했는지 여부
  const [hasUserSelected, setHasUserSelected] = useState(false)
  const [userSelectedIds, setUserSelectedIds] = useState<string[]>([])

  // 기본 선택값 (처음 2개)
  const defaultSelectedIds =
    items.length >= 2
      ? [items[0].lectureId, items[1].lectureId]
      : items.length === 1
        ? [items[0].lectureId]
        : []

  // 실제 선택된 ID들: 사용자가 선택했으면 그것, 아니면 기본값
  const selectedIds = hasUserSelected ? userSelectedIds : defaultSelectedIds

  // 선택 토글 함수
  const toggleSelect = (lectureId: string) => {
    setHasUserSelected(true)
    const currentIds = hasUserSelected ? userSelectedIds : defaultSelectedIds

    let newIds: string[]
    if (currentIds.includes(lectureId)) {
      // 이미 선택됨 → 해제
      newIds = currentIds.filter(id => id !== lectureId)
    } else if (currentIds.length < 2) {
      // 2개 미만이면 추가
      newIds = [...currentIds, lectureId]
    } else {
      // 2개 이상이면 첫 번째 제거하고 새로 추가
      newIds = [currentIds[1], lectureId]
    }
    setUserSelectedIds(newIds)
  }

  // 비교할 과정들
  const compareCourses = items.filter(item => selectedIds.includes(item.lectureId))

  if (isLoading) {
    return (
      <section className="container-responsive flex flex-col items-center gap-4 pt-[30px] pb-4 md:gap-6 md:pt-[100px] md:pb-[50px]">
        <h2 className="text-foreground text-center text-xl font-bold md:text-[32px]">
          <span className="text-brand-gold">AI 비교분석</span> 기능으로
          <br className="md:hidden" />{' '}
          최적의 강의를 한눈에 비교해보세요.
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
          <br className="md:hidden" />{' '}
          최적의 강의를 한눈에 비교해보세요.
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
      {/* 섹션 타이틀 */}
      <h2 className="text-foreground text-center text-xl font-bold md:text-[32px]">
        <span className="text-brand-gold">AI 비교분석</span> 기능으로
        <br />
        최적의 강의를 한눈에 비교해보세요.
      </h2>

      {/* 모바일: 세로 배치 / 데스크톱: 가로 배치 */}
      <div className="flex w-full flex-col gap-4 md:flex-row md:gap-8">
        {/* 관심 과정 카드 */}
        <Card className="w-full shadow-lg md:flex-1">
          <CardContent className="flex flex-col gap-2 px-4">
            <h3 className="pl-1 text-base font-semibold">관심 과정</h3>

            <div className="scrollbar-hide flex max-h-[160px] flex-col gap-3 overflow-y-auto overflow-x-visible p-1">
              {items.map(course => (
                <CourseItem
                  key={course.lectureId}
                  course={course}
                  isSelected={selectedIds.includes(course.lectureId)}
                  onClick={() => toggleSelect(course.lectureId)}
                />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* VS 비교 카드 */}
        {compareCourses.length >= 2 && (
          <div className="flex w-full flex-col gap-4 md:flex-1">
            <div className="relative flex items-center gap-4">
              {/* 좌측 과정 */}
              <CompareCard course={compareCourses[0]} />

              {/* VS 뱃지 - 중앙 절대 위치 */}
              <div className="absolute left-1/2 top-1/2 z-10 flex size-[45px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-foreground text-base font-bold text-brand-gold">
                VS
              </div>

              {/* 우측 과정 */}
              <CompareCard course={compareCourses[1]} />
            </div>

            {/* CTA 버튼 */}
            <Button variant="secondary" className="h-10 w-full rounded-xl text-xs shadow-sm" asChild>
              <Link href="/cart/compare">AI 비교 분석 자세히 보기</Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  )
}

interface CourseItemProps {
  course: CartItem
  isSelected?: boolean
  onClick?: () => void
}

function CourseItem({ course, isSelected = false, onClick }: CourseItemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-xl p-3 text-left transition-all ${
        isSelected
          ? 'bg-brand-gold-light/50 outline-brand-gold/50 outline outline-1'
          : 'bg-muted/50 outline-border hover:bg-muted outline outline-1'
      }`}
    >
      {/* 썸네일 */}
      <div className="bg-muted relative size-[46px] shrink-0 overflow-hidden rounded-lg">
        {course.thumbnailUrl ? (
          <Image src={course.thumbnailUrl} alt={course.title} fill className="object-cover" />
        ) : (
          <div className="flex size-full items-center justify-center">
            <Star className="text-muted-foreground size-5" />
          </div>
        )}
      </div>

      {/* 정보 */}
      <div className="flex min-w-0 flex-col gap-1">
        <p className="truncate text-sm font-medium">{course.title}</p>
        <span className="text-muted-foreground text-xs">{course.categoryName || '카테고리'}</span>
      </div>
    </button>
  )
}

interface CompareCardProps {
  course: CartItem
}

function CompareCard({ course }: CompareCardProps) {
  return (
    <div className="flex flex-1 flex-col gap-3 rounded-xl bg-white p-3 shadow-[4px_4px_20px_rgba(161,161,170,0.25)]">
      {/* 썸네일 */}
      <div className="bg-muted relative h-[86px] w-full overflow-hidden rounded-lg">
        {course.thumbnailUrl ? (
          <Image src={course.thumbnailUrl} alt={course.title} fill className="object-cover" />
        ) : (
          <div className="flex size-full items-center justify-center">
            <Star className="text-muted-foreground size-6" />
          </div>
        )}
      </div>

      {/* 타이틀 */}
      <p className="line-clamp-2 break-keep text-center text-sm font-bold">{course.title}</p>
    </div>
  )
}
