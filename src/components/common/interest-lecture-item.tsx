'use client'

import Image from 'next/image'
import { ImageOff, X } from 'lucide-react'

import { cn } from '@/lib/utils'
import type { CartItem } from '@/features/cart/types/cart.type'

interface InterestLectureItemProps {
  item: CartItem
  isSelected?: boolean
  disabled?: boolean
  size?: 'sm' | 'md' // 미지정 시 container query 반응형
  onClick?: () => void
  onRemove?: () => void
  className?: string
}

export function InterestLectureItem({
  item,
  isSelected = false,
  disabled = false,
  size,
  onClick,
  onRemove,
  className,
}: InterestLectureItemProps) {
  const responsive = size === undefined

  return (
    <div
      onClick={disabled ? undefined : onClick}
      className={cn(
        'w-full rounded-lg flex items-center text-left transition-all shadow-sm',
        responsive
          ? 'p-2 gap-2 @[280px]:p-3 @[280px]:gap-3'
          : size === 'sm' ? 'p-2 gap-2' : 'p-3 gap-3',
        isSelected
          ? 'bg-brand-gold-light/50 outline outline-1 outline-brand-gold/50'
          : disabled
            ? 'bg-muted/50 opacity-50 cursor-not-allowed'
            : 'bg-muted/30 outline outline-1 outline-border hover:bg-muted/50',
        onClick && !disabled && 'cursor-pointer',
        className,
      )}
    >
      {/* 썸네일 */}
      <div
        className={cn(
          'shrink-0 overflow-hidden rounded-lg bg-muted relative',
          responsive
            ? 'size-9 @[280px]:size-[46px]'
            : size === 'sm' ? 'size-9' : 'size-[46px]',
        )}
      >
        {item.thumbnailUrl ? (
          <Image
            src={item.thumbnailUrl}
            alt={item.title}
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex size-full items-center justify-center">
            <ImageOff className="size-4 text-muted-foreground" />
          </div>
        )}
      </div>

      {/* 텍스트 */}
      <div className="flex-1 min-w-0 flex flex-col gap-0.5">
        <span
          className={cn(
            'font-semibold text-foreground leading-tight line-clamp-1',
            responsive
              ? 'text-xs @[280px]:text-sm'
              : size === 'sm' ? 'text-xs' : 'text-sm',
          )}
        >
          {item.title}
        </span>
        <span
          className={cn(
            'text-muted-foreground',
            responsive
              ? 'text-[10px] @[280px]:text-xs'
              : size === 'sm' ? 'text-[10px]' : 'text-xs',
          )}
        >
          {item.categoryName || item.orgName || '카테고리'}
        </span>
      </div>

      {/* 삭제 버튼 */}
      {onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            onRemove()
          }}
          className="size-5 shrink-0 flex items-center justify-center text-muted-foreground hover:text-foreground"
        >
          <X className="size-4" />
        </button>
      )}
    </div>
  )
}
