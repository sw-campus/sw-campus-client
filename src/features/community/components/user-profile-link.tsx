import Link from 'next/link'

interface UserProfileLinkProps {
  userId: number
  children: React.ReactNode
  className?: string
  onClick?: (e: React.MouseEvent) => void
}

/**
 * 사용자 프로필 링크 컴포넌트
 * - 로그인 여부와 관계없이 프로필 페이지로 이동 가능
 */
export function UserProfileLink({ userId, children, className, onClick }: UserProfileLinkProps) {
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
