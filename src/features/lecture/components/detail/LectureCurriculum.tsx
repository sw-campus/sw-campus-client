import { Badge } from '@/components/ui/badge'
import { type LectureDetail } from '@/features/lecture/api/lectureApi'

import { Section } from './DetailShared'

interface Props {
  curriculum: LectureDetail['curriculum']
}

export default function LectureCurriculum({ curriculum }: Props) {
  return (
    <Section title="커리큘럼">
      {curriculum.length > 0 ? (
        <div className="flex flex-col gap-3">
          {curriculum.map((item, idx) => {
            let levelText = '기타'
            let badgeColor = 'bg-gray-100 text-gray-600'

            if (item.level === 'BASIC') {
              levelText = '기본'
              badgeColor = 'bg-blue-50 text-blue-700 border-blue-100'
            } else if (item.level === 'ADVANCED') {
              levelText = '심화'
              badgeColor = 'bg-purple-50 text-purple-700 border-purple-100'
            }

            return (
              <div
                key={idx}
                className="flex items-center justify-between rounded-xl border border-gray-100 bg-white px-5 py-4 shadow-sm hover:bg-gray-50/50"
              >
                <div className="flex items-center gap-4">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gray-100 text-xs font-bold text-gray-500">
                    {idx + 1}
                  </span>
                  <span className="font-medium text-gray-900">{item.name}</span>
                </div>
                <Badge variant="outline" className={`shrink-0 border ${badgeColor} rounded-md px-2.5 py-1 font-medium`}>
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
  )
}
