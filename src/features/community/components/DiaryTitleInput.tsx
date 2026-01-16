'use client'

interface DiaryTitleInputProps {
  month: number
  week: number
  summary: string
  onMonthChange: (month: number) => void
  onWeekChange: (week: number) => void
  onSummaryChange: (summary: string) => void
  error?: string | null
}

/**
 * 부트캠프 성장일기 제목 입력 컴포넌트
 * 월/주차 선택 + 한 줄 소감으로 제목을 구성합니다.
 */
export function DiaryTitleInput({
  month,
  week,
  summary,
  onMonthChange,
  onWeekChange,
  onSummaryChange,
  error,
}: DiaryTitleInputProps) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-gray-700">
        제목 * <span className="text-xs font-normal text-gray-500">(자동 생성됨)</span>
      </label>
      <div className="space-y-3">
        {/* 월/주차 선택 */}
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={month}
            onChange={e => onMonthChange(Number(e.target.value))}
            className="rounded-lg border border-gray-300 px-3 py-2.5 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 focus:outline-none"
          >
            {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
              <option key={m} value={m}>
                {m}월
              </option>
            ))}
          </select>
          <select
            value={week}
            onChange={e => onWeekChange(Number(e.target.value))}
            className="rounded-lg border border-gray-300 px-3 py-2.5 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 focus:outline-none"
          >
            {Array.from({ length: 5 }, (_, i) => i + 1).map(w => (
              <option key={w} value={w}>
                {w}주차
              </option>
            ))}
          </select>
          <span className="text-gray-500">성장일기 -</span>
        </div>

        {/* 한 줄 소감 */}
        <input
          type="text"
          value={summary}
          onChange={e => onSummaryChange(e.target.value)}
          placeholder="한 줄 소감을 입력하세요 (예: JWT 인증 구현 완료!)"
          className={`w-full rounded-lg border px-4 py-2.5 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 focus:outline-none ${
            error ? 'border-red-500' : 'border-gray-300'
          }`}
          maxLength={50}
        />
        {error && <p className="text-sm text-red-500">{error}</p>}

        {/* 미리보기 */}
        <div className="rounded-lg bg-gray-50 px-4 py-2.5 text-sm text-gray-600">
          <span className="font-medium">제목 미리보기: </span>
          <span className="text-gray-900">
            {month}월 {week}주차 성장일기 - {summary || '(한 줄 소감)'}
          </span>
        </div>
      </div>
    </div>
  )
}

/**
 * 제목 문자열 생성 헬퍼
 */
export function buildDiaryTitle(month: number, week: number, summary: string): string {
  return `${month}월 ${week}주차 성장일기 - ${summary.trim()}`
}
