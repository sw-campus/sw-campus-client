import { getNetTrainingHoursFromTimeRange } from '@/lib/time'

export function formatDateRange(start: string | null | undefined, end: string | null | undefined) {
  if (!start && !end) return '-'
  return `${start ?? '-'} ~ ${end ?? '-'}`
}

function formatHours(value: number) {
  if (Number.isInteger(value)) return String(value)
  return value.toFixed(1).replace(/\.0$/, '')
}

export function formatDateRangeWithTotalDays(
  start: string | null | undefined,
  end: string | null | undefined,
  totalDays: number | null | undefined,
) {
  const base = formatDateRange(start, end)
  if (!totalDays) return base
  return `${base} (총 ${totalDays}일)`
}

export function formatCourseTime(
  days: string | null | undefined,
  time: string | null | undefined,
  totalHours: number | null | undefined,
  totalDays: number | null | undefined,
) {
  const parts = [days, time].filter(Boolean) as string[]
  const base = parts.length ? parts.join(' ') : '-'

  const perDayFromTime = getNetTrainingHoursFromTimeRange(time)
  if (perDayFromTime) return `${base} (하루 ${formatHours(perDayFromTime)}시간)`

  if (!totalHours || !totalDays) return base
  if (totalDays <= 0) return base
  const perDayFromTotals = totalHours / totalDays
  if (!Number.isFinite(perDayFromTotals) || perDayFromTotals <= 0) return base
  return `${base} (하루 ${formatHours(perDayFromTotals)}시간)`
}

export function formatMoney(value: number | null | undefined) {
  if (value === null || value === undefined) return '-'
  return `${value.toLocaleString()}원`
}

export function formatText(value: string | null | undefined) {
  if (!value) return '-'
  return value
}

export function formatBoolean(value: boolean | null | undefined) {
  if (value === null || value === undefined) return '-'
  return value ? '있음' : '없음'
}

export function formatList(values: Array<string | null | undefined> | null | undefined) {
  const list = (values ?? []).filter(Boolean) as string[]
  return list.length ? list.join(', ') : '-'
}

export function formatRecruitType(value: string | null | undefined) {
  if (!value) return '-'
  if (value === 'CARD_REQUIRED') return '내일배움카드 필요'
  if (value === 'GENERAL') return '내일배움카드 불필요'
  if (value === 'KDT') return 'KDT(우수형)'
  return value
}

export function formatLectureLoc(value: string | null | undefined) {
  if (!value) return '-'
  if (value === 'ONLINE') return '온라인'
  if (value === 'OFFLINE') return '오프라인'
  if (value === 'MIXED' || value === 'HYBRID') return '온/오프라인 병행'
  return value
}

export function formatStatus(value: string | null | undefined) {
  if (!value) return '-'
  if (value === 'OPEN') return '모집중'
  if (value === 'CLOSED') return '마감'
  if (value === 'DRAFT') return '임시저장'
  return value
}
