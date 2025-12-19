'use client'

import React from 'react'

import { cn } from '@/lib/utils'

export function StatCard({
  icon: Icon,
  title,
  count,
  active,
  onClick,
  colorClass,
}: {
  icon: React.ElementType
  title: string
  count: number
  active: boolean
  onClick: () => void
  colorClass: string
}) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'group flex flex-1 cursor-pointer items-center gap-4 rounded-xl border p-6 shadow-sm backdrop-blur-md transition-all duration-200 hover:scale-[1.02]',
        active ? `border-2 bg-white/60 ${colorClass}` : 'border-white/20 bg-white/40 hover:bg-white/50',
      )}
      style={{
        borderColor: active ? undefined : 'rgba(255,255,255,0.2)',
      }}
    >
      <div
        className={cn('flex h-12 w-12 items-center justify-center rounded-lg shadow-sm transition-colors', 'bg-white')}
      >
        <Icon
          size={24}
          className={cn(active ? colorClass.split(' ').find(c => c.startsWith('text-')) : 'text-gray-400')}
        />
      </div>
      <div className="flex flex-col">
        <span className={cn('text-sm font-medium', active ? 'text-gray-800' : 'text-gray-500')}>{title}</span>
        <span className={cn('text-2xl font-bold', active ? 'text-gray-900' : 'text-gray-700')}>{count}건</span>
      </div>
    </div>
  )
}
