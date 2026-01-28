'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Menu, User } from 'lucide-react'

import { HeaderIconAction } from '@/components/layout/header/header-icon-action'
import { NotificationDropdown } from '@/features/notification'
import type { UserType } from '@/store/auth-store'

interface MobileHeaderProps {
  isLoggedIn: boolean
  userType: UserType | null
  hasHydrated: boolean
  mypageHref: string
  onOpenNav: () => void
  isHome?: boolean
}

export function MobileHeader({
  isLoggedIn,
  userType,
  hasHydrated,
  mypageHref,
  onOpenNav,
  isHome = false,
}: MobileHeaderProps) {
  const headerPosition = isHome ? 'absolute left-0 top-0' : 'relative'
  const headerBg = isHome ? '' : 'bg-white'
  const textColor = isHome ? 'text-header-text' : 'text-gray-900'
  const logoFilter = isHome ? 'brightness-0 invert' : ''

  return (
    <header className={`${headerPosition} ${headerBg} z-50 flex w-full items-center justify-between px-4 py-3 md:hidden`}>
      {/* 좌측: 햄버거 + 로고 */}
      <div className="flex items-center gap-3">
        <button type="button" className={textColor} onClick={onOpenNav} aria-label="메뉴 열기">
          <Menu size={24} />
        </button>
        <Link href={userType === 'ADMIN' ? '/admin' : '/'}>
          <Image
            src="/images/logo.png"
            alt="SOFTWARE CAMPUS 로고"
            width={32}
            height={32}
            className={`size-8 object-contain ${logoFilter}`}
            loading="eager"
          />
        </Link>
      </div>

      {/* 우측: 아이콘들 */}
      <div className={`flex items-center gap-2 ${textColor}`}>
        {!hasHydrated ? (
          <div className="h-5 w-16" />
        ) : isLoggedIn ? (
          <>
            <HeaderIconAction kind="link" ariaLabel="마이페이지" tooltip="마이페이지" href={mypageHref} showTooltip={false}>
              <User size={24} />
            </HeaderIconAction>
            <NotificationDropdown isMobile />
          </>
        ) : (
          <Link href="/login" className="text-sm font-bold">
            로그인을 해주세요.
          </Link>
        )}
      </div>
    </header>
  )
}
