'use client'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'

// 닉네임 기반 색상 팔레트 (배경색, 텍스트색)
const AVATAR_COLORS = [
  { bg: 'bg-gradient-to-br from-orange-100 to-amber-100', text: 'text-orange-700' },
  { bg: 'bg-gradient-to-br from-blue-100 to-sky-100', text: 'text-blue-700' },
  { bg: 'bg-gradient-to-br from-green-100 to-emerald-100', text: 'text-green-700' },
  { bg: 'bg-gradient-to-br from-purple-100 to-violet-100', text: 'text-purple-700' },
  { bg: 'bg-gradient-to-br from-pink-100 to-rose-100', text: 'text-pink-700' },
  { bg: 'bg-gradient-to-br from-teal-100 to-cyan-100', text: 'text-teal-700' },
  { bg: 'bg-gradient-to-br from-indigo-100 to-blue-100', text: 'text-indigo-700' },
  { bg: 'bg-gradient-to-br from-amber-100 to-yellow-100', text: 'text-amber-700' },
] as const

/**
 * 닉네임 문자열의 해시값을 계산하여 색상 인덱스 반환
 */
function getColorIndex(nickname: string): number {
  let hash = 0
  for (let i = 0; i < nickname.length; i++) {
    hash = nickname.charCodeAt(i) + ((hash << 5) - hash)
  }
  return Math.abs(hash) % AVATAR_COLORS.length
}

/**
 * 닉네임에서 표시할 이니셜 추출 (첫 글자 또는 첫 2글자)
 */
function getInitial(nickname: string, maxLength: 1 | 2 = 1): string {
  if (!nickname) return '?'
  return nickname.slice(0, maxLength)
}

type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

const sizeClasses: Record<AvatarSize, { avatar: string; text: string }> = {
  xs: { avatar: 'h-6 w-6', text: 'text-xs' },
  sm: { avatar: 'h-8 w-8', text: 'text-sm' },
  md: { avatar: 'h-10 w-10', text: 'text-base' },
  lg: { avatar: 'h-16 w-16 sm:h-20 sm:w-20', text: 'text-xl sm:text-2xl' },
  xl: { avatar: 'h-20 w-20 sm:h-32 sm:w-32', text: 'text-xl sm:text-3xl' },
}

interface UserAvatarProps {
  nickname: string
  size?: AvatarSize
  className?: string
  /** 이니셜 글자 수 (1 또는 2) */
  initialLength?: 1 | 2
  /** Avatar 컴포넌트에 전달할 추가 className */
  avatarClassName?: string
}

/**
 * 사용자 아바타 컴포넌트
 * - 닉네임의 첫 글자를 이니셜로 표시
 * - 닉네임 기반으로 일관된 색상 적용
 */
export function UserAvatar({
  nickname,
  size = 'sm',
  className,
  initialLength = 1,
  avatarClassName,
}: UserAvatarProps) {
  const colorIndex = getColorIndex(nickname)
  const color = AVATAR_COLORS[colorIndex]
  const initial = getInitial(nickname, initialLength)
  const sizeClass = sizeClasses[size]

  return (
    <Avatar className={cn(sizeClass.avatar, 'rounded-full', avatarClassName)}>
      <AvatarFallback
        className={cn(
          'rounded-full font-bold',
          color.bg,
          color.text,
          sizeClass.text,
          className
        )}
      >
        {initial}
      </AvatarFallback>
    </Avatar>
  )
}
