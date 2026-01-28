'use client'

import { useEffect, useState } from 'react'

import { LuArrowDown, LuArrowUp, LuMinus } from 'react-icons/lu'
import { Area, AreaChart, ResponsiveContainer } from 'recharts'

import { cn } from '@/lib/utils'

interface StatCardProps {
  title: string
  value: number
  icon?: React.ElementType
  subtext?: string
  customFormatter?: (value: number) => string
  trend?: {
    value: number
    isPositive: boolean
  }
  sparklineData?: number[]
  accentColor?: 'lime' | 'cyan' | 'magenta' | 'amber'
  size?: 'default' | 'large'
}

const accentColors = {
  lime: {
    gradient: 'from-lime-500/20 to-emerald-500/10',
    text: 'text-lime-600',
    bg: 'bg-lime-500/10',
    border: 'border-lime-500/20',
    chart: '#84cc16',
    glow: 'shadow-lime-500/20',
  },
  cyan: {
    gradient: 'from-cyan-500/20 to-blue-500/10',
    text: 'text-cyan-600',
    bg: 'bg-cyan-500/10',
    border: 'border-cyan-500/20',
    chart: '#06b6d4',
    glow: 'shadow-cyan-500/20',
  },
  magenta: {
    gradient: 'from-pink-500/20 to-rose-500/10',
    text: 'text-pink-600',
    bg: 'bg-pink-500/10',
    border: 'border-pink-500/20',
    chart: '#ec4899',
    glow: 'shadow-pink-500/20',
  },
  amber: {
    gradient: 'from-amber-500/20 to-orange-500/10',
    text: 'text-amber-600',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/20',
    chart: '#f59e0b',
    glow: 'shadow-amber-500/20',
  },
}

export function StatCard({
  title,
  value,
  icon: Icon,
  subtext,
  customFormatter,
  trend,
  sparklineData,
  accentColor = 'lime',
  size = 'default',
}: StatCardProps) {
  const [displayValue, setDisplayValue] = useState(0)
  const [isAnimating, setIsAnimating] = useState(true)
  const colors = accentColors[accentColor]

  // Animated counter effect with easing
  useEffect(() => {
    if (value === 0) {
      return
    }

    let isActive = true
    const duration = 1200
    const startTime = performance.now()
    const startValue = 0

    // easeOutExpo for smooth deceleration
    const easeOutExpo = (t: number): number => {
      return t === 1 ? 1 : 1 - Math.pow(2, -10 * t)
    }

    const animate = (currentTime: number) => {
      if (!isActive) return

      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      const easedProgress = easeOutExpo(progress)
      const current = Math.round(startValue + (value - startValue) * easedProgress)

      setDisplayValue(current)
      setIsAnimating(progress < 1)

      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }

    const animationId = requestAnimationFrame(animate)
    return () => {
      isActive = false
      cancelAnimationFrame(animationId)
    }
  }, [value])

  // value가 0일 때 displayValue와 isAnimating 동기화
  const effectiveDisplayValue = value === 0 ? 0 : displayValue
  const effectiveIsAnimating = value === 0 ? false : isAnimating

  // Generate sparkline data if not provided
  const chartData = sparklineData?.map((v, i) => ({ value: v, index: i })) || []

  const TrendIcon = trend?.isPositive ? LuArrowUp : trend?.value === 0 ? LuMinus : LuArrowDown

  return (
    <div
      className={cn(
        'bento-card group relative overflow-hidden p-4 sm:p-5',
        size === 'large' && 'sm:p-6',
        `hover:${colors.glow}`,
      )}
    >
      {/* Background gradient accent */}
      <div
        className={cn(
          'absolute inset-0 bg-linear-to-br opacity-0 transition-opacity duration-500 group-hover:opacity-100',
          colors.gradient,
        )}
      />

      {/* Grid pattern overlay */}
      <div className="grid-pattern absolute inset-0 opacity-30" />

      {/* Content */}
      <div className="relative z-10 flex h-full flex-col">
        {/* Header */}
        <div className="mb-3 flex items-start justify-between">
          <div className="flex items-center gap-2">
            {Icon && (
              <div className={cn('rounded-lg p-2 transition-colors', colors.bg, 'group-hover:' + colors.bg)}>
                <Icon className={cn('h-4 w-4 sm:h-5 sm:w-5', colors.text)} />
              </div>
            )}
            <span className="text-muted-foreground text-xs font-medium tracking-wide uppercase sm:text-sm">
              {title}
            </span>
          </div>

          {/* Trend indicator */}
          {trend && (
            <div
              className={cn(
                'flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold',
                trend.isPositive
                  ? 'bg-emerald-100 text-emerald-700'
                  : trend.value === 0
                    ? 'bg-gray-100 text-gray-600'
                    : 'bg-rose-100 text-rose-700',
              )}
            >
              <TrendIcon
                className={cn(
                  'h-3 w-3',
                  trend.isPositive && 'animate-trend-up',
                  !trend.isPositive && trend.value !== 0 && 'animate-trend-down',
                )}
              />
              <span>{Math.abs(trend.value)}%</span>
            </div>
          )}
        </div>

        {/* Value */}
        <div className="flex flex-1 items-end justify-between">
          <div className="flex flex-col">
            <span
              className={cn(
                'font-mono-data text-foreground text-3xl font-bold tracking-tight sm:text-4xl',
                size === 'large' && 'text-4xl sm:text-5xl',
                effectiveIsAnimating && 'animate-count',
              )}
            >
              {customFormatter ? customFormatter(effectiveDisplayValue) : effectiveDisplayValue.toLocaleString()}
            </span>
            {subtext && <span className={cn('mt-1 text-xs font-medium', colors.text)}>{subtext}</span>}
          </div>

          {/* Sparkline */}
          {chartData.length > 0 && (
            <div className="h-12 w-20 opacity-60 transition-opacity group-hover:opacity-100 sm:w-24">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id={`sparkGrad-${accentColor}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={colors.chart} stopOpacity={0.4} />
                      <stop offset="100%" stopColor={colors.chart} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke={colors.chart}
                    strokeWidth={2}
                    fill={`url(#sparkGrad-${accentColor})`}
                    dot={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>

      {/* Live indicator pulse */}
      <div className={cn('absolute top-3 right-3 h-2 w-2 rounded-full', colors.bg)}>
        <div className={cn('absolute inset-0 animate-ping rounded-full', colors.bg)} />
      </div>
    </div>
  )
}
