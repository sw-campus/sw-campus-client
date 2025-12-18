'use client'

import { useState } from 'react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CartItemSidebar } from '@/features/cart/components/compare-table/CartItemSidebar'
import { CompareTable } from '@/features/cart/components/compare-table/CompareTable'
import { LectureSummaryCard } from '@/features/cart/components/compare-table/LectureSummaryCard'
import { useCartComparePageModel } from '@/features/cart/hooks/useCartComparePageModel'
import { getDragLectureId } from '@/features/cart/utils/cartCompareDnd'
import { cn } from '@/lib/utils'

const LABEL_COL_GRID_CLASS = 'md:grid-cols-[13.75rem_1fr_1px_1fr]'
const LABEL_COL_TABLE_CLASS = 'w-[13.75rem]'

export default function CartCompareSection() {
  const [isLeftOver, setIsLeftOver] = useState(false)
  const [isRightOver, setIsRightOver] = useState(false)

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
                dropLecture('left', lectureId)
              }}
              aria-label="왼쪽 드롭 영역"
            >
              <LectureSummaryCard
                side="left"
                title={left?.title ?? ''}
                orgName={leftOrgName}
                thumbnailUrl={leftDetail?.thumbnailUrl}
                lectureId={leftId}
                onClear={() => setLeftId(null)}
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
                dropLecture('right', lectureId)
              }}
              aria-label="오른쪽 드롭 영역"
            >
              <LectureSummaryCard
                side="right"
                title={right?.title ?? ''}
                orgName={rightOrgName}
                thumbnailUrl={rightDetail?.thumbnailUrl}
                lectureId={rightId}
                onClear={() => setRightId(null)}
              />
            </div>
          </div>
          <CompareTable
            leftTitle={left?.title}
            rightTitle={right?.title}
            leftDetail={leftDetailResolved}
            rightDetail={rightDetailResolved}
            labelColClassName={LABEL_COL_TABLE_CLASS}
          />
        </CardContent>
      </Card>
    </div>
  )
}
