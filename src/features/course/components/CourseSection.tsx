'use client'

import { useState } from 'react'

import { useRouter } from 'next/navigation'
import { FiArrowRight } from 'react-icons/fi'

import { mockCourses } from '@/features/course/api/mockCourses'
import { CourseFilterTabs } from '@/features/course/components/CourseFilterTabs'
import { CourseList } from '@/features/course/components/CourseList'

const CATEGORIES = [
  '웹개발',
  '모바일',
  '데이터·AI',
  '클라우드',
  '보안',
  '임베디드(IoT)',
  '게임·블록체인',
  '기획·마케팅·디자인',
]

export default function CourseSection() {
  const router = useRouter()
  const [category, setCategory] = useState(CATEGORIES[0]) // 기본값은 첫 번째 카테고리

  return (
    <div className="custom-container">
      <div className="custom-card">
        {/* 제목 */}
        <h2 className="mb-6 text-2xl font-bold text-white">분야별 부트캠프</h2>

        {/* 카테고리 탭 */}
        <CourseFilterTabs categories={CATEGORIES} selected={category} onSelect={setCategory} />

        {/* 카테고리별 부트캠프 리스트 */}
        <CourseList courses={mockCourses} />

        {/* 더보기 버튼 */}
        <div className="mt-10 flex justify-center">
          <button
            // onClick={() => router.push(`/courses?category=${encodeURIComponent(category)}`)}
            className="flex items-center gap-2 rounded-full bg-black/30 px-8 py-3 text-sm text-white transition hover:bg-black/50"
          >
            <span className="text-orange-300">{category}</span>프로그램 더 보기 <FiArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}
