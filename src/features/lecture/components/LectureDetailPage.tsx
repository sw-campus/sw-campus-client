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

  const lecture = data

  // Gemini 요약 Query (캐싱 적용)
  const { data: aiSummary, isLoading: isAiLoading } = useQuery({
    queryKey: ['lectureSummary', lectureId, lecture?.title],
    queryFn: async () => {
      if (!lecture) return null
      // Server Action 호출
      const { generateGeminiSummary } = await import('@/features/lecture/actions/gemini')
      return generateGeminiSummary(lecture)
    },
    enabled: !!lecture,
    staleTime: Infinity, // 영구 캐싱 (fresh 상태 유지)
    gcTime: 60 * 60 * 1000, // 1시간 동안 메모리 유지
  })

  // 실제 표시할 요약: AI 요약 우선, 없으면 기본(매퍼) 요약
  const displaySummary = aiSummary ?? lecture?.summary ?? ''

  // 로딩 중
  if (isLoading) {
    return (
      <div className="custom-container">
        <div className="custom-card">
          <div className="flex items-center justify-center py-20">
            <div className="border-primary h-8 w-8 animate-spin rounded-full border-4 border-t-transparent" />
          </div>
        </div>
      </div>
    )
  }

  // 에러 또는 데이터 없음
  if (isError || !lecture) {
    return (
      <div className="custom-container">
        <div className="custom-card">
          <div className="text-muted-foreground py-20 text-center">
            <p className="text-lg">강의 정보를 찾을 수 없습니다.</p>
          </div>
        </div>
      </div>
    )
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
