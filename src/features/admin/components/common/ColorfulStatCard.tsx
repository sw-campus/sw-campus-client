'use client'

import type { IconType } from 'react-icons'

import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

export interface ColorfulStatCardProps {
  title: string
  value: number
  icon: IconType
  bgColor: string
}

/**
 * 그라데이션 배경의 컬러풀한 통계 카드
 */
export function ColorfulStatCard({ title, value, icon: Icon, bgColor }: ColorfulStatCardProps) {
  return (
    <Card className={cn('border-0 text-white shadow-lg', bgColor)}>
      <CardContent className="flex items-center gap-4 p-4">
        <div className="rounded-xl bg-white/20 p-3">
          <Icon className="h-6 w-6" />
        </div>
        <div>
          <p className="text-sm font-medium text-white/80">{title}</p>
          <p className="text-2xl font-bold">{value.toLocaleString()}</p>
        </div>
      </CardContent>
    </Card>
  )
}

/**
 * 승인 관련 페이지용 색상 설정
 */
export const APPROVAL_STAT_COLORS = {
  total: 'bg-gradient-to-br from-slate-500 to-slate-600',
  pending: 'bg-gradient-to-br from-amber-500 to-amber-600',
  approved: 'bg-gradient-to-br from-emerald-500 to-emerald-600',
  rejected: 'bg-gradient-to-br from-rose-500 to-rose-600',
}

/**
 * 배너 관련 페이지용 색상 설정
 */
export const BANNER_STAT_COLORS = {
  total: 'bg-gradient-to-br from-slate-500 to-slate-600',
  scheduled: 'bg-gradient-to-br from-amber-500 to-amber-600',
  active: 'bg-gradient-to-br from-emerald-500 to-emerald-600',
  ended: 'bg-gradient-to-br from-gray-400 to-gray-500',
}
