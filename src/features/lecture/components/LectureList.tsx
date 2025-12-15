'use client'

import { LectureCard } from '@/features/lecture/components/LectureCard'
import { Lecture } from '@/features/lecture/types/lecture.type'

interface LectureListProps {
  lectures: Lecture[]
}

export function LectureList({ lectures }: LectureListProps) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {lectures.map(lecture => (
        <LectureCard key={lecture.id} lecture={lecture} />
      ))}
    </div>
  )
}
