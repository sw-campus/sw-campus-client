'use client'

import { Badge } from '@/components/ui/badge'
import { type LectureDetail } from '@/features/lecture/api/lectureApi'

import { Section } from './DetailShared'

interface Props {
  curriculum: LectureDetail['curriculum']
  specialCurriculums?: LectureDetail['specialCurriculums']
}

export default function LectureCurriculum({ curriculum, specialCurriculums }: Props) {
  const sortedSpecialCurriculums = specialCurriculums
    ? [...specialCurriculums].sort((a, b) => a.sortOrder - b.sortOrder)
    : []

  return (
    <div className="space-y-12">
      {/* 메인 커리큘럼 */}
      <Section title="메인 커리큘럼">
        {curriculum.length > 0 ? (
          <div className="flex flex-col gap-3">
            {curriculum.map((item, idx) => {
              let levelText = '없음'
              let badgeColor = 'bg-muted text-muted-foreground'

              if (item.level === 'BASIC') {
                levelText = '기본'
                badgeColor = 'bg-blue-100 text-blue-700 border-blue-200'
              } else if (item.level === 'ADVANCED') {
                levelText = '심화'
                badgeColor = 'bg-purple-100 text-purple-700 border-purple-200'
              }

              return (
                <div
                  key={`${item.name}-${item.level}-${idx}`}
                  className="flex flex-col gap-2 rounded-xl border border-gray-100 bg-white px-4 py-3 shadow-sm hover:bg-gray-50/50 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:px-5 sm:py-4"
                >
                  <div className="flex items-center gap-3 sm:gap-4">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gray-100 text-xs font-bold text-gray-500">
                      {idx + 1}
                    </span>
                    <span className="text-sm font-medium text-gray-900 sm:text-base">{item.name}</span>
                  </div>
                  <Badge
                    variant="outline"
                    className={`shrink-0 self-start border ${badgeColor} rounded-md px-2 py-0.5 text-xs font-medium sm:self-auto sm:px-2.5 sm:py-1`}
                  >
                    {levelText}
                  </Badge>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="text-muted-foreground text-sm">등록된 커리큘럼이 없습니다.</div>
        )}
      </Section>

      {/* 특화 커리큘럼 - 데이터가 있을 때만 표시 */}
      {sortedSpecialCurriculums.length > 0 && (
        <Section title="특화 커리큘럼">
          <div className="flex flex-col gap-3">
            {sortedSpecialCurriculums.map((item, idx) => (
              <SpecialCurriculumItem key={item.specialCurriculumId ?? idx} item={item} index={idx} />
            ))}
          </div>
        </Section>
      )}
    </div>
  )
}

interface SpecialCurriculumItemProps {
  item: NonNullable<LectureDetail['specialCurriculums']>[number]
  index: number
}

function SpecialCurriculumItem({ item, index }: SpecialCurriculumItemProps) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white px-4 py-3 shadow-sm">
      <div className="flex items-center gap-3">
        <span className="flex size-6 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
          {index + 1}
        </span>
        <span className="text-sm font-medium text-gray-900">{item.title}</span>
      </div>
    </div>
  )
}
