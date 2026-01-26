'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Bot, LogIn, LogOut, User } from 'lucide-react'

import { HeaderIconAction } from '@/components/layout/header/header-icon-action'
import { NotificationDropdown } from '@/features/notification'
import type { UserType } from '@/store/auth-store'

import type { NavCategoryItem } from './header'

interface DesktopHeaderProps {
  categories: NavCategoryItem[]
  isLoggedIn: boolean
  nickname: string | null
  userType: UserType
  hasHydrated: boolean
  mypageHref: string
  isPending: boolean
  onLogoutClick: () => void
  onCategoryEnter: (id: number) => void
  onOtherNavEnter: () => void
}

export function DesktopHeader({
  categories,
  isLoggedIn,
  nickname,
  userType,
  hasHydrated,
  mypageHref,
  isPending,
  onLogoutClick,
  onCategoryEnter,
  onOtherNavEnter,
}: DesktopHeaderProps) {
  return (
    <header className="sticky top-0 z-50 mx-auto mt-6 hidden w-full max-w-7xl items-center justify-between rounded-full border border-gray-200 bg-white/60 px-10 py-4 shadow-lg backdrop-blur-xl md:flex">
      {/* 좌측: 로고 */}
      <div className="flex flex-1 items-center gap-8">
        <Link href={userType === 'ADMIN' ? '/admin' : '/'} className="flex items-center gap-3">
          <Image
            src="/images/logo.png"
            alt="SOFTWARE CAMPUS 로고"
            width={48}
            height={48}
            className="size-12 shrink-0 object-contain"
            priority
          />
          <div className="flex h-12 translate-y-px flex-col justify-center leading-none font-extrabold tracking-tight text-gray-800">
            <span>SOFTWARE</span>
            <span>CAMPUS</span>
          </div>
        </Link>
      </div>

      {/* 중앙: 네비게이션 (lg 이상) */}
      <nav className="absolute left-1/2 hidden -translate-x-1/2 gap-8 font-semibold text-gray-800 lg:flex">
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
                onMouseEnter={() => onCategoryEnter(category.categoryId)}
                onFocus={() => onCategoryEnter(category.categoryId)}
                onClick={() => onCategoryEnter(category.categoryId)}
              >
                {category.categoryName}
              </Link>
            )
          })}

        <Link href="/organizations" onMouseEnter={onOtherNavEnter} onFocus={onOtherNavEnter}>
          훈련 기관
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
                prefetch={false}
                onMouseEnter={onOtherNavEnter}
                onFocus={onOtherNavEnter}
              >
                {category.categoryName}
              </Link>
            )
          })}
      </nav>

      {/* 우측: 아이콘 */}
      <div className="flex items-center gap-6 text-xl text-gray-800">
        {!hasHydrated ? (
          <div className="h-6 w-24" />
        ) : isLoggedIn ? (
          <>
            <span className="text-base font-medium">{nickname}님</span>

            <HeaderIconAction
              kind="button"
              ariaLabel="로그아웃"
              tooltip="로그아웃"
              onClick={onLogoutClick}
              disabled={isPending}
            >
              <LogOut />
            </HeaderIconAction>

            <NotificationDropdown />

            <HeaderIconAction kind="link" ariaLabel="마이페이지" tooltip="마이페이지" href={mypageHref}>
              <User />
            </HeaderIconAction>

            {userType !== 'ADMIN' && userType !== 'ORGANIZATION' && (
              <HeaderIconAction kind="link" ariaLabel="AI 심층 비교" tooltip="AI 심층 비교" href="/cart/compare">
                <Bot />
              </HeaderIconAction>
            )}
          </>
        ) : (
          <HeaderIconAction kind="link" ariaLabel="로그인" tooltip="로그인" href="/login">
            <LogIn />
          </HeaderIconAction>
        )}
      </div>
    </header>
  )
}
