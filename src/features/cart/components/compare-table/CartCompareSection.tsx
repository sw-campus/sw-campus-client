'use client'

import { useEffect, useState } from 'react'

import Image from 'next/image'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CompareTable } from '@/features/cart/components/compare-table/CompareTable'
import { LectureSummaryCard } from '@/features/cart/components/compare-table/LectureSummaryCard'
import { useCartLecturesWithDetailQuery } from '@/features/cart/hooks/useCartLecturesWithDetailQuery'
import type { CartItem } from '@/features/cart/types/cart.type'
import { useLectureDetailQuery } from '@/features/lecture'
import { cn } from '@/lib/utils'
import { useCartCompareStore } from '@/store/cartCompare.store'

type Side = 'left' | 'right'

const DND_MIME = 'application/x-sw-campus-lecture-id'
const EMPTY_CART_ITEMS: CartItem[] = []
const LABEL_COL_GRID_CLASS = 'md:grid-cols-[13.75rem_1fr_1px_1fr]'
const LABEL_COL_TABLE_CLASS = 'w-[13.75rem]'

function setDragLectureId(e: React.DragEvent, lectureId: string) {
  e.dataTransfer.setData(DND_MIME, lectureId)
  e.dataTransfer.setData('text/plain', lectureId)
  e.dataTransfer.effectAllowed = 'copy'
}

function getDragLectureId(e: React.DragEvent) {
  return e.dataTransfer.getData(DND_MIME) || e.dataTransfer.getData('text/plain')
}

export default function CartCompareSection() {
  const { data, isLoading, isError } = useCartLecturesWithDetailQuery()
  const items = data ?? EMPTY_CART_ITEMS

  const { leftId, rightId, setLeftId, setRightId } = useCartCompareStore()
  const [isLeftOver, setIsLeftOver] = useState(false)
  const [isRightOver, setIsRightOver] = useState(false)

  useEffect(() => {
    if (leftId && !items.some(i => i.lectureId === leftId)) setLeftId(null)
    if (rightId && !items.some(i => i.lectureId === rightId)) setRightId(null)
  }, [items, leftId, rightId, setLeftId, setRightId])

  const left = items.find(i => i.lectureId === leftId) ?? null
  const right = items.find(i => i.lectureId === rightId) ?? null

  const { data: leftDetail } = useLectureDetailQuery(leftId)
  const { data: rightDetail } = useLectureDetailQuery(rightId)

  const leftCategory = left?.categoryName ?? leftDetail?.categoryName
  const rightCategory = right?.categoryName ?? rightDetail?.categoryName
  const lockedCategory = leftCategory ?? rightCategory ?? null

  const canUseItem = (itemCategory: string | undefined) => {
    if (!lockedCategory) return true
    if (!itemCategory) return false
    return itemCategory === lockedCategory
  }

  const isAlreadySelected = (lectureId: string) => {
    return lectureId === leftId || lectureId === rightId
  }

  const onDropLecture = (side: Side, lectureId: string) => {
    if (isAlreadySelected(lectureId)) return

    const dropped = items.find(i => i.lectureId === lectureId)
    const droppedCategory = dropped?.categoryName
    if (!canUseItem(droppedCategory)) return

    if (side === 'left') setLeftId(lectureId)
    else setRightId(lectureId)
  }

  return (
    <div className="mx-auto grid w-full gap-4 overflow-x-hidden py-6 md:grid-cols-[280px_1fr]">
      <aside>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">장바구니</CardTitle>
            <div className="text-sm text-gray-400">동일한 카테고리의 항목끼리 비교할 수 있습니다.</div>
          </CardHeader>
          <CardContent className="space-y-2">
            {isLoading ? (
              <div className="text-muted-foreground text-sm">불러오는 중...</div>
            ) : isError ? (
              <div className="text-muted-foreground text-sm">장바구니 목록을 불러오지 못했습니다.</div>
            ) : items.length === 0 ? (
              <div className="text-muted-foreground text-sm">장바구니가 비어있습니다.</div>
            ) : (
              items.map(item => (
                <button
                  key={item.lectureId}
                  type="button"
                  disabled={!canUseItem(item.categoryName) || isAlreadySelected(item.lectureId)}
                  draggable={canUseItem(item.categoryName) && !isAlreadySelected(item.lectureId)}
                  onDragStart={e => {
                    if (isAlreadySelected(item.lectureId)) {
                      e.preventDefault()
                      return
                    }
                    if (!canUseItem(item.categoryName)) {
                      e.preventDefault()
                      return
                    }
                    setDragLectureId(e, item.lectureId)
                  }}
                  onClick={() => {
                    if (isAlreadySelected(item.lectureId)) return
                    if (!canUseItem(item.categoryName)) return
                    if (!leftId) setLeftId(item.lectureId)
                    else if (!rightId) setRightId(item.lectureId)
                    else setLeftId(item.lectureId)
                  }}
                  className="hover:bg-muted/50 border-border disabled:bg-muted/20 disabled:text-muted-foreground relative flex w-full items-center gap-3 overflow-hidden rounded-md border p-2 text-left disabled:cursor-not-allowed"
                >
                  {(!canUseItem(item.categoryName) || isAlreadySelected(item.lectureId)) && (
                    <span aria-hidden className="bg-foreground/5 absolute inset-0" />
                  )}
                  <div className="bg-muted relative z-10 h-10 w-10 overflow-hidden rounded-md">
                    {item.thumbnailUrl ? (
                      <Image
                        src={item.thumbnailUrl}
                        alt=""
                        fill
                        sizes="40px"
                        className="object-cover"
                        unoptimized={item.thumbnailUrl.startsWith('http')}
                      />
                    ) : null}
                  </div>
                  <div className="relative z-10 min-w-0 flex-1">
                    <div className="truncate text-sm font-medium">{item.title}</div>
                    <div className="text-muted-foreground truncate text-xs">{item.categoryName ?? '-'}</div>
                  </div>
                </button>
              ))
            )}
          </CardContent>
        </Card>
      </aside>

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
                onDropLecture('left', lectureId)
              }}
              aria-label="왼쪽 드롭 영역"
            >
              <LectureSummaryCard
                side="left"
                title={left?.title ?? ''}
                orgName={leftDetail?.orgName}
                thumbnailUrl={leftDetail?.thumbnailUrl}
                lectureId={leftId}
                onClear={() => setLeftId(null)}
              />
            </div>
            <div className="bg-border hidden w-px md:block" />
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
                onDropLecture('right', lectureId)
              }}
              aria-label="오른쪽 드롭 영역"
            >
              <LectureSummaryCard
                side="right"
                title={right?.title ?? ''}
                orgName={rightDetail?.orgName}
                thumbnailUrl={rightDetail?.thumbnailUrl}
                lectureId={rightId}
                onClear={() => setRightId(null)}
              />
            </div>
          </div>
          <CompareTable
            leftTitle={left?.title}
            rightTitle={right?.title}
            leftDetail={leftDetail}
            rightDetail={rightDetail}
            labelColClassName={LABEL_COL_TABLE_CLASS}
          />
        </CardContent>
      </Card>
    </div>
  )
}
