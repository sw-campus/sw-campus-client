'use client'

import { LectureCard } from '@/features/lecture/components/LectureCard'
import { Lecture } from '@/features/lecture/types/lecture.type'

interface LectureListProps {
  lectures: Lecture[]
}

export function LectureList({ lectures }: LectureListProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6">
      {lectures.map(lecture => (
        <LectureCard key={lecture.id} lecture={lecture} />
      ))}
    </div>
  )
}
