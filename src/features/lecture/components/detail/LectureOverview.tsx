import Image from 'next/image'
import Link from 'next/link'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { type LectureDetail } from '@/features/lecture/api/lectureApi'
import { type OrganizationDetail } from '@/features/organization/types/organization.type'

import { Section, InfoBox, InfoRow, RequirementItem, InlineBadge, formatDateDot, formatKRW } from './DetailShared'

interface Props {
  lecture: LectureDetail
  org?: OrganizationDetail
  displaySummary: string
  isLoading: boolean
  isAiLoading: boolean
}

export default function LectureOverview({ lecture, org, displaySummary, isLoading, isAiLoading }: Props) {
  return (
    <div className="space-y-12">
      {/* 프로그램 요약 */}
      <Section title="프로그램 요약">
        {isLoading ? (
          <div className="py-4 text-center text-gray-500">기본 정보 로딩 중...</div>
        ) : isAiLoading ? (
          <div className="flex animate-pulse items-center gap-2 py-4 text-orange-600">
            <span className="text-xl">✨</span>
            <span>Gemini 3.0이 강의를 분석하여 요약하고 있습니다...</span>
          </div>
        ) : (
          <div className="text-lg leading-loose font-medium text-gray-900">
            {displaySummary
              .split('\n')
              .filter(line => line.trim())
              .map((line, i) => (
                <div key={i} className="mb-2">
                  {line.split(/(\[.*?\])/g).map((part, j) => {
                    if (part.startsWith('[') && part.endsWith(']')) {
                      return <InlineBadge key={j}>{part.slice(1, -1)}</InlineBadge>
                    }
                    return (
                      <span key={j} className="text-gray-500">
                        {part}
                      </span>
                    )
                  })}
                </div>
              ))}
          </div>
        )}
      </Section>

      {/* 교육기관 정보 */}
      {org && (
        <Section title="교육기관 정보">
          <div className="flex flex-col gap-5 rounded-xl border border-gray-100 bg-white p-6 shadow-sm sm:flex-row sm:items-center">
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full border border-gray-100 bg-white">
              {org.logoUrl ? (
                <Image src={org.logoUrl} alt={org.name} fill className="object-contain p-1" />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gray-50 text-xs text-gray-400">
                  Logo
                </div>
              )}
            </div>
            <div className="flex-1">
              <h4 className="text-lg font-bold text-gray-900">{org.name}</h4>
              <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-gray-600">
                {org.description || '기관 소개가 없습니다.'}
              </p>
            </div>
            <Button
              asChild
              variant="outline"
              className="shrink-0 rounded-lg border-gray-200 text-gray-700 hover:bg-gray-50"
            >
              <Link href={`/organization/${org.id}`}>자세히 보기</Link>
            </Button>
          </div>
        </Section>
      )}

      {/* 일정 & 수업 */}
      <Section title="일정 & 수업">
        <InfoBox>
          <InfoRow label="모집기간">~ {formatDateDot(lecture.schedule.recruitPeriod)}</InfoRow>
          <InfoRow label="수업기간">
            {formatDateDot(lecture.schedule.coursePeriod.start)} ~ {formatDateDot(lecture.schedule.coursePeriod.end)}
          </InfoRow>
          <InfoRow label="수업시간">
            {lecture.schedule.days} · {lecture.schedule.time}
          </InfoRow>
          {!!lecture.maxCapacity && <InfoRow label="모집정원">{lecture.maxCapacity}명</InfoRow>}
          {!!lecture.schedule.totalDays && (
            <InfoRow label="총 수업">
              {lecture.schedule.totalDays}일 ({lecture.schedule.totalHours}시간)
            </InfoRow>
          )}
        </InfoBox>
      </Section>

      {/* 수강료 & 지원금 */}
      <Section title="수강료 & 지원금">
        <InfoBox>
          {/* 내배카 */}
          <InfoRow label="내배카">
            {lecture.recruitType === 'CARD_REQUIRED' ? (
              <span className="font-bold text-[#6D28D9]">필요함 💳</span>
            ) : (
              <span className="font-bold text-gray-700">필요없음</span>
            )}
          </InfoRow>

          {/* 자부담 */}
          <InfoRow label="자부담">
            {lecture.support.tuition === 0 ? (
              <span className="font-bold text-[#6D28D9]">전액 국비지원 0원</span>
            ) : (
              <span className="font-bold">{formatKRW(lecture.support.tuition)}원</span>
            )}
          </InfoRow>

          {/* 지원금 */}
          <InfoRow label="지원금">
            <div className="flex flex-col gap-1">
              {lecture.support.stipend ? (
                <span>{lecture.support.stipend}</span>
              ) : (
                <span className="text-gray-400">-</span>
              )}
              {lecture.support.extraSupport && <span>{lecture.support.extraSupport}</span>}
            </div>
          </InfoRow>
        </InfoBox>
      </Section>

      {/* 지원자격 */}
      <Section title="지원자격을 확인해주세요">
        <div className="space-y-2">
          {lecture.quals.length > 0 ? (
            lecture.quals.map((qual, idx) => (
              <RequirementItem key={idx} type={qual.type}>
                {qual.text}
              </RequirementItem>
            ))
          ) : (
            <div className="text-muted-foreground text-sm">등록된 지원 자격이 없습니다.</div>
          )}
        </div>
      </Section>

      {/* 지원 절차 */}
      <Section title="이런 절차로 지원할 수 있어요">
        <div className="scrollbar-hide overflow-x-auto pb-4">
          <div className="flex min-w-max items-center gap-4">
            {lecture.steps.length > 0 ? (
              lecture.steps.map((step, idx) => (
                <div key={idx} className="flex items-center">
                  <div className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white px-5 py-4 shadow-sm ring-1 ring-black/5 transition-all hover:shadow-md hover:ring-orange-100">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-orange-100 text-sm font-bold text-orange-600">
                      {idx + 1}
                    </div>
                    <span className="font-bold text-gray-900">{step}</span>
                  </div>
                  {idx < lecture.steps.length - 1 && (
                    <div className="mx-3 text-gray-300">
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="text-gray-300"
                      >
                        <path
                          d="M5 12H19M19 12L12 5M19 12L12 19"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-muted-foreground text-sm">등록된 지원 절차가 없습니다.</div>
            )}
          </div>
        </div>
      </Section>

      {/* 학습공간 사진 */}
      <Section title="학습 공간 사진">
        <div className="grid grid-cols-4 gap-3">
          {lecture.photos.slice(0, 4).map((src, idx) => (
            <div key={idx} className="border-border/50 relative aspect-4/3 overflow-hidden rounded-xl border bg-white">
              {src ? (
                <Image src={src} alt={`학습공간 ${idx + 1}`} fill className="object-cover" />
              ) : (
                <div className="text-muted-foreground flex h-full items-center justify-center text-xs">이미지</div>
              )}
            </div>
          ))}
        </div>
      </Section>

      {/* 채용연계 혜택 */}
      <Section title="채용연계 혜택을 드려요.">
        {lecture.benefits.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {lecture.benefits.map((benefit, idx) => (
              <Badge key={idx} variant="secondary" className="rounded-xl px-3 py-2 text-sm">
                {benefit}
              </Badge>
            ))}
          </div>
        ) : (
          <div className="text-muted-foreground text-sm">정보 없음</div>
        )}
      </Section>
    </div>
  )
}
