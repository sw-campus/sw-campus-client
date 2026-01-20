'use client'

import { useMemo } from 'react'

import { LuAward, LuBadgeCheck, LuClipboardCheck, LuPencil } from 'react-icons/lu'

import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { APPROVAL_STATUS } from '@/features/admin/types/approval.type'
import { useCompletedLecturesQuery } from '@/features/mypage/hooks/useCompletedLecturesQuery'

import { useSurveyStatusQuery } from '../hooks/useSurvey'

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

  // 승인된 후기 수 계산 (응답의 reviewStatus 직접 사용)
  const approvedReviews = useMemo(() => {
    if (!lectures) return 0
    return lectures.filter(l => l.reviewStatus === APPROVAL_STATUS.APPROVED).length
  }, [lectures])

  const loading = lecturesLoading || surveyLoading

  return (
    <Card className="bg-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-foreground text-lg">활동 요약</CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        {loading ? (
          <div className="flex h-20 items-center justify-center">
            <span className="text-muted-foreground text-sm">불러오는 중...</span>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-4">
            {/* 수료 강의 */}
            <div className="flex flex-col items-center gap-1 text-center">
              <div className="text-muted-foreground">
                <LuAward className="h-5 w-5" />
              </div>
              <span className="text-foreground text-xl font-bold">{lectures?.length ?? 0}개</span>
              <span className="text-muted-foreground text-xs">수료 강의</span>
            </div>

            {/* 승인된 후기 */}
            <div className="flex flex-col items-center gap-1 text-center">
              <div className="text-muted-foreground">
                <LuBadgeCheck className="h-5 w-5" />
              </div>
              <span className="text-foreground text-xl font-bold">{approvedReviews}개</span>
              <span className="text-muted-foreground text-xs">승인된 후기</span>
            </div>

            {/* 설문 - 프로그레스 바 + 수정 버튼 */}
            <div className="flex flex-col items-center gap-1 text-center">
              <div className="text-muted-foreground">
                <LuClipboardCheck className="h-5 w-5" />
              </div>
              {/* 프로그레스 바 + 상태 텍스트 (한 줄) */}
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  <div
                    className={`h-3 w-5 rounded ${
                      hasBasicSurvey
                        ? hasAptitudeTest
                          ? 'bg-green-500'
                          : 'bg-amber-500'
                        : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                  />
                  <div
                    className={`h-3 w-5 rounded ${hasAptitudeTest ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`}
                  />
                </div>
                <span
                  className={`text-lg font-bold ${
                    hasAptitudeTest
                      ? 'text-green-600'
                      : hasBasicSurvey
                        ? 'text-amber-600'
                        : 'text-muted-foreground'
                  }`}
                >
                  {hasAptitudeTest ? '2단계' : hasBasicSurvey ? '1단계' : '미작성'}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-muted-foreground text-xs">설문</span>
                {onEditSurvey && (
                  <Button variant="ghost" size="icon" className="h-5 w-5" onClick={onEditSurvey}>
                    <LuPencil className="h-3 w-3" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
