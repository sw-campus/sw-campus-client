'use client'

import { useState } from 'react'

import { AnimatePresence, motion, Variants } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { FiArrowRight } from 'react-icons/fi'

import { useCategoryTree } from '@/features/category'
import { LectureList } from '@/features/lecture/components/LectureList'
import { LectureFilterTabs } from '@/features/lecture/components/lecture-search/LectureFilterTabs'
import { useTopRatedLecturesByCategory } from '@/features/lecture/hooks/useTopRatedLecturesByCategory'
import { DEFAULT_PAGE_SIZE } from '@/features/lecture/types/filter.type'
import { mapLectureResponseToSummary } from '@/features/lecture/utils/mapLectureResponseToSummary'

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
}

export default function LectureSection() {
  const router = useRouter()

  // 카테고리 트리에서 첫 번째 대분류의 중분류(children)를 가져옴
  const { data: categoryTree } = useCategoryTree()
  const subcategories = categoryTree?.[0]?.children ?? []

  // 선택된 중분류 ID
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null)

  // 선택값이 없으면 첫 번째 중분류를 자동 선택처럼 동작
  const resolvedCategoryId = selectedCategoryId ?? subcategories[0]?.categoryId ?? null

  const categoryNameToId = new Map<string, number>()
  for (const c of subcategories) categoryNameToId.set(c.categoryName, c.categoryId)

  // selectedCategoryId로부터 카테고리명 파생
  const selectedCategoryName = subcategories.find(c => c.categoryId === resolvedCategoryId)?.categoryName ?? ''

  // 선택된 중분류의 평점 높은 강의 조회
  const { data: lecturesData, isLoading } = useTopRatedLecturesByCategory(resolvedCategoryId)

  // API 응답을 LectureSummary 타입으로 변환
  const lectures = (lecturesData ?? []).map(mapLectureResponseToSummary)

  // 탭에 표시할 카테고리명 배열
  const categoryNames = subcategories.map(c => c.categoryName)

  // 탭 선택 핸들러
  const handleTabSelect = (name: string) => {
    const nextId = categoryNameToId.get(name)
    if (nextId !== undefined) setSelectedCategoryId(nextId)
  }

  return (
    <div className="custom-container">
      <motion.div
        className="custom-card relative overflow-hidden"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
      >
        {/* Background Decoration */}
        <div className="bg-accent-foreground/5 pointer-events-none absolute -top-20 -right-20 h-96 w-96 rounded-full blur-3xl" />
        <div className="bg-accent/5 pointer-events-none absolute -bottom-20 -left-20 h-96 w-96 rounded-full blur-3xl" />

        {/* 제목 */}
        <motion.h2
          className="relative z-10 mb-4 text-xl font-bold text-gray-900 sm:mb-6 sm:text-2xl"
          variants={itemVariants}
        >
          {selectedCategoryName || '분야별'} 부트캠프
        </motion.h2>

        {/* 카테고리 탭 */}
        <motion.div variants={itemVariants} className="relative z-10">
          <LectureFilterTabs categories={categoryNames} selected={selectedCategoryName} onSelect={handleTabSelect} />
        </motion.div>

        {/* 카테고리별 부트캠프 리스트 */}
        <motion.div variants={itemVariants} className="relative z-10 min-h-75">
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex h-48 items-center justify-center"
              >
                <div className="border-accent/30 border-t-accent-foreground h-8 w-8 animate-spin rounded-full border-4" />
              </motion.div>
            ) : lectures.length > 0 ? (
              <motion.div
                key={resolvedCategoryId}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <LectureList lectures={lectures} />
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="text-muted-foreground flex h-48 flex-col items-center justify-center gap-3"
              >
                <div className="bg-muted/50 rounded-full p-4">
                  <span className="text-2xl">🔍</span>
                </div>
                <span>모집중인 강의가 없습니다.</span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* 더보기 버튼 */}
        <motion.div variants={itemVariants} className="relative z-10 mt-10 flex justify-center">
          <motion.button
            onClick={() => router.push(`/lectures/search?categoryIds=${resolvedCategoryId}&size=${DEFAULT_PAGE_SIZE}`)}
            disabled={resolvedCategoryId === null}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`group flex items-center gap-2 rounded-full px-8 py-3 text-sm font-medium transition-all ${
              resolvedCategoryId === null
                ? 'bg-muted text-muted-foreground cursor-not-allowed'
                : 'hover:shadow-accent/10 bg-linear-to-r from-zinc-800 to-zinc-900 text-white shadow-lg ring-1 shadow-black/20 ring-white/10 hover:from-zinc-700 hover:to-zinc-800 hover:shadow-xl'
            }`}
          >
            <span className={resolvedCategoryId === null ? 'text-muted-foreground' : 'text-accent font-semibold'}>
              {selectedCategoryName || '카테고리'}
            </span>
            <span>프로그램 더 보기</span>
            <motion.span animate={{ x: [0, 4, 0] }} transition={{ repeat: Infinity, duration: 1.5, repeatDelay: 1 }}>
              <FiArrowRight size={16} />
            </motion.span>
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  )
}
