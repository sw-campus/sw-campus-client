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
        'flex items-center gap-1 rounded-full border px-3 py-1 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary',
        active
          ? 'border-primary bg-primary text-white focus-visible:ring-offset-primary/20'
          : 'border-gray-200 bg-white text-gray-700',
      )}
    >
      <span>{label}</span>
      {suffixIcon && <span className="flex items-center">{suffixIcon}</span>}
    </button>
  )
}
