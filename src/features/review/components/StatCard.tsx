'use client'

import React from 'react'

import { cn } from '@/lib/utils'

interface StatCardProps {
  icon: React.ElementType
  title: string
  count: number
  active: boolean
  onClick: () => void
  color: 'orange' | 'emerald' | 'rose' | 'blue'
}

export function StatCard({ icon: Icon, title, count, active, onClick, color }: StatCardProps) {
  const colorMap = {
    orange: {
      border: 'border-orange-400',
      text: 'text-orange-400',
      activeBg: 'bg-orange-50/50',
    },
    emerald: {
      border: 'border-emerald-500',
      text: 'text-emerald-500',
      activeBg: 'bg-emerald-50/50',
    },
    rose: {
      border: 'border-rose-500',
      text: 'text-rose-500',
      activeBg: 'bg-rose-50/50',
    },
    blue: {
      border: 'border-blue-500',
      text: 'text-blue-500',
      activeBg: 'bg-blue-50/50',
    },
  }

  const theme = colorMap[color]

  return (
    <div
      onClick={onClick}
      className={cn(
        'group flex flex-1 cursor-pointer items-center gap-4 rounded-xl border p-6 transition-all duration-200 hover:scale-[1.02]',
        theme.border,
        active ? cn('border-2 bg-white/80 shadow-md', theme.activeBg) : 'bg-white/40 shadow-sm hover:bg-white/50',
      )}
    >
      <div
        className={cn(
          'flex h-12 w-12 items-center justify-center rounded-lg bg-white shadow-sm transition-colors',
          theme.text,
        )}
      >
        <Icon size={24} className={cn('transition-colors', theme.text)} />
      </div>
      <div className="flex flex-col">
        <span
          className={cn(
            'text-sm font-medium transition-colors',
            active ? 'border-b-2 text-gray-900' : 'text-gray-500',
            active && theme.border.replace('border-', 'border-b-'),
          )}
        >
          {title}
        </span>
        <span className={cn('text-2xl font-bold transition-colors', active ? 'text-gray-900' : 'text-gray-700')}>
          {count}건
        </span>
      </div>
    </div>
  )
}
