'use client'

export type Period = 7 | 30

type PeriodToggleProps = {
  period: Period
  onPeriodChange: (period: Period) => void
}

/**
 * 7일/30일 기간 선택 토글 컴포넌트
 * 어드민 대시보드의 여러 섹션에서 재사용됩니다.
 */
export function PeriodToggle({ period, onPeriodChange }: PeriodToggleProps) {
  return (
    <div className="flex rounded-lg bg-gray-100 p-1">
      <button
        onClick={() => onPeriodChange(7)}
        className={`rounded-md px-3 py-1 text-sm font-medium transition-colors ${
          period === 7 ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
        }`}
      >
        7일
      </button>
      <button
        onClick={() => onPeriodChange(30)}
        className={`rounded-md px-3 py-1 text-sm font-medium transition-colors ${
          period === 30 ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
        }`}
      >
        30일
      </button>
    </div>
  )
}
