'use client'

import { useState } from 'react'

import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { useCategoryTree } from '@/features/category'
import { useTopRatedLecturesByCategory } from '@/features/lecture/hooks/use-top-rated-lectures-by-category'
import { DEFAULT_PAGE_SIZE } from '@/features/lecture/types/filter.type'

import { BootcampListItem } from './bootcamp-list-item'

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
  const selectedCategoryName = subcategories.find(c => c.categoryId === resolvedCategoryId)?.categoryName ?? ''

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
            {subcategories.map(category => (
              <button
                key={category.categoryId}
                onClick={() => setSelectedCategoryId(category.categoryId)}
                className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  resolvedCategoryId === category.categoryId
                    ? 'bg-primary text-primary-foreground'
                    : 'border-border bg-muted text-muted-foreground hover:bg-muted/80 border'
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
            <div className="border-muted border-t-primary size-8 animate-spin rounded-full border-4" />
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
          <div className="text-muted-foreground flex h-48 flex-col items-center justify-center gap-3">
            <div className="bg-muted/50 rounded-full p-4">
              <span className="text-2xl">🔍</span>
            </div>
            <span>모집 중인 강의가 없습니다.</span>
          </div>
        )}

        {/* 더보기 버튼 */}
        <Button
          variant="outline"
          className="mx-auto h-auto min-w-[320px] gap-2 rounded-full px-8 py-4 text-base"
          asChild
        >
          <Link
            href={
              resolvedCategoryId
                ? `/lectures/search?categoryIds=${resolvedCategoryId}&size=${DEFAULT_PAGE_SIZE}`
                : '/lectures/search'
            }
          >
            <span className="text-brand-gold font-bold">{selectedCategoryName || '전체'}</span> 프로그램 더보기
            <ArrowRight className="size-5" />
          </Link>
        </Button>
      </div>
    </section>
  )
}
