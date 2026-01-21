/**
 * 날짜를 상대 시간으로 포맷팅합니다.
 * 예: "방금 전", "3시간 전", "어제", "3일 전", "1월 15일"
 */
export function formatRelativeTime(date: Date): string {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffSeconds = Math.floor(diffMs / 1000)
  const diffMinutes = Math.floor(diffSeconds / 60)
  const diffHours = Math.floor(diffMinutes / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffSeconds < 60) {
    return '방금 전'
  }

  if (diffMinutes < 60) {
    return `${diffMinutes}분 전`
  }

  if (diffHours < 24) {
    return `${diffHours}시간 전`
  }

  if (diffDays === 1) {
    return '어제'
  }

  if (diffDays < 7) {
    return `${diffDays}일 전`
  }

  // 7일 이상이면 날짜로 표시
  const isSameYear = date.getFullYear() === now.getFullYear()
  
  if (isSameYear) {
    return new Intl.DateTimeFormat('ko-KR', {
      month: 'long',
      day: 'numeric',
    }).format(date)
  }

  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date)
}
