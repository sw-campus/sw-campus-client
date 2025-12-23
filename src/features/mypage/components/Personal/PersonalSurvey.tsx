'use client'

import { useEffect, useState } from 'react'

import { FileCheck, FileText, UserCog } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { api } from '@/lib/axios'

type MySurveyResponse = {
  surveyId: number | null
  exists?: boolean | null
  [key: string]: unknown
}

type PersonalSurveyProps = {
  onOpenProductModal: () => void
}

export default function PersonalSurvey({ onOpenProductModal }: PersonalSurveyProps) {
  const [surveyExists, setSurveyExists] = useState<boolean | null>(null)
  const [surveyLoading, setSurveyLoading] = useState(false)
  const [surveyError, setSurveyError] = useState<string | null>(null)

  useEffect(() => {
    const handleSurveySaved = () => {
      setSurveyExists(true)
      setSurveyError(null)
      setSurveyLoading(false)
    }
    window.addEventListener('survey:saved', handleSurveySaved)
    return () => {
      window.removeEventListener('survey:saved', handleSurveySaved)
    }
  }, [])

  useEffect(() => {
    let cancelled = false
    const fetchMySurvey = async () => {
      try {
        setSurveyLoading(true)
        setSurveyError(null)
        const { data } = await api.get<MySurveyResponse>('/mypage/survey')
        const id = (data as MySurveyResponse)?.surveyId
        const exists = Boolean((data as MySurveyResponse)?.exists) || (id !== null && id !== undefined)
        if (!cancelled) setSurveyExists(exists)
      } catch {
        if (!cancelled) setSurveyError('설문 정보를 불러오지 못했습니다.')
      } finally {
        if (!cancelled) setSurveyLoading(false)
      }
    }
    fetchMySurvey()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <Card className="bg-card h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-foreground text-xl font-bold">설문 조사</CardTitle>
        <Button size="sm" onClick={onOpenProductModal} variant="outline">
          {surveyExists ? '설문 수정' : '설문 작성'}
        </Button>
      </CardHeader>
      <CardContent className="pt-6">
        {surveyLoading && <p className="text-sm text-gray-500">불러오는 중...</p>}
        {surveyError && !surveyLoading && <p className="text-sm text-red-600">{surveyError}</p>}
        {!surveyLoading && !surveyError && (
          <div className="text-muted-foreground flex flex-col items-center justify-center gap-4 py-8 text-center">
            {surveyExists ? (
              <>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                  <FileCheck className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">참여 완료</p>
                  <p className="mt-1 text-sm">소중한 의견 감사합니다.</p>
                </div>
              </>
            ) : (
              <>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-500">
                  <FileText className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">미참여</p>
                  <p className="mt-1 text-sm">
                    서비스 품질 향상을 위해
                    <br />
                    참여 부탁드립니다.
                  </p>
                </div>
              </>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
