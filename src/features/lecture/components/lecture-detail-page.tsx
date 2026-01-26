'use client'

import { useQueries, useQuery } from '@tanstack/react-query'
import Image from 'next/image'

import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { getLectureDetail } from '@/features/lecture/api/lecture-api'
import { fetchOrganizationDetail } from '@/features/organization/api/organization-api'

import LectureCurriculum from './detail/lecture-curriculum'
import LectureIntro from './detail/lecture-intro'
import LectureOverview from './detail/lecture-overview'
import LectureReviews from './detail/lecture-reviews'
import LectureSidebar from './detail/lecture-sidebar'
import LectureTabNav from './detail/lecture-tab-nav'

interface Props {
  lectureId: string
  initialData?: Awaited<ReturnType<typeof getLectureDetail>>
}

export default function LectureDetailPage({ lectureId, initialData }: Props) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['lectureDetail', lectureId],
    queryFn: () => getLectureDetail(lectureId),
    staleTime: 1000 * 60,
    initialData,
  })

  const lecture = data

  // 종속 쿼리 병렬 실행 (organization, aiSummary)
  const [{ data: org, isLoading: isOrgLoading }, { data: aiSummary, isLoading: isAiLoading }] = useQueries({
    queries: [
      {
        queryKey: ['organization', data?.orgId],
        queryFn: async () => {
          if (!data?.orgId) return undefined
          return fetchOrganizationDetail(data.orgId)
        },
        enabled: !!data?.orgId,
      },
      {
        queryKey: ['lectureSummary', lectureId, data?.title],
        queryFn: async () => {
          if (!data) return null
          const { generateGeminiSummary } = await import('@/features/lecture/actions/gemini')
          return generateGeminiSummary(data)
        },
        enabled: !!data,
        staleTime: Infinity,
        gcTime: 60 * 60 * 1000,
      },
    ],
  })

  // 실제 표시할 요약: AI 요약 우선, 없으면 기본(매퍼) 요약
  const displaySummary = aiSummary ?? lecture?.summary ?? ''

  // 로딩 중
  if (isLoading) {
    return (
      <div className="custom-container">
        <div className="flex items-center justify-center py-20">
          <div className="border-primary h-8 w-8 animate-spin rounded-full border-4 border-t-transparent" />
        </div>
      </div>
    )
  }

  // 에러 또는 데이터 없음
  if (isError || !lecture) {
    return (
      <div className="custom-container">
        <div className="text-muted-foreground py-20 text-center">
          <p className="text-lg">강의 정보를 찾을 수 없습니다.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="custom-container">
      <div className="mx-auto w-full max-w-6xl px-4 py-6 md:px-6">
          {/* 상단 대표 이미지 영역 */}
          <div className="w-full overflow-hidden rounded-3xl bg-white/60 ring-1 ring-white/30 backdrop-blur-xl">
            <div className="relative aspect-16/6 w-full bg-white/30">
              {lecture.thumbnailUrl ? (
                <Image
                  src={lecture.thumbnailUrl}
                  alt="대표 이미지"
                  fill
                  sizes="(max-width: 1024px) 100vw, 1152px"
                  className="object-contain"
                  priority
                />
              ) : (
                <div className="text-muted-foreground flex h-full items-center justify-center text-sm">대표 이미지</div>
              )}
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-12">
            {/* LEFT */}
            <section className="md:col-span-8">
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

              {/* 탭 네비게이션 (Sticky) - 카드와 붙어서 보이도록 */}
              <LectureTabNav />

              {/* 본문 카드 (통합) - 탭과 붙어서 보이도록 상단 모서리 제거 */}
              <Card className="rounded-t-none rounded-b-2xl bg-white/70 ring-1 ring-white/30 backdrop-blur-xl">
                <CardContent className="space-y-16 p-6 md:p-8">
                  {/* 모집개요 */}
                  <div id="overview" className="scroll-mt-28">
                    <LectureOverview
                      lecture={lecture}
                      org={org}
                      displaySummary={displaySummary}
                      isLoading={isLoading}
                      isOrgLoading={isOrgLoading}
                      isAiLoading={isAiLoading}
                      isAiSummary={!!aiSummary}
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
                    <LectureCurriculum curriculum={lecture.curriculum} specialCurriculums={lecture.specialCurriculums} />
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
            <aside className="md:col-span-4">
              <LectureSidebar lecture={lecture} />
            </aside>
          </div>
        {/* 모바일 하단 고정바 공간 확보 */}
        <div className="h-20 md:hidden" />
      </div>
    </div>
  )
}
