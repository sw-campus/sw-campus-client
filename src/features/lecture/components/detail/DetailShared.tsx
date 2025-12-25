import { type ReactNode } from 'react'

import { Star } from 'lucide-react'

import { Badge } from '@/components/ui/badge'

/**
 * ISO 날짜 문자열을 YYYY.MM.DD 형식으로 변환합니다.
 * 시간 부분(T 이후)은 제거됩니다.
 */
export function formatDate(dateStr: string) {
  if (!dateStr) return ''
  return dateStr.split('T')[0].replaceAll('-', '.')
}

export function formatDateDot(iso: string) {
  return iso.replaceAll('-', '.')
}

export function formatKRW(n?: number) {
  if (typeof n !== 'number') return '-'
  return new Intl.NumberFormat('ko-KR').format(n)
}

/**
 * 별점을 표시하는 컴포넌트입니다.
 * @param score - 0~5 사이의 점수
 * @param size - 별 크기 ('sm' | 'md')
 * @param showScore - 점수 텍스트 표시 여부
 */
export function StarRating({
  score,
  size = 'md',
  showScore = false,
}: {
  score: number
  size?: 'sm' | 'md'
  showScore?: boolean
}) {
  const fullStars = Math.floor(score)
  const hasHalf = score - fullStars >= 0.5
  const starSize = size === 'sm' ? 'h-3 w-3' : 'h-4 w-4'
  const gap = size === 'sm' ? 'gap-0.5' : 'gap-1'

  return (
    <div className={`flex items-center ${gap}`}>
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`${starSize} ${
            i < fullStars
              ? 'fill-yellow-400 text-yellow-400'
              : i === fullStars && hasHalf
                ? 'fill-yellow-400/50 text-yellow-400'
                : 'text-gray-300'
          }`}
        />
      ))}
      {showScore && <span className="ml-1 text-sm font-medium text-gray-700">{score.toFixed(1)}</span>}
    </div>
  )
}

export function Section({ title, children, action }: { title: string; children: ReactNode; action?: ReactNode }) {
  return (
    <div className="space-y-4 pt-2">
      <div className="flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-lg font-bold text-gray-900">
          <span className="block h-4 w-1 rounded-full bg-orange-400" />
          {title}
        </h3>
        {action ? <div className="pl-3">{action}</div> : null}
      </div>
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
      <span className="w-24 shrink-0 text-xs font-medium whitespace-nowrap text-gray-800">{label}</span>
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
    <span className="inline-flex h-9 items-center rounded-lg border border-gray-400 bg-white px-3 py-1.5 align-middle text-base font-bold text-gray-900 shadow-sm">
      {children}
    </span>
  )
}
