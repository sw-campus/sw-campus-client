'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Bot, User } from 'lucide-react'

import { HeaderIconAction } from '@/components/layout/header/header-icon-action'
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
    <header className="absolute left-0 top-0 z-50 hidden w-full md:flex">
      <div className="mx-auto flex w-full max-w-[1448px] items-center justify-between px-6 py-3">
      {/* 좌측: 로고 */}
      <div className="flex items-center gap-3">
        <Link href={userType === 'ADMIN' ? '/admin' : '/'} className="flex items-center gap-3">
          <Image
            src="/images/logo.png"
            alt="SOFTWARE CAMPUS 로고"
            width={52}
            height={52}
            className="size-[52px] shrink-0 object-contain brightness-0 invert"
            priority
          />
          <div className="flex flex-col justify-center text-base leading-none font-extrabold tracking-tight text-header-text">
            <span>SOFTWARE</span>
            <span>CAMPUS</span>
          </div>
        </Link>
      </div>

      {/* 중앙: 네비게이션 (lg 이상) */}
      <nav className="flex gap-8 text-base font-medium text-header-text">
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

        <Link href="/cart/compare" onMouseEnter={onOtherNavEnter} onFocus={onOtherNavEnter}>
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
      <div className="flex items-center gap-3 text-header-text">
        {!hasHydrated ? (
          <div className="h-6 w-24" />
        ) : isLoggedIn ? (
          <>
            <span className="text-base">
              <span className="font-bold">{nickname}</span>님
            </span>

            <HeaderIconAction kind="link" ariaLabel="마이페이지" tooltip="마이페이지" href={mypageHref}>
              <User size={24} />
            </HeaderIconAction>

            <HeaderIconAction kind="link" ariaLabel="AI 비교" tooltip="AI 비교" href="/cart/compare">
              <Bot size={24} />
            </HeaderIconAction>
          </>
        ) : (
          <>
            <Link href="/login" className="flex items-center text-sm font-medium leading-none">
              로그인을 해주세요.
            </Link>

            <HeaderIconAction kind="link" ariaLabel="AI 비교" tooltip="AI 비교" href="/cart/compare">
              <Bot size={26} />
            </HeaderIconAction>
          </>
        )}
      </div>
      </div>
    </header>
  )
}
