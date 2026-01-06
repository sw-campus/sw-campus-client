'use client'

import { LectureCard } from '@/features/lecture/components/LectureCard'
import { Lecture } from '@/features/lecture/types/lecture.type'
import { cn } from '@/lib/utils'

interface LectureListProps {
  lectures: Lecture[]
  /** 
   * 최대 열 개수 (기본값: 4)
   * - 3: 검색 페이지 (사이드바가 있어 공간이 좁음)
   * - 4: 메인 페이지 (전체 너비 사용)
   */
  maxColumns?: 3 | 4
}

export function LectureList({ lectures, maxColumns = 4 }: LectureListProps) {
  return (
    <div 
      className={cn(
        'grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6',
        maxColumns === 4 && 'xl:grid-cols-4'
      )}
    >
      {lectures.map(lecture => (
        <LectureCard key={lecture.id} lecture={lecture} />
      ))}
    </div>
  )
}
