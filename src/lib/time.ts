export function getHoursFromTimeRange(time: string | null | undefined): number | null {
  if (!time) return null
  const raw = time.replace(/\s/g, '')

  // examples: 09:00~18:00, 9:00-18:30
  const match = raw.match(/(\d{1,2}):(\d{2})[~\-](\d{1,2}):(\d{2})/)
  if (!match) return null

  const sh = Number(match[1])
  const sm = Number(match[2])
  const eh = Number(match[3])
  const em = Number(match[4])

  if ([sh, sm, eh, em].some(n => !Number.isFinite(n))) return null
  if (sh < 0 || sh > 23 || eh < 0 || eh > 23 || sm < 0 || sm > 59 || em < 0 || em > 59) return null

  const startMinutes = sh * 60 + sm
  let endMinutes = eh * 60 + em
  if (endMinutes < startMinutes) endMinutes += 24 * 60

  const diff = endMinutes - startMinutes
  if (diff <= 0) return null
  return diff / 60
}

export function getNetTrainingHoursKorea(hours: number): number {
  if (!Number.isFinite(hours) || hours <= 0) return 0
  // Policy: 30 minutes break per 4 hours
  const breaks = Math.floor(hours / 4) * 0.5
  return Math.max(0, hours - breaks)
}

export function getNetTrainingHoursFromTimeRange(time: string | null | undefined): number | null {
  const hours = getHoursFromTimeRange(time)
  if (!hours) return null
  return getNetTrainingHoursKorea(hours)
}
