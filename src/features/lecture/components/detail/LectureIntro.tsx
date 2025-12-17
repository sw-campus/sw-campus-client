import Image from 'next/image'

import { type LectureDetail } from '@/features/lecture/api/lectureApi'

import { Section } from './DetailShared'

interface Props {
  lecture: LectureDetail
}

export default function LectureIntro({ lecture }: Props) {
  return (
    <div className="space-y-8">
      {/* 훈련 목표 */}
      {lecture.goal && (
        <Section title="훈련 목표">
          <div className="space-y-3">
            {lecture.goal
              .split('\n')
              .filter(line => line.trim())
              .map((line, idx) => {
                // 숫자.로 시작하면 숫자 부분 제거 (예: "1.내용" → "내용")
                const cleanLine = line.replace(/^\d+\.?\s*/, '')
                return (
                  <div
                    key={idx}
                    className="flex items-start gap-4 rounded-xl border border-gray-100 bg-white px-5 py-4 shadow-sm ring-1 ring-black/5 transition-all hover:shadow-md hover:ring-orange-100"
                  >
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-orange-100 text-sm font-bold text-orange-600">
                      {idx + 1}
                    </div>
                    <p className="text-base leading-relaxed text-gray-900">{cleanLine}</p>
                  </div>
                )
              })}
          </div>
        </Section>
      )}

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
