/**
 * D-day 계산 (마감일까지 남은 일수)
 */
export function calculateDday(deadlineString: string): { text: string; isClosed: boolean } {
  const deadline = new Date(deadlineString)
  const today = new Date()

  // 시간 제거하고 날짜만 비교
  deadline.setHours(0, 0, 0, 0)
  today.setHours(0, 0, 0, 0)

  const diffTime = deadline.getTime() - today.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays < 0) {
    return { text: '마감', isClosed: true }
  } else if (diffDays === 0) {
    return { text: 'D-Day', isClosed: false }
  } else {
    return { text: `D-${diffDays}`, isClosed: false }
  }
}

/**
 * 날짜 포맷팅 (MM/DD 형식)
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  const month = date.getMonth() + 1
  const day = date.getDate()
  return `${month}/${day}`
}

/**
 * 모집 유형에 따른 태그 텍스트
 */
export function getRecruitTag(recruitType: string): string {
  switch (recruitType) {
    case 'CARD_REQUIRED':
      return '내배카 필요 O'
    case 'GENERAL':
      return '내배카 필요 X'
    default:
      return ''
  }
}
