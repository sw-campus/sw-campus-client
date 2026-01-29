'use client'

import { useRef, useState } from 'react'

import { AiAuthModal, type AiAuthModalType } from '@/features/cart/components/ai-auth-modal'
import { AiAnalysisSummary } from '@/features/cart/components/compare-table/ai-analysis-summary'
import { AiAnalyzeButton } from '@/features/cart/components/compare-table/ai-analyze-button'
import { CartItemSidebar } from '@/features/cart/components/compare-table/cart-item-sidebar'
import { CompareHeroBanner } from '@/features/cart/components/compare-table/compare-hero-banner'
import { CompareTable } from '@/features/cart/components/compare-table/compare-table'
import { LectureSummaryCard } from '@/features/cart/components/compare-table/lecture-summary-card'
import { StickyCompareHeader } from '@/features/cart/components/compare-table/sticky-compare-header'
import { VsBadge } from '@/features/cart/components/compare-table/vs-badge'
import { useAiCompare } from '@/features/cart/hooks/use-ai-compare'
import { useCartComparePageModel } from '@/features/cart/hooks/use-cart-compare-page-model'
import { useUnifiedRemoveFromCart } from '@/features/cart/hooks/use-unified-remove-from-cart'
import { getDragLectureId } from '@/features/cart/utils/cart-compare-dnd'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/store/auth-store'

export default function CartCompareSection() {
  const [isLeftOver, setIsLeftOver] = useState(false)
  const [isRightOver, setIsRightOver] = useState(false)
  const [authModalType, setAuthModalType] = useState<AiAuthModalType>(null)
  const [_isSticky, setIsSticky] = useState(false)
  const stickyTriggerRef = useRef<HTMLDivElement>(null)

  const isLoggedIn = useAuthStore(state => state.isLoggedIn)
  const { mutate: removeFromCart } = useUnifiedRemoveFromCart()

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
  } = useAiCompare({
    leftId,
    rightId,
    leftDetail,
    rightDetail,
    isLoggedIn,
  })

  // AI 분석이 가능한지 여부 (두 강의 선택 시 버튼 활성화)
  // 로그인/설문 체크는 클릭 시 모달로 처리
  const canAnalyze = Boolean(leftDetail && rightDetail)

  // AI 분석 실행 핸들러
  const handleAiAnalyze = async () => {
    // 비로그인 시 로그인 모달 표시
    if (!isLoggedIn) {
      setAuthModalType('login')
      return
    }

    const result = await runAiAnalyze()
    // 설문조사 필요 시 설문 모달 표시
    if (result && 'needsSurvey' in result && result.needsSurvey) {
      setAuthModalType('survey')
    }
  }

  // 비활성 이유 메시지
  const getDisabledReason = () => {
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

  // 카트에서 제거 시 선택 슬롯에서도 제거
  const handleRemoveFromCart = (lectureId: string) => {
    removeFromCart(lectureId)
    if (leftId === lectureId) {
      setLeftId(null)
      handleClearAi()
    }
    if (rightId === lectureId) {
      setRightId(null)
      handleClearAi()
    }
  }

  return (
    <div className="flex w-full flex-col overflow-x-hidden pb-32 md:overflow-x-visible">
      {/* 히어로 배너 */}
      <div className="page-container px-6">
        <CompareHeroBanner />
      </div>

      {/* 메인 컨텐츠 */}
      <div className="page-container overflow-x-hidden px-4 py-6 md:overflow-x-visible md:px-6 md:py-8">
        {/* 페이지 타이틀 */}
        <div className="flex items-center border-b-[0.5px] border-foreground pb-6">
          <h1 className="flex-1 text-[2rem] font-bold text-foreground">과정 비교 페이지</h1>
        </div>

        <div className="grid gap-6 md:grid-cols-[280px_minmax(0,1fr)]">
          {/* 사이드바 - 모바일에서도 표시 (접을 수 있음) */}
          <CartItemSidebar
            items={items}
            isLoading={isLoading}
            isError={isError}
            canUseItem={canUseItem}
            isAlreadySelected={isAlreadySelected}
            onPick={pickFromList}
            onRemove={handleRemoveFromCart}
          />

          {/* 메인 비교 영역 */}
          <div className="min-w-0 space-y-4 md:space-y-6">
            {/* 강의 카드 + VS badge */}
            <div className="relative flex items-center gap-4 md:gap-6">
              {/* 왼쪽 강의 */}
              <div
                className={cn('min-w-0 flex-1 rounded-xl transition-colors', isLeftOver && 'ring-2 ring-primary ring-offset-2')}
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
                  thumbnailUrl={leftDetail?.thumbnailUrl}
                  lectureId={leftId}
                  orgName={left?.orgName}
                  price={leftDetail?.price}
                  onClear={handleClearLeft}
                />
              </div>

              {/* 오른쪽 강의 */}
              <div
                className={cn('min-w-0 flex-1 rounded-xl transition-colors', isRightOver && 'ring-2 ring-primary ring-offset-2')}
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
                  thumbnailUrl={rightDetail?.thumbnailUrl}
                  lectureId={rightId}
                  orgName={right?.orgName}
                  price={rightDetail?.price}
                  onClear={handleClearRight}
                />
              </div>

              {/* VS Badge - 절대 위치 중앙 */}
              <VsBadge />
            </div>

            {/* AI 분석 결과 요약 (결과가 있을 때만 표시) */}
            <AiAnalysisSummary
              aiResult={aiResult}
              leftTitle={left?.title ?? 'A과정'}
              rightTitle={right?.title ?? 'B과정'}
              leftId={leftId}
              rightId={rightId}
            />

            {/* AI 분석 버튼 */}
            <AiAnalyzeButton
              isEnabled={canAnalyze}
              isLoading={isAiLoading}
              hasResult={Boolean(aiResult)}
              onAnalyze={handleAiAnalyze}
              onClear={handleClearAi}
              disabledReason={getDisabledReason()}
              className="w-full md:max-w-full"
            />

            {/* Sticky 트리거 포인트 */}
            <div ref={stickyTriggerRef} />

            {/* Sticky 헤더 (CompareTable 영역에 도달 시 활성화) */}
            <StickyCompareHeader
              triggerRef={stickyTriggerRef}
              leftTitle={left?.title ?? ''}
              leftId={leftId}
              rightTitle={right?.title ?? ''}
              rightId={rightId}
              canAnalyze={canAnalyze}
              isAiLoading={isAiLoading}
              hasAiResult={Boolean(aiResult)}
              onAiAnalyze={handleAiAnalyze}
              onStickyChange={setIsSticky}
            />

            {/* 비교 테이블 */}
            <CompareTable
              leftTitle={left?.title}
              rightTitle={right?.title}
              leftDetail={leftDetailResolved}
              rightDetail={rightDetailResolved}
              aiResult={aiResult}
            />
          </div>
        </div>
      </div>

      {/* AI 인증/설문 안내 모달 */}
      <AiAuthModal type={authModalType} onClose={() => setAuthModalType(null)} />
    </div>
  )
}
