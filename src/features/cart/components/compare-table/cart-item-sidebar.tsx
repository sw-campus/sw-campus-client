'use client'

import { useState } from 'react'

import { motion, useReducedMotion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { FiChevronDown } from 'react-icons/fi'
import { PiRobotDuotone } from 'react-icons/pi'

import { Card } from '@/components/ui/card'
import type { CartItem } from '@/features/cart/types/cart.type'
import { setDragLectureId } from '@/features/cart/utils/cart-compare-dnd'
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
  const [isExpanded, setIsExpanded] = useState(true)

  const availableCount = items.filter(
    item => canUseItem(item.categoryName) && !isAlreadySelected(item.lectureId),
  ).length

  const cartItemList = (isMobile: boolean = false) => (
    <>
      {isLoading ? (
        <div className="text-muted-foreground text-sm">불러오는 중...</div>
      ) : isError ? (
        <div className="text-muted-foreground text-sm">AI 심층 비교 목록을 불러오지 못했습니다.</div>
      ) : items.length === 0 ? (
        <div className="text-muted-foreground text-sm">AI 심층 비교 목록이 비어있습니다.</div>
      ) : (
        items.map(item => {
          const selected = isAlreadySelected(item.lectureId)
          const disabled = !canUseItem(item.categoryName) || selected

          return (
            <motion.div
              key={item.lectureId}
              className="w-full"
              whileHover={disabled ? undefined : { x: 2 }}
              whileTap={disabled ? undefined : { scale: 0.99 }}
              transition={reduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 320, damping: 26 }}
            >
              <button
                type="button"
                disabled={disabled}
                draggable={!isMobile && !disabled}
                onDragStart={e => {
                  if (disabled) {
                    e.preventDefault()
                    return
                  }
                  setDragLectureId(e, item.lectureId)
                }}
                onClick={() => onPick(item.lectureId)}
                className={cn(
                  isMobile
                    ? cn(
                        'hover:bg-muted/50 border-border disabled:bg-muted/20 disabled:text-muted-foreground relative flex w-full items-center gap-3 overflow-hidden rounded-md border p-2 text-left disabled:cursor-not-allowed',
                      )
                    : cn(
                        'relative flex w-full items-center gap-3 overflow-hidden rounded-xl p-3 text-left shadow-[4px_4px_20px_0px_rgba(161,161,170,0.25)] transition-colors',
                        selected
                          ? 'border border-brand-gold bg-brand-gold-light'
                          : 'border border-transparent bg-white hover:bg-muted/50',
                        disabled && !selected && 'cursor-not-allowed opacity-50',
                      ),
                )}
              >
                {isMobile && disabled && (
                  <span aria-hidden className="bg-foreground/5 absolute inset-0" />
                )}
                <div className={cn(
                  'relative shrink-0 overflow-hidden rounded',
                  isMobile ? 'bg-muted size-8' : 'size-[46px]',
                )}>
                  {item.thumbnailUrl ? (
                    <Image
                      src={item.thumbnailUrl}
                      alt=""
                      fill
                      sizes={isMobile ? '32px' : '46px'}
                      className="object-cover"
                      unoptimized={item.thumbnailUrl.startsWith('http')}
                    />
                  ) : isMobile ? null : (
                    <div className="size-full bg-muted" />
                  )}
                </div>
                <div className={cn('min-w-0 flex-1', isMobile ? '' : 'space-y-1')}>
                  <div className={cn(
                    'truncate',
                    isMobile ? 'text-sm font-medium' : 'text-sm font-semibold text-foreground',
                  )}>
                    {item.title}
                  </div>
                  <div className={cn(
                    'truncate',
                    isMobile ? 'text-muted-foreground text-xs' : 'text-sm text-gray-400',
                  )}>
                    {item.categoryName ?? '-'}
                  </div>
                </div>
              </button>
            </motion.div>
          )
        })
      )}
    </>
  )

  return (
    <>
      {/* 데스크톱: Figma 디자인 적용 */}
      <div className="hidden overflow-clip rounded-xl bg-white p-6 shadow-[4px_4px_20px_0px_rgba(161,161,170,0.25)] md:block">
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex w-full items-start"
        >
          <div className="flex w-full flex-col gap-1">
            <div className="flex w-full items-center justify-between">
              <div className="flex items-center gap-1">
                <PiRobotDuotone className="size-4 shrink-0" />
                <span className="text-base font-semibold text-foreground">AI 심층 비교</span>
                {availableCount > 0 && (
                  <span className="shrink-0 rounded border-[0.5px] border-brand-gold bg-brand-gold-light px-2 py-0.5 text-[10px] text-brand-gold">
                    {availableCount}개 선택 가능
                  </span>
                )}
              </div>
              <FiChevronDown
                className={cn(
                  'size-4 shrink-0 transition-transform duration-200',
                  isExpanded && 'rotate-180',
                )}
              />
            </div>
            <p className="text-xs text-gray-400">동일한 카테고리의 항목끼리 비교할 수 있습니다.</p>
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
              <div className="flex flex-col gap-3 pt-4">
                {cartItemList(false)}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 모바일: 기존 디자인 유지 */}
      <Card className="overflow-hidden md:hidden">
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
                isExpanded && 'rotate-180',
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
                <div className="mb-2 text-xs text-gray-400">동일한 카테고리의 항목끼리 비교할 수 있습니다.</div>
                <div className="max-h-60 space-y-2 overflow-x-hidden overflow-y-auto">
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
