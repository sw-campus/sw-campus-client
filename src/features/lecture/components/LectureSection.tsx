'use client'

import { useState, useEffect, useMemo } from 'react'

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

  // 선택된 중분류 ID 및 이름
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null)
  const [selectedCategoryName, setSelectedCategoryName] = useState<string>('')

  // 중분류가 로드되면 첫 번째 중분류를 기본값으로 설정
  useEffect(() => {
    if (subcategories.length > 0 && selectedCategoryId === null) {
      setSelectedCategoryId(subcategories[0].categoryId)
      setSelectedCategoryName(subcategories[0].categoryName)
    }
  }, [subcategories, selectedCategoryId])

  // 선택된 중분류의 평점 높은 강의 조회
  const { data: lecturesData, isLoading } = useTopRatedLecturesByCategory(selectedCategoryId)

  // API 응답을 LectureSummary 타입으로 변환
  const lectures = useMemo(() => (lecturesData ?? []).map(mapLectureResponseToSummary), [lecturesData])

  // 탭에 표시할 카테고리명 배열
  const categoryNames = useMemo(() => subcategories.map(c => c.categoryName), [subcategories])

  // 탭 선택 핸들러
  const handleTabSelect = (name: string) => {
    const category = subcategories.find(c => c.categoryName === name)
    if (category) {
      setSelectedCategoryId(category.categoryId)
      setSelectedCategoryName(category.categoryName)
    }
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
            onClick={() => router.push(`/lectures/search?categoryIds=${selectedCategoryId}`)}
            className="flex items-center gap-2 rounded-full bg-black/30 px-8 py-3 text-sm text-white transition hover:bg-black/50"
          >
            <span className="text-orange-300">{selectedCategoryName}</span>프로그램 더 보기 <FiArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}

