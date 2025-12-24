'use client'

import { useEffect, useState } from 'react'

import { LuAward, LuBadgeCheck, LuClipboardCheck, LuPencil } from 'react-icons/lu'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { api } from '@/lib/axios'

type CompletedLecture = {
  certificateId: number
  lectureId: number
  lectureName: string
  canWriteReview: boolean
  reviewId?: number
}

type SurveyResponse = {
  surveyId: number | null
  exists?: boolean | null
}

type ReviewResponse = {
  approvalStatus?: string
}

type ActivitySummaryProps = {
  onEditSurvey?: () => void
}

export function ActivitySummary({ onEditSurvey }: ActivitySummaryProps) {
  const [stats, setStats] = useState({
    completedLectures: 0,
    approvedReviews: 0,
    surveyCompleted: false,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    const loadStats = async () => {
      try {
        setLoading(true)

        // 수료 강의 목록
        const lecturesRes = await api.get<CompletedLecture[]>('/mypage/completed-lectures')
        const lectures = Array.isArray(lecturesRes.data) ? lecturesRes.data : []
        const completedCount = lectures.length

        // 승인된 후기 수 계산
        let approvedCount = 0
        const reviewLectures = lectures.filter(l => !l.canWriteReview)
        if (reviewLectures.length > 0) {
          const results = await Promise.all(
            reviewLectures.map(async l => {
              try {
                const { data } = await api.get<ReviewResponse>(`/mypage/completed-lectures/${l.lectureId}/review`)
                return String(data?.approvalStatus ?? '').toUpperCase() === 'APPROVED'
              } catch {
                return false
              }
            }),
          )
          approvedCount = results.filter(Boolean).length
        }

        // 설문 완료 여부
        let surveyDone = false
        try {
          const surveyRes = await api.get<SurveyResponse>('/mypage/survey')
          const surveyId = surveyRes.data?.surveyId
          surveyDone = surveyRes.data?.exists === true || (surveyId !== null && surveyId !== undefined)
        } catch {
          // ignore
        }

        if (mounted) {
          setStats({
            completedLectures: completedCount,
            approvedReviews: approvedCount,
            surveyCompleted: surveyDone,
          })
        }
      } catch {
        // ignore
      } finally {
        if (mounted) setLoading(false)
      }
    }

    loadStats()
    return () => {
      mounted = false
    }
  }, [])

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
              <span className="text-foreground text-xl font-bold">{stats.completedLectures}개</span>
              <span className="text-muted-foreground text-xs">수료 강의</span>
            </div>

            {/* 승인된 후기 */}
            <div className="flex flex-col items-center gap-1 text-center">
              <div className="text-muted-foreground">
                <LuBadgeCheck className="h-5 w-5" />
              </div>
              <span className="text-foreground text-xl font-bold">{stats.approvedReviews}개</span>
              <span className="text-muted-foreground text-xs">승인된 후기</span>
            </div>

            {/* 설문 - 수정 버튼 포함 */}
            <div className="flex flex-col items-center gap-1 text-center">
              <div className="text-muted-foreground">
                <LuClipboardCheck className="h-5 w-5" />
              </div>
              <span
                className={`text-xl font-bold ${stats.surveyCompleted ? 'text-green-600' : 'text-muted-foreground'}`}
              >
                {stats.surveyCompleted ? '완료' : '미작성'}
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
