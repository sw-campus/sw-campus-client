import Image from 'next/image'

import { type LectureDetail } from '@/features/lecture/api/lectureApi'

import { Section } from './DetailShared'

interface Props {
  lecture: LectureDetail
}

export default function LectureIntro({ lecture }: Props) {
  return (
    <div className="space-y-8">
      <Section title="강의 소개">
        <p className="text-lg leading-relaxed whitespace-pre-line text-gray-700">{lecture.summary}</p>
      </Section>

      <Section title="강사진 소개">
        {lecture.teachers && lecture.teachers.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {lecture.teachers.map((teacher, idx) => (
              <div
                key={idx}
                className="flex items-start gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all hover:shadow-md"
              >
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full border border-gray-100 bg-gray-50">
                  {teacher.imageUrl ? (
                    <Image src={teacher.imageUrl} alt={teacher.name} fill className="object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-2xl">🧑‍🏫</div>
                  )}
                </div>
                <div>
                  <h4 className="text-lg font-bold text-gray-900">{teacher.name}</h4>
                  <p className="mt-1 line-clamp-2 text-sm text-gray-600">{teacher.desc}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-muted-foreground text-sm">등록된 강사진 정보가 없습니다.</div>
        )}
      </Section>
    </div>
  )
}
