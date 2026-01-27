'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Bot, Menu, User } from 'lucide-react'

import type { UserType } from '@/store/auth-store'

interface MobileHeaderProps {
  isLoggedIn: boolean
  nickname: string | null
  userType: UserType
  hasHydrated: boolean
  mypageHref: string
  onOpenNav: () => void
}

export function MobileHeader({
  isLoggedIn,
  nickname,
  userType,
  hasHydrated,
  mypageHref,
  onOpenNav,
}: MobileHeaderProps) {
  return (
    <header className="absolute left-0 top-0 z-50 flex w-full items-center justify-between px-4 py-3 md:hidden">
      {/* 좌측: 햄버거 + 로고 */}
      <div className="flex items-center gap-3">
        <button type="button" className="text-header-text" onClick={onOpenNav} aria-label="메뉴 열기">
          <Menu size={32} />
        </button>
        <Link href={userType === 'ADMIN' ? '/admin' : '/'}>
          <Image
            src="/images/logo.png"
            alt="SOFTWARE CAMPUS 로고"
            width={40}
            height={40}
            className="size-10 object-contain brightness-0 invert"
            priority
          />
        </Link>
      </div>

      {/* 우측: 사용자 정보 + 아이콘들 */}
      <div className="flex items-center gap-3 text-header-text">
        {!hasHydrated ? (
          <div className="h-5 w-20" />
        ) : isLoggedIn ? (
          <>
            <span className="text-sm">
              {nickname} <span className="font-bold">님</span>
            </span>
            <Link href={mypageHref} aria-label="마이페이지">
              <User size={28} />
            </Link>
            {userType !== 'ADMIN' && userType !== 'ORGANIZATION' && (
              <Link href="/cart/compare" aria-label="AI 심층 비교">
                <Bot size={28} />
              </Link>
            )}
          </>
        ) : (
          <>
            <Link href="/login" className="text-sm font-bold">
              로그인을 해주세요.
            </Link>
            <Link href="/cart/compare" aria-label="AI 심층 비교">
              <Bot size={28} />
            </Link>
          </>
        )}
      </div>
    </header>
  )
}
