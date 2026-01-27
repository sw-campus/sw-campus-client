'use client'

import { useState } from 'react'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { useCategoryTree } from '@/features/category'
import { LectureListItem } from '@/features/lecture/components/lecture-list-item'
import { useTopRatedLecturesByCategory } from '@/features/lecture/hooks/use-top-rated-lectures-by-category'
import { DEFAULT_PAGE_SIZE } from '@/features/lecture/types/filter.type'

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
    <section className="flex flex-col gap-6 bg-brand-gold-light px-4 py-[30px] md:custom-container">
      {/* 섹션 헤더 */}
      <div className="flex flex-col gap-4">
        <h2 className="text-center text-xl font-bold md:text-left md:text-2xl">
          수강생 후기 <span className="text-brand-gold">BEST</span> 부트캠프들을
          <br />
          한눈에 살펴보세요.
        </h2>

        {/* 카테고리 탭 */}
        <div className="scrollbar-hide -mx-4 flex gap-2 overflow-x-auto px-4 md:mx-0 md:flex-wrap md:px-0">
          {subcategories.map((category) => (
            <button
              key={category.categoryId}
              onClick={() => setSelectedCategoryId(category.categoryId)}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                resolvedCategoryId === category.categoryId
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
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
        <div className="flex flex-col gap-3 md:grid md:grid-cols-2 md:gap-4">
          {lecturesData.slice(0, 4).map((lecture) => (
            <LectureListItem key={lecture.lectureId} lecture={lecture} />
          ))}
        </div>
      ) : (
        <div className="flex h-48 flex-col items-center justify-center gap-3 text-muted-foreground">
          <div className="rounded-full bg-muted/50 p-4">
            <span className="text-2xl">🔍</span>
          </div>
          <span>모집 중인 강의가 없습니다.</span>
        </div>
      )}

      {/* 더보기 버튼 */}
      <Button variant="outline" className="w-full gap-2" asChild>
        <Link
          href={
            resolvedCategoryId
              ? `/lectures/search?categoryIds=${resolvedCategoryId}&size=${DEFAULT_PAGE_SIZE}`
              : '/lectures/search'
          }
        >
          <span className="font-bold text-brand-gold">{selectedCategoryName || '전체'}</span> 프로그램 더보기
          <ArrowRight className="size-4" />
        </Link>
      </Button>
    </section>
  )
}

