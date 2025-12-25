'use client'

import { useQuery } from '@tanstack/react-query'
import Image from 'next/image'

import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { getLectureDetail, type LectureDetail } from '@/features/lecture/api/lectureApi'
import { fetchOrganizationDetail } from '@/features/organization/api/organizationApi'

import LectureCurriculum from './detail/LectureCurriculum'
import LectureIntro from './detail/LectureIntro'
import LectureOverview from './detail/LectureOverview'
import LectureReviews from './detail/LectureReviews'
import LectureSidebar from './detail/LectureSidebar'
import LectureTabNav from './detail/LectureTabNav'

interface Props {
  lectureId: string
}

export default function LectureDetailPage({ lectureId }: Props) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['lectureDetail', lectureId],
    queryFn: () => getLectureDetail(lectureId),
    staleTime: 1000 * 60,
  })

  const { data: org } = useQuery({
    queryKey: ['organization', data?.orgId],
    queryFn: () => fetchOrganizationDetail(data!.orgId),
    enabled: !!data?.orgId,
  })

  // 더미 데이터 (로딩/에러/데이터 없음 시)
  const mock: LectureDetail = {
    id: lectureId,
    orgId: 1,
    title: '지역사회 지역혁신프로젝트 기업연계형 SW 직무교육 1기',
    orgName: '한국소프트웨어인재개발원',
    tags: ['KDT', '인재추천', '입반선발'],
    lectureLoc: 'OFFLINE',
    categoryName: '백엔드',
    thumbnailUrl: '',
    recruitType: 'CARD_REQUIRED',
    summary:
      'KDT(우수형) 백엔드 부트캠프입니다.\n취업을 위한 인재추천, 입반선발 전형이 있으며, 선발전형 통과테스트가 있습니다.',
    schedule: {
      recruitPeriod: '2025-12-28',
      coursePeriod: { start: '2025-12-30', end: '2026-07-28' },
      days: '월, 화, 수, 목, 금',
      time: '09:00 - 19:00',
      totalHours: 60,
      totalDays: 20,
    },
    support: {
      tuition: 2800000,
      stipend: '훈련장려금 월 11만 6천원',
      extraSupport: '특별훈련수당 월 20만원',
    },
    location: '서울시 금천구',
    recruitStatus: 'RECRUITING',
    photos: ['', '', '', ''],
    steps: ['서류심사', '면접', '최종합격'],
    benefits: ['인재추천', '인턴십 진행'],
    goal: '',
    maxCapacity: 0,
    equipment: { pc: '', merit: '' },
    services: { books: false, resume: false, mockInterview: false, employmentHelp: false, afterCompletion: false },
    project: { num: 0, time: 0, team: '', tool: '', mentor: false },
    curriculum: [],
    teachers: [],
    quals: [],
  }

  const lecture = data ?? mock

  // Gemini 요약 Query
  const { data: aiSummary, isLoading: isAiLoading } = useQuery({
    queryKey: ['lectureSummary', lectureId, lecture?.title],
    queryFn: async () => {
      if (!lecture) return null
      // Server Action 호출
      const { generateGeminiSummary } = await import('@/features/lecture/actions/gemini')
      return generateGeminiSummary(lecture)
    },
    enabled: !!lecture,
    staleTime: Infinity,
  })

  // 실제 표시할 요약: AI 요약 우선, 없으면 기본(매퍼) 요약
  const displaySummary = aiSummary ?? lecture.summary

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
                <Image
                  src={lecture.thumbnailUrl}
                  alt="대표 이미지"
                  fill
                  sizes="(max-width: 1024px) 100vw, 1152px"
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="text-muted-foreground flex h-full items-center justify-center text-sm">대표 이미지</div>
              )}
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12">
            {/* LEFT */}
            <section className="lg:col-span-8">
              {/* 타이틀 영역 */}
              <Card className="mb-4 rounded-2xl bg-white/70 ring-1 ring-white/30 backdrop-blur-xl">
                <CardContent className="p-4">
                  <div className="flex flex-col gap-3">
                    <div>
                      <h1 className="mt-1 text-lg leading-snug font-semibold">{lecture.title}</h1>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 본문 카드 (통합) */}
              <Card className="rounded-2xl bg-white/70 ring-1 ring-white/30 backdrop-blur-xl">
                <CardContent className="space-y-16 p-6 md:p-8">
                  <LectureTabNav />
                  {/* 모집개요 */}
                  <div id="overview" className="scroll-mt-28">
                    <LectureOverview
                      lecture={lecture}
                      org={org}
                      displaySummary={displaySummary}
                      isLoading={isLoading}
                      isAiLoading={isAiLoading}
                    />
                  </div>

                  <Separator />

                  {/* 강의 소개 */}
                  <div id="intro" className="scroll-mt-28">
                    <LectureIntro lecture={lecture} />
                  </div>

                  <Separator />

                  {/* 커리큘럼 */}
                  <div id="curriculum" className="scroll-mt-28">
                    <LectureCurriculum curriculum={lecture.curriculum} />
                  </div>

                  <Separator />

                  {/* 후기 */}
                  <div id="review" className="min-h-75 scroll-mt-28">
                    <LectureReviews lectureId={lectureId} />
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* RIGHT (sticky) */}
            <aside className="lg:col-span-4">
              <LectureSidebar lecture={lecture} />
            </aside>
          </div>
        </div>
      </div>
    </div>
  )
}
