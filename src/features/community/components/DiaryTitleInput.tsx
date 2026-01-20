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
        제목 * <span className="text-muted-foreground text-xs font-normal">(자동 생성됨)</span>
      </label>
      <div className="space-y-4">
        {/* 월/주차 선택 */}
        <div className="flex flex-wrap items-center gap-3">
          <Select value={String(month)} onValueChange={value => onMonthChange(Number(value))}>
            <SelectTrigger className="bg-background w-24">
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
            <SelectTrigger className="bg-background w-24">
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
          <span className="text-muted-foreground font-medium">성장일기 -</span>
        </div>

        {/* 한 줄 소감 */}
        <div className="relative">
          <Input
            id="diary-summary-input"
            type="text"
            value={summary}
            onChange={e => onSummaryChange(e.target.value)}
            placeholder="한 줄 소감을 입력하세요 (예: JWT 인증 구현 완료!)"
            className={error ? 'border-destructive focus-visible:ring-destructive' : ''}
            maxLength={50}
          />
          <div className="mt-1.5 flex items-center justify-between">
            {error ? (
              <p className="text-destructive text-sm font-medium">{error}</p>
            ) : (
              <p className="text-muted-foreground text-xs">5자 이상 입력해주세요</p>
            )}
            <span className={`text-xs font-medium ${summary.length >= 5 ? 'text-green-600' : 'text-red-500'}`}>
              {summary.length}/50
            </span>
          </div>
        </div>

        {/* 미리보기 */}
        <div className="bg-muted/50 rounded-lg border px-4 py-3 text-sm">
          <span className="text-muted-foreground mr-2 font-medium">제목 미리보기:</span>
          <span className="text-foreground font-bold">{summary || '(한 줄 소감)'}</span>
          <span className="text-muted-foreground ml-3 text-xs">
            ({month}월 {week}주차 정보는 게시글 목록에 표시됩니다)
          </span>
        </div>
      </div>
    </div>
  )
}

/**
 * 제목 문자열 생성 헬퍼
 * 한 줄 소감만 제목으로 사용 (주차 정보는 태그로 저장)
 */
export function buildDiaryTitle(_month: number, _week: number, summary: string): string {
  return summary.trim()
}

/**
 * 주차 정보 태그 생성 헬퍼
 */
export function buildWeekTag(month: number, week: number): string {
  return `${month}월 ${week}주차`
}
