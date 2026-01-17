'use client'

import { useEffect, useMemo, useState } from 'react'

import { LuAward, LuBadgeCheck, LuClipboardCheck, LuPencil } from 'react-icons/lu'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  useCompletedLecturesQuery,
  useReviewStatusesQuery,
} from '@/features/mypage/hooks/useCompletedLecturesQuery'
import { api } from '@/lib/axios'

type SurveyResponse = {
  surveyId: number | null
  exists?: boolean | null
}

type ActivitySummaryProps = {
  onEditSurvey?: () => void
}

export function ActivitySummary({ onEditSurvey }: ActivitySummaryProps) {
  const [surveyCompleted, setSurveyCompleted] = useState(false)
  const [surveyLoading, setSurveyLoading] = useState(true)

  // React Query hooks - 캐싱으로 중복 호출 방지
  const { data: lectures, isLoading: lecturesLoading } = useCompletedLecturesQuery()
  const { data: reviewStatuses, isLoading: reviewStatusesLoading } = useReviewStatusesQuery(lectures)

  // 승인된 후기 수 계산
  const approvedReviews = useMemo(() => {
    if (!reviewStatuses) return 0
    let count = 0
    reviewStatuses.forEach(status => {
      if (status === 'APPROVED') count++
    })
    return count
  }, [reviewStatuses])

  // 설문 완료 여부 조회 (별도 API)
  useEffect(() => {
    let mounted = true

    const loadSurvey = async () => {
      try {
        setSurveyLoading(true)
        const surveyRes = await api.get<SurveyResponse>('/mypage/survey')
        const surveyId = surveyRes.data?.surveyId
        const surveyDone = surveyRes.data?.exists === true || (surveyId !== null && surveyId !== undefined)
        if (mounted) setSurveyCompleted(surveyDone)
      } catch {
        // ignore
      } finally {
        if (mounted) setSurveyLoading(false)
      }
    }

    loadSurvey()
    return () => {
      mounted = false
    }
  }, [])

  const loading = lecturesLoading || reviewStatusesLoading || surveyLoading

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

            {/* 설문 - 수정 버튼 포함 */}
            <div className="flex flex-col items-center gap-1 text-center">
              <div className="text-muted-foreground">
                <LuClipboardCheck className="h-5 w-5" />
              </div>
              <span
                className={`text-xl font-bold ${surveyCompleted ? 'text-green-600' : 'text-muted-foreground'}`}
              >
                {surveyCompleted ? '완료' : '미작성'}
              </span>
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
