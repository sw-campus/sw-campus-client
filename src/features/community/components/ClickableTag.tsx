'use client'

import { useRouter } from 'next/navigation'
import { MouseEvent } from 'react'

interface ClickableTagProps {
  tag: string
  /** 태그 텍스트 최대 길이 (초과 시 ... 표시) */
  maxLength?: number
  /** 추가 CSS 클래스 */
  className?: string
  /** 버튼 스타일 (기본: 링크 스타일) */
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
  variant = 'link'
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
    ? 'cursor-pointer rounded-full bg-gray-100 px-2.5 py-0.5 text-xs text-gray-600 transition-colors hover:bg-orange-100 hover:text-orange-600'
    : 'cursor-pointer text-xs text-gray-500 transition-colors hover:text-orange-600'

  return (
    <span
      onClick={handleClick}
      className={`${baseStyles} ${className}`}
    >
      #{displayText}
    </span>
  )
}

