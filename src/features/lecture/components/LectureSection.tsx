'use client'

import { useMemo, useState } from 'react'

import { useRouter } from 'next/navigation'
import { FiArrowRight } from 'react-icons/fi'

import { useCategoryTree } from '@/features/category'
import { LectureList } from '@/features/lecture/components/LectureList'
import { LectureFilterTabs } from '@/features/lecture/components/lecture-search/LectureFilterTabs'
import { useTopRatedLecturesByCategory } from '@/features/lecture/hooks/useTopRatedLecturesByCategory'
import { mapLectureResponseToSummary } from '@/features/lecture/utils/mapLectureResponseToSummary'

export default function LectureSection() {
  const router = useRouter()

  // 카테고리 트리에서 첫 번째 대분류의 중분류(children)를 가져옴
  const { data: categoryTree } = useCategoryTree()
  const subcategories = useMemo(() => categoryTree?.[0]?.children ?? [], [categoryTree])

  // 선택된 중분류 ID
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null)

  // 선택값이 없으면 첫 번째 중분류를 자동 선택처럼 동작
  const resolvedCategoryId = selectedCategoryId ?? subcategories[0]?.categoryId ?? null

  const categoryNameToId = useMemo(() => {
    const map = new Map<string, number>()
    for (const c of subcategories) map.set(c.categoryName, c.categoryId)
    return map
  }, [subcategories])

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
      <div className="custom-card">
        {/* 제목 */}
        <h2 className="mb-6 text-2xl font-bold text-white">분야별 부트캠프</h2>

        {/* 카테고리 탭 */}
        <LectureFilterTabs categories={categoryNames} selected={selectedCategoryName} onSelect={handleTabSelect} />

        {/* 카테고리별 부트캠프 리스트 */}
        {isLoading ? (
          <div className="flex h-48 items-center justify-center">
            <span className="text-gray-400">로딩 중...</span>
          </div>
        ) : lectures.length > 0 ? (
          <LectureList lectures={lectures} />
        ) : (
          <div className="flex h-48 items-center justify-center">
            <span className="text-gray-400">해당 분야의 강의가 없습니다.</span>
          </div>
        )}

        {/* 더보기 버튼 */}
        <div className="mt-10 flex justify-center">
          <button
            onClick={() => router.push(`/lectures/search?categoryIds=${resolvedCategoryId}`)}
            disabled={resolvedCategoryId === null}
            className={`flex items-center gap-2 rounded-full px-8 py-3 text-sm transition ${
              resolvedCategoryId === null
                ? 'cursor-not-allowed bg-black/20 text-gray-500'
                : 'bg-black/30 text-white hover:bg-black/50'
            }`}
          >
            <span className={resolvedCategoryId === null ? 'text-gray-500' : 'text-orange-300'}>
              {selectedCategoryName || '카테고리'}
            </span>
            프로그램 더 보기 <FiArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}
