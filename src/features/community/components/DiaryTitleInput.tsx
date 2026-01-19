'use client'

import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

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
          <Select value={String(month)} onValueChange={value => onMonthChange(Number(value))}>
            <SelectTrigger className="w-24 border-gray-300 bg-white hover:border-orange-300 focus:border-orange-500 focus:ring-orange-200">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                <SelectItem key={m} value={String(m)}>
                  {m}월
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={String(week)} onValueChange={value => onWeekChange(Number(value))}>
            <SelectTrigger className="w-24 border-gray-300 bg-white hover:border-orange-300 focus:border-orange-500 focus:ring-orange-200">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 5 }, (_, i) => i + 1).map(w => (
                <SelectItem key={w} value={String(w)}>
                  {w}주차
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span className="text-gray-500">성장일기 -</span>
        </div>

        {/* 한 줄 소감 */}
        <Input
          id="diary-summary-input"
          type="text"
          value={summary}
          onChange={e => onSummaryChange(e.target.value)}
          placeholder="한 줄 소감을 입력하세요 (예: JWT 인증 구현 완료!)"
          className={`border-gray-300 focus:border-orange-500 focus:ring-orange-200 ${error ? 'border-red-500' : ''}`}
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
