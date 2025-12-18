'use client'

import { useState } from 'react'

import { toast } from 'sonner'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AiFinalRecommendation } from '@/features/cart/components/AiFinalRecommendation'
import { AiFloatingButton } from '@/features/cart/components/AiFloatingButton'
import { CartItemSidebar } from '@/features/cart/components/compare-table/CartItemSidebar'
import { CompareTable } from '@/features/cart/components/compare-table/CompareTable'
import { LectureSummaryCard } from '@/features/cart/components/compare-table/LectureSummaryCard'
import { useCartComparePageModel } from '@/features/cart/hooks/useCartComparePageModel'
import { getDragLectureId } from '@/features/cart/utils/cartCompareDnd'
import type { ComparisonResult } from '@/features/lecture/actions/gemini'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/store/authStore'

const LABEL_COL_GRID_CLASS = 'md:grid-cols-[13.75rem_1fr_1px_1fr]'
const LABEL_COL_TABLE_CLASS = 'w-[13.75rem]'

export default function CartCompareSection() {
  const [isLeftOver, setIsLeftOver] = useState(false)
  const [isRightOver, setIsRightOver] = useState(false)

  // AI 분석 상태
  const [aiResult, setAiResult] = useState<ComparisonResult | null>(null)
  const [isAiLoading, setIsAiLoading] = useState(false)

  const isLoggedIn = useAuthStore(state => state.isLoggedIn)

  const {
    items,
    isLoading,
    isError,
    leftId,
    rightId,
    setLeftId,
    setRightId,
    left,
    right,
    leftDetail,
    rightDetail,
    leftOrgName,
    rightOrgName,
    leftDetailResolved,
    rightDetailResolved,
    canUseItem,
    isAlreadySelected,
    pickFromList,
    dropLecture,
  } = useCartComparePageModel()

  // AI 분석이 가능한지 여부
  const canAnalyze = Boolean(leftDetail && rightDetail && isLoggedIn)

  // AI 분석 실행 핸들러
  const handleAiAnalyze = async () => {
    if (!leftDetail || !rightDetail) {
      toast.error('두 강의를 모두 선택해주세요')
      return
    }

    if (!isLoggedIn) {
      toast.error('로그인이 필요한 기능입니다')
      return
    }

    setIsAiLoading(true)
    setAiResult(null)

    // 1단계: 모듈 동적 로딩
    let compareCoursesWithAI: typeof import('@/features/lecture/actions/gemini').compareCoursesWithAI
    let getSurvey: typeof import('@/features/mypage/api/survey.api').getSurvey
    let getProfile: typeof import('@/features/mypage/api/survey.api').getProfile

    try {
      const [geminiModule, surveyModule] = await Promise.all([
        import('@/features/lecture/actions/gemini'),
        import('@/features/mypage/api/survey.api'),
      ])
      compareCoursesWithAI = geminiModule.compareCoursesWithAI
      getSurvey = surveyModule.getSurvey
      getProfile = surveyModule.getProfile
    } catch (error) {
      console.error('Module Loading Error:', error)
      toast.error('서비스 모듈을 불러오는데 실패했습니다. 페이지를 새로고침해주세요.')
      setIsAiLoading(false)
      return
    }

    // 2단계: 사용자 데이터 조회
    let survey: Awaited<ReturnType<typeof getSurvey>>
    let profile: Awaited<ReturnType<typeof getProfile>>

    try {
      ;[survey, profile] = await Promise.all([getSurvey(), getProfile()])
    } catch (error) {
      console.error('User Data Fetch Error:', error)
      toast.error('사용자 정보를 불러오는데 실패했습니다. 잠시 후 다시 시도해주세요.')
      setIsAiLoading(false)
      return
    }

    if (!survey.exists) {
      toast.warning('설문조사를 먼저 작성해주세요. 더 정확한 추천을 받을 수 있습니다.')
    }

    // 3단계: AI 비교 분석 실행
    try {
      const result = await compareCoursesWithAI(leftDetail, rightDetail, {
        ...survey,
        userLocation: profile.location,
      })
      setAiResult(result)
      toast.success('AI 분석이 완료되었습니다!')
    } catch (error) {
      console.error('AI Analysis Error:', error)
      const errorMessage = error instanceof Error ? error.message : 'AI 분석 중 오류가 발생했습니다.'
      toast.error(`${errorMessage} 잠시 후 다시 시도해주세요.`)
    } finally {
      setIsAiLoading(false)
    }
  }

  // AI 분석 초기화
  const handleClearAi = () => {
    setAiResult(null)
  }

  // 비활성 이유 메시지
  const getDisabledReason = () => {
    if (!isLoggedIn) return '로그인이 필요합니다'
    if (!leftDetail || !rightDetail) return '두 강의를 모두 선택해주세요'
    return ''
  }

  // 강의 드롭 핸들러 (AI 결과 초기화 포함)
  const handleDropLecture = (side: 'left' | 'right', lectureId: string) => {
    dropLecture(side, lectureId)
    setAiResult(null)
  }

  // 강의 선택 해제 핸들러 (AI 결과 초기화 포함)
  const handleClearLeft = () => {
    setLeftId(null)
    setAiResult(null)
  }

  const handleClearRight = () => {
    setRightId(null)
    setAiResult(null)
  }

  return (
    <div className="mx-auto grid w-full gap-4 overflow-x-hidden py-6 md:grid-cols-[280px_1fr]">
      <CartItemSidebar
        items={items}
        isLoading={isLoading}
        isError={isError}
        canUseItem={canUseItem}
        isAlreadySelected={isAlreadySelected}
        onPick={pickFromList}
      />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">과정비교 페이지</CardTitle>
          <div className="text-muted-foreground text-sm">
            사이드바에서 강의를 드래그해서 왼쪽/오른쪽 영역에 놓으면 비교표가 업데이트됩니다.
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className={cn('grid grid-cols-1 overflow-hidden rounded-md', LABEL_COL_GRID_CLASS)}>
            <div aria-hidden className="bg-muted/10 hidden md:block" />
            <div
              className={cn(isLeftOver && 'bg-muted/20')}
              onDragEnter={e => {
                e.preventDefault()
                setIsLeftOver(true)
              }}
              onDragLeave={() => setIsLeftOver(false)}
              onDragOver={e => {
                e.preventDefault()
                e.dataTransfer.dropEffect = 'copy'
              }}
              onDrop={e => {
                e.preventDefault()
                setIsLeftOver(false)
                const lectureId = getDragLectureId(e)
                if (!lectureId) return
                handleDropLecture('left', lectureId)
              }}
              aria-label="왼쪽 드롭 영역"
            >
              <LectureSummaryCard
                side="left"
                title={left?.title ?? ''}
                orgName={leftOrgName}
                thumbnailUrl={leftDetail?.thumbnailUrl}
                lectureId={leftId}
                onClear={handleClearLeft}
              />
            </div>
            <div aria-hidden className="hidden w-px md:block">
              <div className="bg-border h-full w-px" />
            </div>
            <div
              className={cn(isRightOver && 'bg-muted/20')}
              onDragEnter={e => {
                e.preventDefault()
                setIsRightOver(true)
              }}
              onDragLeave={() => setIsRightOver(false)}
              onDragOver={e => {
                e.preventDefault()
                e.dataTransfer.dropEffect = 'copy'
              }}
              onDrop={e => {
                e.preventDefault()
                setIsRightOver(false)
                const lectureId = getDragLectureId(e)
                if (!lectureId) return
                handleDropLecture('right', lectureId)
              }}
              aria-label="오른쪽 드롭 영역"
            >
              <LectureSummaryCard
                side="right"
                title={right?.title ?? ''}
                orgName={rightOrgName}
                thumbnailUrl={rightDetail?.thumbnailUrl}
                lectureId={rightId}
                onClear={handleClearRight}
              />
            </div>
          </div>
          <CompareTable
            leftTitle={left?.title}
            rightTitle={right?.title}
            leftDetail={leftDetailResolved}
            rightDetail={rightDetailResolved}
            labelColClassName={LABEL_COL_TABLE_CLASS}
            aiResult={aiResult}
          />

          {/* AI 최종 추천 */}
          {aiResult && (
            <AiFinalRecommendation
              recommendation={aiResult.finalRecommendation}
              leftTitle={left?.title ?? 'A과정'}
              rightTitle={right?.title ?? 'B과정'}
              leftId={leftId}
              rightId={rightId}
            />
          )}
        </CardContent>
      </Card>

      {/* AI 플로팅 버튼 - 화면 우하단 고정 */}
      <AiFloatingButton
        isEnabled={canAnalyze}
        isLoading={isAiLoading}
        hasResult={Boolean(aiResult)}
        onAnalyze={handleAiAnalyze}
        onClear={handleClearAi}
        disabledReason={getDisabledReason()}
      />
    </div>
  )
}
