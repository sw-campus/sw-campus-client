'use client'

import { useState } from 'react'

import { motion, useReducedMotion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { FiChevronDown, FiChevronUp } from 'react-icons/fi'
import { PiRobotDuotone } from 'react-icons/pi'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { CartItem } from '@/features/cart/types/cart.type'
import { setDragLectureId } from '@/features/cart/utils/cartCompareDnd'
import { cn } from '@/lib/utils'

type Props = {
  items: CartItem[]
  isLoading: boolean
  isError: boolean
  canUseItem: (itemCategory: string | undefined) => boolean
  isAlreadySelected: (lectureId: string) => boolean
  onPick: (lectureId: string) => void
}

export function CartItemSidebar({ items, isLoading, isError, canUseItem, isAlreadySelected, onPick }: Props) {
  const reduceMotion = useReducedMotion()
  const [isExpanded, setIsExpanded] = useState(true) // 데스크톱/모바일 공통 - 기본: 펼침

  const availableCount = items.filter(item => canUseItem(item.categoryName) && !isAlreadySelected(item.lectureId)).length

  const cartItemList = (isMobile: boolean = false) => (
    <>
      {isLoading ? (
        <div className="text-muted-foreground text-sm">불러오는 중...</div>
      ) : isError ? (
        <div className="text-muted-foreground text-sm">AI 심층 비교 목록을 불러오지 못했습니다.</div>
      ) : items.length === 0 ? (
        <div className="text-muted-foreground text-sm">AI 심층 비교 목록이 비어있습니다.</div>
      ) : (
        items.map(item => (
          <motion.div
            key={item.lectureId}
            className="w-full"
            whileHover={!canUseItem(item.categoryName) || isAlreadySelected(item.lectureId) ? undefined : { x: 2 }}
            whileTap={
              !canUseItem(item.categoryName) || isAlreadySelected(item.lectureId) ? undefined : { scale: 0.99 }
            }
            transition={reduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 320, damping: 26 }}
          >
            <button
              type="button"
              disabled={!canUseItem(item.categoryName) || isAlreadySelected(item.lectureId)}
              draggable={!isMobile && canUseItem(item.categoryName) && !isAlreadySelected(item.lectureId)}
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
              onClick={() => onPick(item.lectureId)}
              className="hover:bg-muted/50 border-border disabled:bg-muted/20 disabled:text-muted-foreground relative flex w-full items-center gap-3 overflow-hidden rounded-md border p-2 text-left disabled:cursor-not-allowed"
            >
              {(!canUseItem(item.categoryName) || isAlreadySelected(item.lectureId)) && (
                <span aria-hidden className="bg-foreground/5 absolute inset-0" />
              )}
              <div className={cn("bg-muted relative z-10 overflow-hidden rounded-md", isMobile ? "h-8 w-8 shrink-0" : "h-10 w-10")}>
                {item.thumbnailUrl ? (
                  <Image
                    src={item.thumbnailUrl}
                    alt=""
                    fill
                    sizes={isMobile ? "32px" : "40px"}
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
          </motion.div>
        ))
      )}
    </>
  )

  return (
    <>
      {/* 데스크톱: 접이식 */}
      <Card className="hidden lg:block">
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex w-full items-center justify-between gap-4 p-4"
        >
          <div className="flex items-center gap-2 whitespace-nowrap">
            <PiRobotDuotone className="h-5 w-5 shrink-0 text-gray-500" />
            <span className="text-base font-semibold">AI 심층 비교</span>
            {availableCount > 0 && (
              <span className="shrink-0 rounded-full bg-orange-100 px-2 py-0.5 text-xs font-medium text-orange-600">
                {availableCount}개 선택 가능
              </span>
            )}
          </div>
          <div className="flex shrink-0 items-center gap-1 text-sm text-gray-400">
            <span className="whitespace-nowrap">{isExpanded ? '숨기기' : '보기'}</span>
            <FiChevronDown
              className={cn(
                'h-4 w-4 transition-transform duration-200',
                isExpanded && 'rotate-180'
              )}
            />
          </div>
        </button>
        <AnimatePresence initial={false}>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="border-t px-4 pb-4 pt-2">
                <div className="text-xs text-gray-400 mb-3">동일한 카테고리의 항목끼리 비교할 수 있습니다.</div>
                <div className="space-y-2">
                  {cartItemList(false)}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>

      {/* 모바일: 접이식 */}
      <Card className="lg:hidden">
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex w-full items-center justify-between gap-4 p-4"
        >
          <div className="flex items-center gap-2 whitespace-nowrap">
            <PiRobotDuotone className="h-5 w-5 shrink-0 text-gray-500" />
            <span className="text-base font-semibold">AI 심층 비교</span>
            {availableCount > 0 && (
              <span className="shrink-0 rounded-full bg-orange-100 px-2 py-0.5 text-xs font-medium text-orange-600">
                {availableCount}개 선택 가능
              </span>
            )}
          </div>
          <div className="flex shrink-0 items-center gap-1 text-sm text-gray-400">
            <span className="whitespace-nowrap">{isExpanded ? '숨기기' : '보기'}</span>
            <FiChevronDown
              className={cn(
                'h-4 w-4 transition-transform duration-200',
                isExpanded && 'rotate-180'
              )}
            />
          </div>
        </button>
        <AnimatePresence initial={false}>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="border-t px-4 pb-4 pt-2">
                <div className="text-xs text-gray-400 mb-2">동일한 카테고리의 항목끼리 비교할 수 있습니다.</div>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {cartItemList(true)}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </>
  )
}
