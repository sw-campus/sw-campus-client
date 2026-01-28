'use client'

import Image from 'next/image'
import Link from 'next/link'
import { LogIn, LogOut, User } from 'lucide-react'

import { HeaderIconAction } from '@/components/layout/header/header-icon-action'
import { NotificationDropdown } from '@/features/notification'
import type { UserType } from '@/store/auth-store'

import type { NavCategoryItem } from './header'

interface DesktopHeaderProps {
  categories: NavCategoryItem[]
  isLoggedIn: boolean
  nickname: string | null
  userType: UserType | null
  hasHydrated: boolean
  mypageHref: string
  isPending: boolean
  onLogoutClick: () => void
  onCategoryEnter: (id: number) => void
  onOtherNavEnter: () => void
  isHome?: boolean
}

export function DesktopHeader({
  categories,
  isLoggedIn,
  nickname,
  userType,
  hasHydrated,
  mypageHref,
  isPending: _isPending,
  onLogoutClick,
  onCategoryEnter,
  onOtherNavEnter,
  isHome = false,
}: DesktopHeaderProps) {
  const headerBg = isHome ? 'bg-[#041032]' : 'bg-white'
  const textColor = isHome ? 'text-header-text' : 'text-gray-900'
  const logoFilter = isHome ? 'brightness-0 invert' : ''

  return (
    <header className={`relative hidden w-full md:flex ${headerBg}`}>
      <div className="page-container flex items-center justify-between px-6 py-3">
      {/* 좌측: 로고 */}
      <div className="flex items-center gap-3">
        <Link href={userType === 'ADMIN' ? '/admin' : '/'} className="flex items-center gap-3">
          <Image
            src="/images/logo.png"
            alt="SOFTWARE CAMPUS 로고"
            width={52}
            height={52}
            className={`size-[52px] shrink-0 object-contain ${logoFilter}`}
            priority
          />
          <div className={`flex flex-col justify-center text-base leading-none font-bold tracking-tight ${textColor}`}>
            <span>SOFTWARE</span>
            <span>CAMPUS</span>
          </div>
        </Link>
      </div>

      {/* 중앙: 네비게이션 (lg 이상) */}
      <nav className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex gap-8 text-base font-semibold tracking-tight ${textColor}`}>
        {categories
          .filter(c => !c.type || c.type === 'LECTURE')
          .map(category => {
            const href = category.link || `/lectures/search?categoryIds=${category.categoryId}&size=12`
            const uniqueKey = category.type
              ? `${category.type}-${category.categoryId}`
              : `LECTURE-${category.categoryId}`

            return (
              <Link
                key={uniqueKey}
                href={href}
                className="hover:text-brand-gold"
                onMouseEnter={() => onCategoryEnter(category.categoryId)}
                onFocus={() => onCategoryEnter(category.categoryId)}
                onClick={() => onCategoryEnter(category.categoryId)}
              >
                {category.categoryName}
              </Link>
            )
          })}

        <Link href="/organizations" className="hover:text-brand-gold" onMouseEnter={onOtherNavEnter} onFocus={onOtherNavEnter}>
          훈련 기관
        </Link>

        <Link href="/cart/compare" className="hover:text-brand-gold" onMouseEnter={onOtherNavEnter} onFocus={onOtherNavEnter}>
          부트캠프 비교
        </Link>

        {categories
          .filter(c => c.type === 'BOARD')
          .map(category => {
            const href = category.link || `/community?categoryId=${category.categoryId}`
            const uniqueKey = `${category.type}-${category.categoryId}`

            return (
              <Link
                key={uniqueKey}
                href={href}
                className="hover:text-brand-gold"
                prefetch={false}
                onMouseEnter={onOtherNavEnter}
                onFocus={onOtherNavEnter}
              >
                {category.categoryName}
              </Link>
            )
          })}
      </nav>

      {/* 우측: 사용자 정보 */}
      <div className={`flex items-center gap-5 ${textColor}`}>
        {!hasHydrated ? (
          <div className="h-6 w-24" />
        ) : isLoggedIn ? (
          <>
            <span className="text-sm">
              {nickname} <span className="font-bold">님</span>
            </span>

            <HeaderIconAction kind="link" ariaLabel="마이페이지" tooltip="마이페이지" href={mypageHref}>
              <User size={20} />
            </HeaderIconAction>

            <NotificationDropdown />

            <HeaderIconAction kind="button" ariaLabel="로그아웃" tooltip="로그아웃" onClick={onLogoutClick}>
              <LogOut size={20} />
            </HeaderIconAction>
          </>
        ) : (
          <HeaderIconAction kind="link" ariaLabel="로그인" tooltip="로그인" href="/login">
            <div className="flex items-center gap-2 text-sm font-medium leading-none">
              로그인을 해주세요.
              <LogIn size={18} />
            </div>
          </HeaderIconAction>
        )}
      </div>
      </div>
    </header>
  )
}
