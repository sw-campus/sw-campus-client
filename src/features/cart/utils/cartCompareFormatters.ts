export function formatDateRange(start: string | null | undefined, end: string | null | undefined) {
  if (!start && !end) return '-'
  return `${start ?? '-'} ~ ${end ?? '-'}`
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
