'use client'

import { Activity, Award, BadgeCheck, ClipboardCheck, Pencil } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { APPROVAL_STATUS } from '@/features/admin/types/approval.type'
import { useCompletedLecturesQuery } from '@/features/mypage/hooks/use-completed-lectures-query'

import { useSurveyStatusQuery } from '../hooks/use-survey'

type ActivitySummaryProps = {
  onEditSurvey?: () => void
}

export function ActivitySummary({ onEditSurvey }: ActivitySummaryProps) {
  // React Query hooks - 캐싱으로 중복 호출 방지
  const { data: lectures, isLoading: lecturesLoading } = useCompletedLecturesQuery()

  // 설문 상태는 React Query로 관리 (모달에서 변경 시 자동 반영)
  const { data: surveyStatus, isLoading: surveyLoading } = useSurveyStatusQuery()
  const hasBasicSurvey = surveyStatus?.hasBasicSurvey ?? false
  const hasAptitudeTest = surveyStatus?.hasAptitudeTest ?? false

  // 승인된 후기 수 계산 (React Compiler가 자동 최적화)
  const approvedReviews = lectures?.filter(l => l.reviewStatus === APPROVAL_STATUS.APPROVED).length ?? 0

  const loading = lecturesLoading || surveyLoading

  return (
    <>
      {/* Mobile: 플랫 섹션 */}
      <section className="space-y-4 pb-6 border-b border-gray-200 sm:hidden">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Activity className="w-5 h-5 text-[#FEB706]" />
          <span className="text-base font-semibold text-[#020202]">활동 요약</span>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex h-20 items-center justify-center">
            <span className="text-sm text-[#888888]">불러오는 중...</span>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-2">
            {/* 수료 강의 */}
            <div className="flex flex-col items-center gap-1 text-center p-3 bg-[#FFFCF4] rounded-xl">
              <Award className="w-5 h-5 text-[#FEB706]" />
              <span className="text-xl font-bold text-[#020202]">{lectures?.length ?? 0}개</span>
              <span className="text-xs text-[#888888]">수료 강의</span>
            </div>

            {/* 승인된 후기 */}
            <div className="flex flex-col items-center gap-1 text-center p-3 bg-[#FFFCF4] rounded-xl">
              <BadgeCheck className="w-5 h-5 text-[#FEB706]" />
              <span className="text-xl font-bold text-[#020202]">{approvedReviews}개</span>
              <span className="text-xs text-[#888888]">승인 후기</span>
            </div>

            {/* 설문 */}
            <div className="flex flex-col items-center gap-1 text-center p-3 bg-[#FFFCF4] rounded-xl">
              <ClipboardCheck className="w-5 h-5 text-[#FEB706]" />
              <div className="flex items-center gap-1">
                <div className="flex gap-0.5">
                  <div className={`h-2.5 w-4 rounded ${hasBasicSurvey ? (hasAptitudeTest ? 'bg-emerald-500' : 'bg-amber-500') : 'bg-gray-300'}`} />
                  <div className={`h-2.5 w-4 rounded ${hasAptitudeTest ? 'bg-emerald-500' : 'bg-gray-300'}`} />
                </div>
              </div>
              <div className="flex items-center gap-0.5">
                <span className="text-xs text-[#888888]">
                  {hasAptitudeTest ? '완료' : hasBasicSurvey ? '1단계' : '미작성'}
                </span>
                {onEditSurvey && (
                  <Button variant="ghost" size="icon" className="h-4 w-4" onClick={onEditSurvey}>
                    <Pencil className="h-2.5 w-2.5 text-[#888888]" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Desktop: 강의 상세 페이지 스타일 */}
      <div className="hidden sm:block p-6">
        {/* Header */}
        <div className="flex items-center gap-3 pb-4 border-b border-gray-200 mb-6">
          <Activity className="w-6 h-6 text-[#FEB706]" />
          <span className="text-lg font-semibold text-[#020202]">활동 요약</span>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex h-20 items-center justify-center">
            <span className="text-base text-[#888888]">불러오는 중...</span>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-6">
            {/* 수료 강의 */}
            <div className="flex flex-col items-center gap-2 text-center p-6 bg-[#FFFCF4] rounded-xl border border-[#FEB706]/20">
              <Award className="w-8 h-8 text-[#FEB706]" />
              <span className="text-3xl font-bold text-[#020202]">{lectures?.length ?? 0}개</span>
              <span className="text-sm text-[#888888]">수료 강의</span>
            </div>

            {/* 승인된 후기 */}
            <div className="flex flex-col items-center gap-2 text-center p-6 bg-[#FFFCF4] rounded-xl border border-[#FEB706]/20">
              <BadgeCheck className="w-8 h-8 text-[#FEB706]" />
              <span className="text-3xl font-bold text-[#020202]">{approvedReviews}개</span>
              <span className="text-sm text-[#888888]">승인 후기</span>
            </div>

            {/* 설문 */}
            <div className="flex flex-col items-center gap-2 text-center p-6 bg-[#FFFCF4] rounded-xl border border-[#FEB706]/20">
              <ClipboardCheck className="w-8 h-8 text-[#FEB706]" />
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  <div className={`h-4 w-6 rounded ${hasBasicSurvey ? (hasAptitudeTest ? 'bg-emerald-500' : 'bg-amber-500') : 'bg-gray-300'}`} />
                  <div className={`h-4 w-6 rounded ${hasAptitudeTest ? 'bg-emerald-500' : 'bg-gray-300'}`} />
                </div>
                <span className={`text-lg font-bold ${hasAptitudeTest ? 'text-emerald-500' : hasBasicSurvey ? 'text-amber-500' : 'text-[#888888]'}`}>
                  {hasAptitudeTest ? '완료' : hasBasicSurvey ? '1단계' : '미작성'}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-sm text-[#888888]">설문</span>
                {onEditSurvey && (
                  <Button variant="ghost" size="icon" className="h-5 w-5" onClick={onEditSurvey}>
                    <Pencil className="h-3 w-3 text-[#888888]" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
