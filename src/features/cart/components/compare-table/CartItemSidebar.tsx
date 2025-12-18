'use client'

import { motion, useReducedMotion } from 'framer-motion'
import Image from 'next/image'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { CartItem } from '@/features/cart/types/cart.type'
import { setDragLectureId } from '@/features/cart/utils/cartCompareDnd'

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

  return (
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
    </Card>
  )
}
