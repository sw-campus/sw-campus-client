'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

import { useAuthStore } from '@/store/authStore'

interface UserProfileLinkProps {
  userId: number
  children: React.ReactNode
  className?: string
  onClick?: (e: React.MouseEvent) => void
}

/**
 * 사용자 프로필 링크 컴포넌트
 * - 로그인 사용자: 사용자 프로필 페이지로 이동
 * - 비로그인 사용자: 토스트로 로그인 필요 안내
 */
export function UserProfileLink({ userId, children, className, onClick }: UserProfileLinkProps) {
  const router = useRouter()
  const { isLoggedIn } = useAuthStore()

  const handleClick = (e: React.MouseEvent) => {
    onClick?.(e)

    if (!isLoggedIn) {
      e.preventDefault()
      toast.info('로그인이 필요합니다', {
        description: '다른 사용자의 프로필을 보려면 먼저 로그인해주세요.',
        action: {
          label: '로그인',
          onClick: () => router.push(`/login?returnUrl=/community/user/${userId}`),
        },
      })
      return
    }
  }

  return (
    <Link
      href={`/community/user/${userId}`}
      onClick={handleClick}
      className={className}
    >
      {children}
    </Link>
  )
}
