import Image from 'next/image'
import Link from 'next/link'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { type LectureDetail } from '@/features/lecture/api/lecture-api'
import { processApplicationSteps } from '@/features/lecture/utils/process-application-steps'
import { type OrganizationDetail } from '@/features/organization/types/organization.type'

import { Section, InfoBox, InfoRow, RequirementItem, InlineBadge, formatDateDot, formatKRW } from './detail-shared'
import PhotoSlider from './photo-slider'

interface Props {
  lecture: LectureDetail
  org?: OrganizationDetail
  displaySummary: string
  isLoading: boolean
  isOrgLoading: boolean
  isAiLoading: boolean
  isAiSummary: boolean
}

export default function LectureOverview({
  lecture,
  org,
  displaySummary,
  isLoading,
  isOrgLoading,
  isAiLoading,
  isAiSummary,
}: Props) {
  return (
    <div className="space-y-12">
      {/* 프로그램 요약 */}
      <Section
        title={
          <span className="flex items-center gap-2">
            프로그램 요약
            {isAiSummary && (
              <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 px-2.5 py-0.5 text-xs font-medium text-white shadow-sm">
                <span>✨</span>
                AI 요약
              </span>
            )}
          </span>
        }
      >
        {isLoading ? (
          <div className="text-muted-foreground py-4 text-center">기본 정보 로딩 중...</div>
        ) : isAiLoading ? (
          <div className="flex animate-pulse items-center gap-2 py-4 text-orange-600">
            <span className="text-xl">✨</span>
            <span>AI가 강의를 분석하여 요약하고 있습니다...</span>
          </div>
        ) : (
          <div className="text-lg leading-loose font-medium text-gray-800">
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
                      <span key={j} className="text-muted-foreground">
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
      {(org || isOrgLoading) && (
        <Section title="교육기관 정보">
          {isOrgLoading ? (
            <div className="flex animate-pulse flex-col gap-4 rounded-xl border border-gray-100 bg-white p-4 shadow-sm md:flex-row md:items-center md:gap-5 md:p-6">
              <div className="h-14 w-14 shrink-0 rounded-full bg-gray-200 md:h-16 md:w-16" />
              <div className="flex-1 space-y-2">
                <div className="h-5 w-32 rounded bg-gray-200" />
                <div className="h-4 w-48 rounded bg-gray-200" />
              </div>
            </div>
          ) : org ? (
            <div className="flex flex-col gap-4 rounded-xl border border-gray-100 bg-white p-4 shadow-sm md:flex-row md:items-center md:gap-5 md:p-6">
              <div className="flex items-center gap-4 md:contents">
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full border border-gray-100 bg-white md:h-16 md:w-16">
                  {org.logoUrl ? (
                    <Image src={org.logoUrl} alt={org.name} fill sizes="64px" className="object-contain p-1" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gray-50 text-xs text-gray-400">
                      Logo
                    </div>
                  )}
                </div>
                <div className="flex-1 md:flex-1">
                  <h4 className="text-base font-bold text-gray-900 md:text-lg">{org.name}</h4>
                  <p className="mt-0.5 line-clamp-2 text-xs leading-relaxed text-gray-600 md:mt-1 md:text-sm">
                    {org.description || '기관 소개가 없습니다.'}
                  </p>
                </div>
              </div>
              <Button
                asChild
                variant="outline"
                className="w-full shrink-0 rounded-lg border-gray-200 text-gray-700 hover:bg-gray-50 md:w-auto"
              >
                <Link href={`/organizations/${org.id}`}>자세히 보기</Link>
              </Button>
            </div>
          ) : null}
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
          <InfoRow label="내배카 여부">
            {lecture.recruitType === 'CARD_REQUIRED' ? (
              <span className="text-primary font-bold">필요함 💳</span>
            ) : (
              <span className="font-bold text-gray-700">필요없음</span>
            )}
          </InfoRow>

          {/* 자기부담금 */}
          <InfoRow label="자기부담금">
            {lecture.support.tuition === 0 ? (
              <span className="text-primary font-bold">전액 국비지원 0원</span>
            ) : (
              <span className="font-bold">{formatKRW(lecture.support.tuition)}원</span>
            )}
          </InfoRow>

          {/* 정부 지원금 */}
          {lecture.support.stipend && (
            <InfoRow label="정부 지원금">
              <span>{lecture.support.stipend}</span>
            </InfoRow>
          )}

          {/* 훈련수당 */}
          {lecture.support.extraSupport && (
            <InfoRow label="훈련수당 (월)">
              <span>{lecture.support.extraSupport}</span>
            </InfoRow>
          )}
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
        {(() => {
          const { applicationSteps, hasPreTask } = processApplicationSteps(lecture.steps)

          return (
            <>
              {/* 모바일: 수직 레이아웃 */}
              <div className="flex flex-col gap-3 md:hidden">
                {applicationSteps.length > 0 ? (
                  applicationSteps.map((step, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white px-4 py-3 shadow-sm ring-1 ring-black/5"
                    >
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-orange-100 text-sm font-bold text-orange-500">
                        {idx + 1}
                      </div>
                      <span className="text-sm font-bold text-gray-900">{step}</span>
                    </div>
                  ))
                ) : (
                  <div className="text-muted-foreground text-sm">등록된 지원 절차가 없습니다.</div>
                )}
              </div>

              {/* 태블릿/데스크톱: 가로 스크롤 레이아웃 */}
              <div className="scrollbar-hide hidden overflow-x-auto pb-4 md:block">
                <div className="flex min-w-max items-center gap-4">
                  {applicationSteps.length > 0 ? (
                    applicationSteps.map((step, idx) => (
                      <div key={idx} className="flex items-center">
                        <div className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white px-5 py-4 shadow-sm ring-1 ring-black/5 transition-all hover:shadow-md hover:ring-orange-100">
                          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-orange-100 text-sm font-bold text-orange-500">
                            {idx + 1}
                          </div>
                          <span className="font-bold text-gray-900">{step}</span>
                        </div>
                        {idx < applicationSteps.length - 1 && (
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

              {/* 합격 후 사전과제 안내 */}
              {hasPreTask && (
                <div className="mt-3 flex items-center gap-3 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 md:mt-4 md:px-5 md:py-4">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-600">
                    ✓
                  </div>
                  <span className="text-sm font-bold text-blue-700 md:text-base">합격 후: 사전과제 진행</span>
                </div>
              )}
            </>
          )
        })()}
      </Section>

      {/* 학습공간 사진 - 슬라이드 */}
      <Section title="학습 공간 사진">
        {lecture.photos.filter(src => src).length > 0 ? (
          <PhotoSlider photos={lecture.photos.filter(src => src)} />
        ) : (
          <div className="text-muted-foreground py-8 text-center text-sm">등록된 학습 공간 사진이 없습니다.</div>
        )}
      </Section>

      {/* 추가 제공 항목 */}
      <Section title="추가 제공 항목">
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
