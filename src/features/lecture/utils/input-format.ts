export const toDigitsOnly = (value: string) => value.replace(/\D/g, '')

export const toLocalDateString = (date: Date) => {
  const yyyy = date.getFullYear()
  const mm = String(date.getMonth() + 1).padStart(2, '0')
  const dd = String(date.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

export const toLocalTimeString = (hhmm: string) => {
  const safe = hhmm.trim()
  return safe.length === 5 ? `${safe}:00` : safe
}

export const toWonString = (manWon: number) => String(manWon * 10000)
