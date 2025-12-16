'use client'
import { useMemo, type ReactNode } from 'react'

import { useQuery } from '@tanstack/react-query'
import Image from 'next/image'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { getLectureDetail, type LectureDetail } from '@/features/lecture/api/lectureApi'

function formatDateDot(iso: string) {
  return iso.replaceAll('-', '.')
}
function formatKRW(n?: number) {
  if (typeof n !== 'number') return '-'
  return new Intl.NumberFormat('ko-KR').format(n)
}

interface Props {
  lectureId: string
}

export default function LectureDetailPage({ lectureId }: Props) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['lectureDetail', lectureId],
    queryFn: () => getLectureDetail(lectureId),
    staleTime: 1000 * 60,
  })

  // 더미 데이터 (로딩/에러/데이터 없음 시)
  const mock: LectureDetail = useMemo(
    () => ({
      id: lectureId,
      title: '지역사회 지역혁신프로젝트 기업연계형 SW 직무교육 1기',
      orgName: '한국소프트웨어인재개발원',
      tags: ['KDT', '인재추천', '입반선발'],
      thumbnailUrl: '',
      summary:
        'KDT(우수형) 백엔드 부트캠프입니다.\n취업을 위한 인재추천, 입반선발 전형이 있으며, 선발전형 통과테스트가 있습니다.',
      schedule: {
        recruitPeriod: { start: '2025-12-08', end: '2025-12-28' },
        coursePeriod: { start: '2025-12-30', end: '2026-07-28' },
        days: '월, 화, 수, 목, 금',
        time: '09:00 - 19:00',
        totalHours: 60,
      },
      support: {
        tuition: 2800000,
        stipend: '훈련장려금 월 11만 6천원',
        extraSupport: '특별훈련수당 월 20만원',
      },
      location: '서울시 금천구',
      recruitStatus: 'OPEN',
      photos: ['', '', ''],
    }),
    [lectureId],
  )

  const lecture = data ?? mock

  if (isLoading) {
    return <div className="text-muted-foreground py-20 text-center">로딩 중...</div>
  }
  if (isError) {
    return <div className="text-destructive py-20 text-center">데이터를 불러오지 못했습니다.</div>
  }

  return (
    <div className="custom-container">
      <div className="custom-card">
        <div className="mx-auto w-full max-w-6xl px-4 py-6 lg:px-6">
          {/* 상단 대표 이미지 영역 */}
          <div className="w-full overflow-hidden rounded-3xl bg-white/60 ring-1 ring-white/30 backdrop-blur-xl">
            <div className="relative aspect-16/6 w-full bg-white/30">
              {lecture.thumbnailUrl ? (
                <Image src={lecture.thumbnailUrl} alt="대표 이미지" fill className="object-cover" priority />
              ) : (
                <div className="text-muted-foreground flex h-full items-center justify-center text-sm">대표 이미지</div>
              )}
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12">
            {/* LEFT */}
            <section className="lg:col-span-8">
              {/* 타이틀 영역 */}
              <Card className="rounded-2xl bg-white/70 ring-1 ring-white/30 backdrop-blur-xl">
                <CardContent className="p-4">
                  <div className="flex flex-col gap-3">
                    <div className="flex flex-wrap items-center gap-2">
                      {lecture.tags.map(t => (
                        <Badge key={t} variant="secondary" className="rounded-full">
                          {t}
                        </Badge>
                      ))}
                    </div>

                    <div>
                      <p className="text-xs text-black/80">{lecture.orgName}</p>
                      <h1 className="mt-1 text-lg leading-snug font-semibold">{lecture.title}</h1>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 탭 + 본문 카드 */}
              <Card className="mt-4 rounded-2xl bg-white/70 ring-1 ring-white/30 backdrop-blur-xl">
                <CardContent className="p-0">
                  <Tabs defaultValue="overview">
                    {/* 탭 헤더 */}
                    <div className="border-border border-b px-4 py-3">
                      <TabsList className="grid w-full grid-cols-4 bg-transparent">
                        <TabsTrigger value="overview">모집개요</TabsTrigger>
                        <TabsTrigger value="intro">강의 소개</TabsTrigger>
                        <TabsTrigger value="curriculum">커리큘럼</TabsTrigger>
                        <TabsTrigger value="review">후기</TabsTrigger>
                      </TabsList>
                    </div>

                    {/* 모집개요 */}
                    <TabsContent value="overview" className="p-4">
                      <div className="space-y-6">
                        {/* 프로그램 요약 */}
                        <Section title="프로그램 요약">
                          <div className="space-y-3">
                            <div className="flex flex-wrap gap-2">
                              <Badge variant="outline" className="rounded-full">
                                오프라인에서 진행되는
                              </Badge>
                              <Badge variant="outline" className="rounded-full">
                                KDT(우수형)
                              </Badge>
                              <Badge variant="outline" className="rounded-full">
                                백엔드
                              </Badge>
                              <Badge variant="outline" className="rounded-full">
                                부트캠프
                              </Badge>
                            </div>

                            <p className="text-muted-foreground text-sm whitespace-pre-line">
                              {isLoading && !data ? 'Loading...' : lecture.summary}
                            </p>
                          </div>
                        </Section>

                        {/* 일정 & 수업 */}
                        <Section title="일정 & 수업">
                          <InfoBox>
                            <InfoRow label="모집기간">
                              {formatDateDot(lecture.schedule.recruitPeriod.start)} ~{' '}
                              {formatDateDot(lecture.schedule.recruitPeriod.end)}
                            </InfoRow>
                            <InfoRow label="수업기간">
                              {formatDateDot(lecture.schedule.coursePeriod.start)} ~{' '}
                              {formatDateDot(lecture.schedule.coursePeriod.end)}
                            </InfoRow>
                            <InfoRow label="수업시간">
                              {lecture.schedule.days} · {lecture.schedule.time}
                            </InfoRow>
                            <InfoRow label="모집정원">{lecture.schedule.totalHours}명</InfoRow>
                          </InfoBox>
                        </Section>

                        {/* 수강료 & 지원금 */}
                        <Section title="수강료 & 지원금">
                          <InfoBox>
                            <InfoRow label="자부담">{formatKRW(lecture.support.tuition)}원</InfoRow>
                            <InfoRow label="지원금">{lecture.support.stipend ?? '-'}</InfoRow>
                            <InfoRow label="추가지원">{lecture.support.extraSupport ?? '-'}</InfoRow>
                          </InfoBox>

                          <div className="border-border/50 text-muted-foreground mt-3 rounded-xl border bg-white p-4 text-xs">
                            * 본 과정은 KDT(Digital Training) 과정입니다. K-디지털 트레이닝 참여 이력에 따라 참여가
                            제한될 수 있습니다.
                          </div>
                        </Section>

                        {/* 지원자격 */}
                        <Section title="지원자격을 확인해주세요">
                          <div className="space-y-2">
                            <RequirementItem>내일배움카드 발급자 대상</RequirementItem>
                            <RequirementItem>정규 학습 시간이 학습 참여가 가능한 분</RequirementItem>
                          </div>
                        </Section>

                        {/* 지원 절차 */}
                        <Section title="이런 절차로 지원할 수 있어요">
                          <div className="flex flex-wrap gap-2">
                            {['신청서(서류) 작성', '인터뷰(비대면)', '코딩테스트', '인적성검사', '최종합격 발표'].map(
                              step => (
                                <Badge key={step} variant="secondary" className="rounded-full">
                                  {step}
                                </Badge>
                              ),
                            )}
                          </div>

                          <Separator className="my-4" />

                          <div className="text-muted-foreground space-y-2 text-xs">
                            <p>• 서류 합격 시, 비대면 인터뷰를 진행합니다.</p>
                            <p>• 인터뷰 응시에는 10~15분 정도 시간이 소요됩니다.</p>
                            <p>• 코딩테스트/인적성 절차는 모집 시점에 안내될 수 있습니다.</p>
                          </div>
                        </Section>

                        {/* 학습공간 사진 */}
                        <Section title="학습 공간 사진">
                          <div className="grid grid-cols-3 gap-3">
                            {lecture.photos.slice(0, 3).map((src, idx) => (
                              <div
                                key={idx}
                                className="border-border/50 relative aspect-4/3 overflow-hidden rounded-xl border bg-white"
                              >
                                {src ? (
                                  <Image src={src} alt={`학습공간 ${idx + 1}`} fill className="object-cover" />
                                ) : (
                                  <div className="text-muted-foreground flex h-full items-center justify-center text-xs">
                                    이미지
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </Section>

                        {/* 채용연계 혜택 */}
                        <Section title="채용연계 혜택을 드려요.">
                          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                            <BenefitCard title="파트너사, 협약 기업" />
                            <BenefitCard title="자사, 그룹사, 계열사" />
                          </div>
                        </Section>
                      </div>
                    </TabsContent>

                    {/* 기타 탭 */}
                    <TabsContent value="intro" className="p-4">
                      <Section title="강의 소개">소개 컨텐츠</Section>
                    </TabsContent>
                    <TabsContent value="curriculum" className="p-4">
                      <Section title="커리큘럼">커리큘럼 컨텐츠</Section>
                    </TabsContent>
                    <TabsContent value="review" className="p-4">
                      <Section title="후기">후기 컨텐츠</Section>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </section>

            {/* RIGHT (sticky 요약 카드) */}
            <aside className="lg:col-span-4">
              <div className="sticky top-6 space-y-4">
                <Card className="rounded-2xl bg-white/70 ring-1 ring-white/30 backdrop-blur-xl">
                  <CardContent className="p-4">
                    <p className="text-xs text-black/80">{lecture.orgName}</p>
                    <h2 className="mt-1 text-base leading-snug font-semibold">{lecture.title}</h2>

                    <div className="mt-3 grid grid-cols-1 gap-2">
                      <Button className="w-full rounded-full bg-black/30 text-white hover:bg-black/50">
                        신청페이지 바로가기
                      </Button>
                      <div className="grid grid-cols-2 gap-2">
                        <Button variant="secondary" className="w-full">
                          장바구니 담기
                        </Button>
                        <Button variant="outline" className="border-border/60 w-full">
                          공유하기
                        </Button>
                      </div>
                    </div>

                    <Separator className="bg-border/50 my-4" />

                    <div className="space-y-2 text-sm">
                      <SideInfoRow label="모집상태">
                        <Badge
                          className="rounded-full"
                          variant={lecture.recruitStatus === 'OPEN' ? 'default' : 'secondary'}
                        >
                          {lecture.recruitStatus === 'OPEN' ? '모집중' : '마감'}
                        </Badge>
                      </SideInfoRow>
                      <SideInfoRow label="모집기간">
                        {formatDateDot(lecture.schedule.recruitPeriod.start)} ~{' '}
                        {formatDateDot(lecture.schedule.recruitPeriod.end)}
                      </SideInfoRow>
                      <SideInfoRow label="수업기간">
                        {formatDateDot(lecture.schedule.coursePeriod.start)} ~{' '}
                        {formatDateDot(lecture.schedule.coursePeriod.end)}
                      </SideInfoRow>
                      <SideInfoRow label="지역">{lecture.location}</SideInfoRow>
                      <SideInfoRow label="수업시간">
                        {lecture.schedule.days} · {lecture.schedule.time}
                      </SideInfoRow>
                    </div>
                  </CardContent>
                </Card>

                <Card className="rounded-2xl bg-white/70 ring-1 ring-white/30 backdrop-blur-xl">
                  <CardContent className="p-4">
                    <p className="text-sm font-semibold">채용연계 혜택</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <Badge variant="secondary" className="rounded-full">
                        인재 추천
                      </Badge>
                      <Badge variant="secondary" className="rounded-full">
                        인터십 진행
                      </Badge>
                      <Badge variant="secondary" className="rounded-full">
                        협약 기업
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  )
}

/* -------------------- UI helpers -------------------- */

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-black">{title}</h3>
      <div className="rounded-xl bg-white/60 p-4 backdrop-blur">{children}</div>
    </div>
  )
}

function InfoBox({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-xl bg-white/60 p-4 backdrop-blur">
      <div className="space-y-2">{children}</div>
    </div>
  )
}

function InfoRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <span className="text-muted-foreground shrink-0 text-xs">{label}</span>
      <span className="text-right text-sm">{children}</span>
    </div>
  )
}

function SideInfoRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <span className="text-muted-foreground shrink-0 text-xs">{label}</span>
      <span className="text-right text-sm">{children}</span>
    </div>
  )
}

function RequirementItem({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center justify-between rounded-xl bg-white/60 px-4 py-3 backdrop-blur">
      <span className="text-sm">{children}</span>
      <Badge variant="secondary" className="rounded-full">
        필수
      </Badge>
    </div>
  )
}

function BenefitCard({ title }: { title: string }) {
  return (
    <div className="rounded-xl bg-white/60 p-4 backdrop-blur">
      <p className="text-sm font-semibold">{title}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        <Badge variant="secondary" className="rounded-full">
          인재 추천
        </Badge>
        <Badge variant="secondary" className="rounded-full">
          인터십 진행
        </Badge>
      </div>
    </div>
  )
}
