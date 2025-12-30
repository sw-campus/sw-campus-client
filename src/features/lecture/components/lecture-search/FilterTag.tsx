import { ReactNode } from 'react'

import { cn } from '@/lib/utils'

export function FilterTag({
  label,
  active = false,
  onClick,
  suffixIcon,
}: {
  label: string
  active?: boolean
  onClick?: () => void
  suffixIcon?: ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'focus-visible:ring-primary flex items-center gap-1 rounded-full border px-3 py-1 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
        active
          ? 'border-primary bg-primary focus-visible:ring-offset-primary/20 text-white'
          : 'border-gray-200 bg-white text-gray-700',
      )}
    >
      <span className="break-keep">{label}</span>
      {suffixIcon && <span className="flex items-center">{suffixIcon}</span>}
    </button>
  )
}
