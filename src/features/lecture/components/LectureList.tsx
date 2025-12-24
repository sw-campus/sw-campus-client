'use client'

import { LectureCard } from '@/features/lecture/components/LectureCard'
import { Lecture } from '@/features/lecture/types/lecture.type'

interface LectureListProps {
  lectures: Lecture[]
}

export function LectureList({ lectures }: LectureListProps) {
  return (
    <div className="grid gap-6" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
      {lectures.map(lecture => (
        <LectureCard key={lecture.id} lecture={lecture} />
      ))}
    </div>
  )
}
