/**
 * 날짜 문자열을 한국 날짜 형식(YYYY. MM. DD.)으로 변환합니다.
 * @param dateString - 날짜 문자열 (ISO 8601 등) 혹은 Date 객체
 * @returns 변환된 날짜 문자열 (입력이 유효하지 않으면 '-' 반환)
 */
export function formatDate(dateString: string | Date | null | undefined): string {
  if (!dateString) return '-'

  try {
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString
    if (isNaN(date.getTime())) return '-'

    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    })
  } catch {
    return '-'
  }
}

/**
 * 시간 문자열을 한국/12시간 형식(오전/오후 HH:MM)으로 변환합니다.
 * @param timeString - 시간 문자열 (HH:mm:ss 등)
 * @returns 변환된 시간 문자열
 */
export function formatTime(timeString: string | null | undefined): string {
  if (!timeString) return '-'

  try {
    // "14:30:00" 같은 문자열을 처리하기 위해 임의의 날짜에 시간 설정
    const [hours, minutes] = timeString.split(':')
    const date = new Date()
    date.setHours(Number(hours))
    date.setMinutes(Number(minutes))

    if (isNaN(date.getTime())) return timeString

    return date.toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    })
  } catch {
    return timeString
  }
}

/**
 * 시간 범위를 포맷팅합니다.
 * 두 시간이 모두 유효할 때만 '~'로 연결하고, 하나만 있으면 해당 시간만 표시합니다.
 * @param startTime - 시작 시간 문자열
 * @param endTime - 종료 시간 문자열
 * @returns 포맷팅된 시간 범위 문자열
 */
export function formatTimeRange(startTime: string | null | undefined, endTime: string | null | undefined): string {
  const formattedStart = startTime ? formatTime(startTime) : null
  const formattedEnd = endTime ? formatTime(endTime) : null

  // 둘 다 없는 경우
  if (!startTime && !endTime) return '-'

  // 둘 다 있는 경우
  if (startTime && endTime) {
    return `${formattedStart} ~ ${formattedEnd}`
  }

  // 하나만 있는 경우
  if (startTime) return `${formattedStart} ~`
  return `~ ${formattedEnd}`
}
