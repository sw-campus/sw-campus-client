'use client'

import { useState } from 'react'

import { motion, useReducedMotion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { FiChevronDown, FiShoppingCart } from 'react-icons/fi'

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
  const [isExpanded, setIsExpanded] = useState(false)

  const availableCount = items.filter(item => canUseItem(item.categoryName) && !isAlreadySelected(item.lectureId)).length

  const content = (
    <CardContent className="space-y-2">
      {isLoading ? (
        <div className="text-muted-foreground text-sm">불러오는 중...</div>
      ) : isError ? (
        <div className="text-muted-foreground text-sm">장바구니 목록을 불러오지 못했습니다.</div>
      ) : items.length === 0 ? (
        <div className="text-muted-foreground text-sm">장바구니가 비어있습니다.</div>
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
              onClick={() => onPick(item.lectureId)}
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
          </motion.div>
        ))
      )}
    </CardContent>
  )

  return (
    <>
      {/* 데스크톱: 항상 표시 */}
      <Card className="hidden lg:block">
        <CardHeader>
          <CardTitle className="text-base">장바구니</CardTitle>
          <div className="text-sm text-gray-400">동일한 카테고리의 항목끼리 비교할 수 있습니다.</div>
        </CardHeader>
        {content}
      </Card>

      {/* 모바일: 접이식 */}
      <Card className="lg:hidden">
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex w-full items-center justify-between p-4"
        >
          <div className="flex items-center gap-2">
            <FiShoppingCart className="h-5 w-5 text-gray-500" />
            <span className="text-base font-semibold">장바구니</span>
            {availableCount > 0 && (
              <span className="rounded-full bg-orange-100 px-2 py-0.5 text-xs font-medium text-orange-600">
                {availableCount}개 선택 가능
              </span>
            )}
          </div>
          <FiChevronDown
            className={cn(
              'h-5 w-5 text-gray-400 transition-transform duration-200',
              isExpanded && 'rotate-180'
            )}
          />
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
                        onClick={() => {
                          onPick(item.lectureId)
                          // 선택 후 접기 (선택 가능한 항목이 하나 남았을 때)
                          if (availableCount <= 1) setIsExpanded(false)
                        }}
                        className="hover:bg-muted/50 border-border disabled:bg-muted/20 disabled:text-muted-foreground relative flex w-full items-center gap-3 overflow-hidden rounded-md border p-2 text-left disabled:cursor-not-allowed"
                      >
                        {(!canUseItem(item.categoryName) || isAlreadySelected(item.lectureId)) && (
                          <span aria-hidden className="bg-foreground/5 absolute inset-0" />
                        )}
                        <div className="bg-muted relative z-10 h-8 w-8 shrink-0 overflow-hidden rounded-md">
                          {item.thumbnailUrl ? (
                            <Image
                              src={item.thumbnailUrl}
                              alt=""
                              fill
                              sizes="32px"
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
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </>
  )
}
