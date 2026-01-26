'use client'

import Link from 'next/link'
import { toast } from 'sonner'

interface UserProfileLinkProps {
  userId: number | null
  children: React.ReactNode
  className?: string
  onClick?: (e: React.MouseEvent) => void
}

/**
 * 사용자 프로필 링크 컴포넌트
 * - 로그인 여부와 관계없이 프로필 페이지로 이동 가능
 * - 탈퇴한 회원(userId가 null)인 경우 클릭 시 알림 표시
 */
export function UserProfileLink({ userId, children, className, onClick }: UserProfileLinkProps) {
  // 탈퇴한 회원인 경우
  if (userId === null) {
    return (
      <span
        className={className}
        style={{ cursor: 'default' }}
        onClick={(e) => {
          e.preventDefault()
          toast.info('탈퇴한 회원입니다.')
          onClick?.(e)
        }}
      >
        {children}
      </span>
    )
  }

  return (
    <Link
      href={`/community/user/${userId}`}
      onClick={onClick}
      className={className}
    >
      {children}
    </Link>
  )
}
