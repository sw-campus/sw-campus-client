'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { AddToCartButton } from '@/features/cart'
import { type LectureDetail } from '@/features/lecture/api/lectureApi'

import { formatDateDot, SideInfoRow } from './DetailShared'

interface Props {
  lecture: LectureDetail
}

export default function LectureSidebar({ lecture }: Props) {
  return (
    <div className="sticky top-20 space-y-6">
      <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-black/5">
        <p className="text-sm font-medium text-gray-500">{lecture.orgName}</p>
        <h2 className="mt-2 text-xl font-bold text-gray-900">{lecture.title}</h2>

        <div className="mt-6 flex flex-col gap-3">
          <Button
            size="lg"
            className="h-14 w-full rounded-xl bg-orange-400 text-lg font-bold text-white shadow-lg shadow-orange-200 hover:bg-orange-500 disabled:bg-gray-200 disabled:text-gray-400 disabled:shadow-none"
            disabled={!lecture.url}
            onClick={() => lecture.url && window.open(lecture.url, '_blank')}
          >
            신청페이지 바로가기
          </Button>
          <div className="grid grid-cols-2 gap-3">
            <AddToCartButton
              item={{ lectureId: String(lecture.id) }}
              variant="outline"
              size="lg"
              className="h-12 w-full rounded-xl border-gray-200 hover:bg-gray-50"
            >
              장바구니
            </AddToCartButton>
            <Button variant="outline" size="lg" className="h-12 w-full rounded-xl border-gray-200 hover:bg-gray-50">
              공유하기
            </Button>
          </div>
        </div>

        <Separator className="my-6" />

        <div className="space-y-4">
          <SideInfoRow label="모집상태">
            <Badge
              className="rounded-full px-3"
              variant={lecture.recruitStatus === 'RECRUITING' ? 'default' : 'secondary'}
            >
              {lecture.recruitStatus === 'RECRUITING' ? '모집중' : '마감'}
            </Badge>
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

      {lecture.steps && lecture.steps.length > 0 && (
        <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-black/5">
          <p className="flex items-center gap-2 text-base font-bold text-gray-900">
            <span className="text-orange-500">📋</span> 지원절차
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {lecture.steps.map((step, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="rounded-lg bg-orange-50 px-3 py-1.5 font-medium text-orange-700"
              >
                {index + 1}. {step}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
