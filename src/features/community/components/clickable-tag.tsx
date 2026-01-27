'use client'

import { useRouter } from 'next/navigation'
import { MouseEvent } from 'react'

interface ClickableTagProps {
  tag: string
  /** 태그 텍스트 최대 길이 (초과 시 ... 표시) */
  maxLength?: number
  /** 추가 CSS 클래스 */
  className?: string
  /** 버튼 스타일 (기본: chip 스타일) */
  variant?: 'link' | 'chip'
}

/**
 * 클릭 가능한 태그 컴포넌트
 * 클릭 시 해당 태그로 필터링된 게시글 목록으로 이동
 */
export function ClickableTag({
  tag,
  maxLength = 20,
  className = '',
  variant = 'chip'
}: ClickableTagProps) {
  const router = useRouter()

  const displayText = maxLength && tag.length > maxLength
    ? tag.slice(0, maxLength) + '...'
    : tag

  const handleClick = (e: MouseEvent) => {
    e.stopPropagation() // 부모 Link 클릭 방지
    e.preventDefault()
    router.push(`/community?tags=${encodeURIComponent(tag)}`)
  }

  const baseStyles = variant === 'chip'
    ? 'inline-flex shrink-0 cursor-pointer items-center gap-1 rounded-full bg-gradient-to-r from-gray-50 to-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600 ring-1 ring-gray-200/60 transition-all duration-200 hover:from-primary/5 hover:to-primary/10 hover:text-primary hover:ring-primary/30 hover:shadow-sm active:scale-95'
    : 'shrink-0 cursor-pointer text-xs font-medium text-gray-500 transition-all duration-200 hover:text-primary'

  return (
    <span
      onClick={handleClick}
      className={`${baseStyles} ${className}`}
      title={tag}
    >
      <span className={variant === 'chip' ? 'text-gray-400 transition-colors group-hover:text-primary' : ''}>#</span>
      {displayText}
    </span>
  )
}
