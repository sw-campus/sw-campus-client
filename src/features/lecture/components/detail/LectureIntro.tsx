import Image from 'next/image'

import { Badge } from '@/components/ui/badge'
import { type LectureDetail } from '@/features/lecture/api/lectureApi'

import { Section, InfoBox, InfoRow } from './DetailShared'

interface Props {
  lecture: LectureDetail
}

// 서비스 항목 라벨 매핑
const SERVICE_LABELS: Record<keyof LectureDetail['services'], string> = {
  books: '교재 제공',
  resume: '이력서 첨삭',
  mockInterview: '모의 면접',
  employmentHelp: '취업 지원',
  afterCompletion: '수료 후 지원',
}

// 체크 아이콘 컴포넌트
function CheckIcon({ checked }: { checked: boolean }) {
  return checked ? (
    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100 text-green-600">
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
    </span>
  ) : (
    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 text-gray-400">
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </span>
  )
}

export default function LectureIntro({ lecture }: Props) {
  // 지원 서비스 데이터 확인 (하나라도 true인지)
  const hasAnyService = Object.values(lecture.services).some(Boolean)

  // 프로젝트 정보 확인
  const hasProjectInfo =
    lecture.project.num > 0 ||
    lecture.project.time > 0 ||
    lecture.project.team ||
    lecture.project.tool ||
    lecture.project.mentor

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

      {/* 지원 서비스 */}
      <Section title="지원 서비스">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
          {(Object.entries(lecture.services) as [keyof LectureDetail['services'], boolean][]).map(([key, value]) => (
            <div
              key={key}
              className={`flex flex-col items-center gap-2 rounded-xl border p-4 transition-all ${
                value ? 'border-green-200 bg-green-50/50 shadow-sm' : 'border-gray-100 bg-gray-50/50'
              }`}
            >
              <CheckIcon checked={value} />
              <span className={`text-center text-sm font-medium ${value ? 'text-gray-900' : 'text-gray-400'}`}>
                {SERVICE_LABELS[key]}
              </span>
            </div>
          ))}
        </div>
      </Section>

      {/* 프로젝트 정보 */}
      {hasProjectInfo && (
        <Section title="프로젝트 정보">
          <InfoBox>
            {lecture.project.num > 0 && (
              <InfoRow label="프로젝트 수">
                <span className="font-bold text-orange-600">{lecture.project.num}개</span>
              </InfoRow>
            )}
            {lecture.project.time > 0 && (
              <InfoRow label="프로젝트 기간">
                <span className="font-medium">{lecture.project.time}주</span>
              </InfoRow>
            )}
            {lecture.project.team && (
              <InfoRow label="팀 구성">
                <Badge variant="secondary" className="rounded-lg px-3 py-1 text-sm">
                  {lecture.project.team}
                </Badge>
              </InfoRow>
            )}
            {lecture.project.tool && (
              <InfoRow label="협업 도구">
                <Badge
                  variant="outline"
                  className="rounded-lg border-blue-200 bg-blue-50/50 px-3 py-1 text-sm text-blue-700"
                >
                  {lecture.project.tool}
                </Badge>
              </InfoRow>
            )}
            {lecture.project.mentor && (
              <InfoRow label="멘토 지원">
                <span className="flex items-center gap-1.5 font-medium text-green-600">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  멘토 지원 있음
                </span>
              </InfoRow>
            )}
          </InfoBox>
        </Section>
      )}
    </div>
  )
}
