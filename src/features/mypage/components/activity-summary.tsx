'use client'

import { LuActivity, LuAward, LuBadgeCheck, LuClipboardCheck, LuPencil } from 'react-icons/lu'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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

  // 공통 헤더 렌더링
  const renderHeader = () => (
    <div className="flex items-center gap-2">
      <div className="bg-primary/10 text-primary flex h-8 w-8 items-center justify-center rounded-full">
        <LuActivity className="h-4 w-4" />
      </div>
      <span className="text-foreground text-lg font-semibold">활동 요약</span>
    </div>
  )

  // 공통 컨텐츠 렌더링
  const renderContent = () => (
    <>
      {loading ? (
        <div className="flex h-20 items-center justify-center">
          <span className="text-muted-foreground text-sm">불러오는 중...</span>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-2 sm:gap-4">
          {/* 수료 강의 */}
          <div className="flex flex-col items-center gap-0.5 text-center sm:gap-1">
            <div className="text-muted-foreground">
              <LuAward className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
            <span className="text-foreground text-lg font-bold sm:text-xl">{lectures?.length ?? 0}개</span>
            <span className="text-muted-foreground text-[10px] sm:text-xs">수료 강의</span>
          </div>

          {/* 승인된 후기 */}
          <div className="flex flex-col items-center gap-0.5 text-center sm:gap-1">
            <div className="text-muted-foreground">
              <LuBadgeCheck className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
            <span className="text-foreground text-lg font-bold sm:text-xl">{approvedReviews}개</span>
            <span className="text-muted-foreground text-[10px] sm:text-xs">승인 후기</span>
          </div>

          {/* 설문 - 프로그레스 바 + 수정 버튼 */}
          <div className="flex flex-col items-center gap-0.5 text-center sm:gap-1">
            <div className="text-muted-foreground">
              <LuClipboardCheck className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
            {/* 프로그레스 바 + 상태 텍스트 (한 줄) */}
            <div className="flex items-center gap-1 sm:gap-2">
              <div className="flex gap-0.5 sm:gap-1">
                <div
                  className={`h-2.5 w-4 rounded sm:h-3 sm:w-5 ${
                    hasBasicSurvey
                      ? hasAptitudeTest
                        ? 'bg-success'
                        : 'bg-warning'
                      : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                />
                <div
                  className={`h-2.5 w-4 rounded sm:h-3 sm:w-5 ${hasAptitudeTest ? 'bg-success' : 'bg-gray-300 dark:bg-gray-600'}`}
                />
              </div>
              <span
                className={`text-lg font-bold sm:text-xl ${
                  hasAptitudeTest
                    ? 'text-success'
                    : hasBasicSurvey
                      ? 'text-warning'
                      : 'text-muted-foreground'
                }`}
              >
                {hasAptitudeTest ? '2단계' : hasBasicSurvey ? '1단계' : '미작성'}
              </span>
            </div>
            <div className="flex items-center gap-0.5 sm:gap-1">
              <span className="text-muted-foreground text-[10px] sm:text-xs">설문</span>
              {onEditSurvey && (
                <Button variant="ghost" size="icon" className="h-4 w-4 sm:h-5 sm:w-5" onClick={onEditSurvey}>
                  <LuPencil className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )

  return (
    <>
      {/* Mobile: 플랫 섹션 */}
      <section className="border-border space-y-4 overflow-hidden border-b pb-6 sm:hidden">
        {renderHeader()}
        {renderContent()}
      </section>

      {/* Desktop: Card */}
      <Card className="bg-card hidden sm:block">
        <CardHeader className="pb-0">
          <div className="flex items-center gap-2">
            <div className="bg-primary/10 text-primary flex h-8 w-8 items-center justify-center rounded-full">
              <LuActivity className="h-4 w-4" />
            </div>
            <CardTitle className="text-foreground text-lg">활동 요약</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="border-border border-t py-4">
          {renderContent()}
        </CardContent>
      </Card>
    </>
  )
}
