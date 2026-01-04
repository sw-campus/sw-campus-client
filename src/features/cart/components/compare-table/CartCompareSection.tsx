'use client'

import { useState } from 'react'

import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { AiFinalRecommendation } from '@/features/cart/components/AiFinalRecommendation'
import { AiFloatingButton } from '@/features/cart/components/AiFloatingButton'
import { CartItemSidebar } from '@/features/cart/components/compare-table/CartItemSidebar'
import { CompareTable } from '@/features/cart/components/compare-table/CompareTable'
import { LectureSummaryCard } from '@/features/cart/components/compare-table/LectureSummaryCard'
import { useAiCompare } from '@/features/cart/hooks/useAiCompare'
import { useCartComparePageModel } from '@/features/cart/hooks/useCartComparePageModel'
import { getDragLectureId } from '@/features/cart/utils/cartCompareDnd'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/store/authStore'

const LABEL_COL_GRID_CLASS = 'md:grid-cols-[13.75rem_1fr_1px_1fr]'
const LABEL_COL_TABLE_CLASS = 'w-[13.75rem]'

export default function CartCompareSection() {
  const router = useRouter()
  const [isLeftOver, setIsLeftOver] = useState(false)
  const [isRightOver, setIsRightOver] = useState(false)
  const [isSurveyDialogOpen, setIsSurveyDialogOpen] = useState(false)

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

  // AI 분석 훅 (TanStack Query 캐싱 적용)
  const {
    result: aiResult,
    isLoading: isAiLoading,
    analyze: runAiAnalyze,
    clearResult: handleClearAi,
    hasCachedResult,
  } = useAiCompare({
    leftId,
    rightId,
    leftDetail,
    rightDetail,
    isLoggedIn,
  })

  // AI 분석이 가능한지 여부
  const canAnalyze = Boolean(leftDetail && rightDetail && isLoggedIn)

  // AI 분석 실행 핸들러 (캐싱 적용)
  const handleAiAnalyze = async () => {
    const result = await runAiAnalyze()
    // 설문조사 필요 시 다이얼로그 오픈
    if (result && 'needsSurvey' in result && result.needsSurvey) {
      setIsSurveyDialogOpen(true)
    }
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
    handleClearAi()
  }

  // 강의 선택 해제 핸들러 (AI 결과 초기화 포함)
  const handleClearLeft = () => {
    setLeftId(null)
    handleClearAi()
  }

  const handleClearRight = () => {
    setRightId(null)
    handleClearAi()
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

      <Dialog open={isSurveyDialogOpen} onOpenChange={setIsSurveyDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>설문조사가 필요합니다</DialogTitle>
            <DialogDescription>
              AI 비교 분석을 위해서는 설문조사 결과가 필요합니다.
              <br />
              마이페이지에서 설문조사를 진행하시겠습니까?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSurveyDialogOpen(false)}>
              취소
            </Button>
            <Button onClick={() => router.push('/mypage/survey')}>확인</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
