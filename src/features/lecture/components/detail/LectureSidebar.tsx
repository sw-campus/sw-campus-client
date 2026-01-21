'use client'

import { toast } from 'sonner'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { AddToCartButton } from '@/features/cart'
import { type LectureDetail } from '@/features/lecture/api/lectureApi'
import { processApplicationSteps } from '@/features/lecture/utils/processApplicationSteps'
import { trackApplyButtonClick, trackShare } from '@/lib/analytics'

import { formatDateDot, SideInfoRow } from './DetailShared'

interface Props {
  lecture: LectureDetail
}

export default function LectureSidebar({ lecture }: Props) {
  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      toast.success('링크가 복사되었습니다!')
      trackShare({
        lectureId: lecture.id,
        lectureName: lecture.title,
        method: 'clipboard',
      })
    } catch {
      toast.error('링크 복사에 실패했습니다.')
    }
  }

  const handleApplyClick = () => {
    if (lecture.url) {
      trackApplyButtonClick({
        lectureId: lecture.id,
        lectureName: lecture.title,
        orgName: lecture.orgName,
        url: lecture.url,
      })
      window.open(lecture.url, '_blank')
    }
  }

  return (
    <>
      {/* 모바일: 하단 고정 바 */}
      <div className="fixed right-0 bottom-0 left-0 z-50 border-t border-gray-200 bg-white/95 px-4 py-3 backdrop-blur-xl sm:px-6 lg:hidden">
        <div className="mx-auto flex max-w-lg items-center gap-3">
          <Button
            size="lg"
            className="h-12 flex-1 rounded-xl bg-orange-400 text-base font-bold text-white shadow-lg shadow-orange-200 hover:bg-orange-500 disabled:bg-gray-200 disabled:text-gray-400 disabled:shadow-none"
            disabled={!lecture.url}
            onClick={handleApplyClick}
          >
            신청페이지 바로가기
          </Button>
        </div>
      </div>

      {/* 데스크톱: 사이드바 */}
      <div className="sticky top-20 hidden space-y-6 lg:block">
        <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-black/5">
          <p className="text-sm font-medium text-gray-500">{lecture.orgName}</p>
          <h2 className="mt-2 text-xl font-bold text-gray-900">{lecture.title}</h2>

          <div className="mt-6 flex flex-col gap-3">
            <Button
              size="lg"
              className="h-14 w-full rounded-xl bg-orange-400 text-lg font-bold text-white shadow-lg shadow-orange-200 hover:bg-orange-500 disabled:bg-gray-200 disabled:text-gray-400 disabled:shadow-none"
              disabled={!lecture.url}
              onClick={handleApplyClick}
            >
              신청페이지 바로가기
            </Button>
            <div className="grid grid-cols-2 gap-3">
              <AddToCartButton
                item={{ lectureId: String(lecture.id) }}
                variant="outline"
                size="lg"
                className="h-12 w-full rounded-xl border-gray-300 text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              >
                AI 심층 비교
              </AddToCartButton>
              <Button
                variant="outline"
                size="lg"
                className="h-12 w-full rounded-xl border-gray-300 text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                onClick={handleShare}
              >
                공유하기
              </Button>
            </div>
          </div>

          <Separator className="my-6" />

          <div className="space-y-4">
            <SideInfoRow label="모집상태">
              <span
                className={`rounded-full border px-3 py-1 text-xs font-medium ${
                  lecture.recruitStatus === 'RECRUITING'
                    ? 'border-emerald-200/50 bg-emerald-500/10 text-emerald-600'
                    : 'border-gray-200/50 bg-gray-500/10 text-gray-500'
                }`}
              >
                {lecture.recruitStatus === 'RECRUITING' ? '모집중' : '마감'}
              </span>
            </SideInfoRow>
            <SideInfoRow label="모집기간">~ {formatDateDot(lecture.schedule.recruitPeriod)}</SideInfoRow>
            <SideInfoRow label="수업기간">
              {formatDateDot(lecture.schedule.coursePeriod.start)} ~<br />
              {formatDateDot(lecture.schedule.coursePeriod.end)}
            </SideInfoRow>
            <SideInfoRow label="지역">{lecture.location}</SideInfoRow>
            <SideInfoRow label="수업시간">
              {lecture.schedule.days} <br /> {lecture.schedule.time}
            </SideInfoRow>
          </div>
        </div>

        {lecture.steps &&
          lecture.steps.length > 0 &&
          (() => {
            const { applicationSteps, hasPreTask } = processApplicationSteps(lecture.steps)

            return (
              <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-black/5">
                <p className="flex items-center gap-2 text-base font-bold text-gray-900">
                  <span className="text-orange-500">📋</span> 지원절차
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {applicationSteps.map((step, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="rounded-lg bg-orange-400 px-3 py-1.5 font-medium text-white"
                    >
                      {index + 1}. {step}
                    </Badge>
                  ))}
                </div>

                {/* 합격 후 사전과제 안내 */}
                {hasPreTask && (
                  <div className="mt-4 rounded-lg bg-blue-50 px-3 py-2.5">
                    <p className="flex items-center gap-2 text-sm font-medium text-blue-700">
                      <span>✅</span> 합격 후: 사전과제 진행
                    </p>
                  </div>
                )}
              </div>
            )
          })()}
      </div>
    </>
  )
}
