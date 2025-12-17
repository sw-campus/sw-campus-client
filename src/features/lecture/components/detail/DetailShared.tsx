import { type ReactNode } from 'react'

import { Badge } from '@/components/ui/badge'

export function formatDateDot(iso: string) {
  return iso.replaceAll('-', '.')
}

export function formatKRW(n?: number) {
  if (typeof n !== 'number') return '-'
  return new Intl.NumberFormat('ko-KR').format(n)
}

export function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="space-y-4 pt-2">
      <h3 className="flex items-center gap-2 text-lg font-bold text-gray-900">
        <span className="block h-4 w-1 rounded-full bg-orange-400" />
        {title}
      </h3>
      <div className="pl-3">{children}</div>
    </div>
  )
}

export function InfoBox({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-gray-50/50 p-6">
      <div className="space-y-3">{children}</div>
    </div>
  )
}

export function InfoRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex items-start gap-6">
      <span className="w-14 shrink-0 text-xs font-medium text-gray-500">{label}</span>
      <span className="text-sm text-gray-900">{children}</span>
    </div>
  )
}

export function SideInfoRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <span className="text-muted-foreground shrink-0 text-xs">{label}</span>
      <span className="text-right text-sm">{children}</span>
    </div>
  )
}

export function RequirementItem({
  children,
  type = 'REQUIRED',
}: {
  children: ReactNode
  type?: 'REQUIRED' | 'PREFERRED' | string
}) {
  const isRequired = type === 'REQUIRED'
  return (
    <div className="flex items-center gap-3 rounded-xl bg-white/60 px-4 py-3 backdrop-blur transition-colors hover:bg-white/80">
      <Badge
        className={`shrink-0 rounded-md border px-2.5 py-1 text-xs font-bold shadow-sm ${
          isRequired
            ? 'border-red-200 bg-red-50 text-red-600 hover:bg-red-100'
            : 'border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100'
        }`}
        variant="outline"
      >
        {isRequired ? '필수' : '우대'}
      </Badge>
      <span className="text-sm font-medium text-gray-900">{children}</span>
    </div>
  )
}

export function InlineBadge({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex h-9 items-center rounded-lg border border-gray-200 bg-white px-3 py-1.5 align-middle text-base font-bold text-gray-900 shadow-sm">
      {children}
    </span>
  )
}
