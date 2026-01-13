'use client'

import { useEffect, useState } from 'react'

import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FiLogIn, FiUser, FiMenu, FiLogOut } from 'react-icons/fi'
import { PiRobotDuotone } from 'react-icons/pi'

import { HeaderIconAction } from '@/components/layout/header/HeaderIconAction'
import { LogoutDialog } from '@/components/layout/header/LogoutDialog'
import { useLogout } from '@/features/auth/hooks/useLogout'
import { useCartLecturesQuery } from '@/features/cart/hooks/useCartLecturesQuery'
import type { CategoryTreeNode } from '@/features/category'
import { ensureSessionActive } from '@/lib/axios'
import { useAuthStore } from '@/store/authStore'

export default function Header({
  categories,
  onOpenNav,
  onCategoryEnter,
  onOtherNavEnter,
}: {
  categories: CategoryTreeNode[]
  onOpenNav: () => void
  onCategoryEnter: (id: number) => void
  onOtherNavEnter: () => void
}) {
  const router = useRouter()
  const [logoutOpen, setLogoutOpen] = useState(false)
  const { isLoggedIn, nickname, userType, hasHydrated } = useAuthStore()
  const { logout, isPending } = useLogout()
  const { data: cartItems } = useCartLecturesQuery()
  const hasCartItems = (cartItems?.length ?? 0) > 0

  const mypageHref =
    userType === 'ADMIN' ? '/mypage/admin' : userType === 'ORGANIZATION' ? '/mypage/organization' : '/mypage/personal'

  useEffect(() => {
    if (!isLoggedIn) return

    const check = () => {
      void ensureSessionActive()
    }

    check()

    const onFocus = () => check()
    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible') check()
    }

    window.addEventListener('focus', onFocus)
    document.addEventListener('visibilitychange', onVisibilityChange)
    return () => {
      window.removeEventListener('focus', onFocus)
      document.removeEventListener('visibilitychange', onVisibilityChange)
    }
  }, [isLoggedIn])

  // 로그아웃
  const handleLogout = async () => {
    try {
      await logout() // 서버에서 쿠키 삭제 + 클라이언트 상태 초기화
      router.push('/') // 홈으로 이동 (프로그램적으로 네비게이션)
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <header className="sticky top-0 z-50 mx-auto mt-4 flex w-full max-w-7xl items-center justify-between rounded-full border border-gray-200 bg-white/60 px-4 py-3 shadow-lg backdrop-blur-xl sm:mt-6 sm:px-6 md:px-10 md:py-4">
      <div className="flex flex-1 items-center gap-3 sm:gap-6 md:gap-8">
        {/* 햄버거 버튼 */}
        <button type="button" className="text-gray-800 lg:hidden" onClick={onOpenNav}>
          <FiMenu size={22} />
        </button>

        {/* 로고 */}
        <Link href={userType === 'ADMIN' ? '/admin' : '/'} className="flex items-center gap-2 sm:gap-3">
          <Image
            src="/images/logo.png"
            alt="SOFTWARE CAMPUS 로고"
            width={48}
            height={48}
            className="h-10 w-10 shrink-0 object-contain sm:h-12 sm:w-12"
            priority
          />

          {/* 로고 텍스트: 작은 화면에서 숨김 */}
          <div className="hidden h-12 translate-y-px flex-col justify-center leading-none font-extrabold tracking-tight text-gray-800 sm:flex">
            <span>SOFTWARE</span>
            <span>CAMPUS</span>
          </div>
        </Link>
      </div>

      <nav className="absolute left-1/2 hidden -translate-x-1/2 gap-8 font-semibold text-gray-800 lg:flex">
        {categories.map(category => (
          <Link
            key={category.categoryId}
            href={`/lectures/search?categoryIds=${category.categoryId}&size=12`}
            onMouseEnter={() => onCategoryEnter(category.categoryId)}
            onFocus={() => onCategoryEnter(category.categoryId)}
            onClick={() => onCategoryEnter(category.categoryId)}
          >
            {category.categoryName}
          </Link>
        ))}
        <Link href="/organizations" onMouseEnter={onOtherNavEnter} onFocus={onOtherNavEnter}>
          훈련 기관
        </Link>
      </nav>

      {/* 아이콘 */}
      <div className="flex items-center gap-3 text-lg text-gray-800 sm:gap-4 sm:text-xl md:gap-6">
        {!hasHydrated ? (
          // 하이드레이션 전에는 아무것도 표시하지 않음
          <div className="h-6 w-12 sm:w-24" />
        ) : isLoggedIn ? (
          <>
            {/* 닉네임: 모바일에서 숨김 */}
            <span className="hidden text-sm font-medium sm:inline sm:text-base">{nickname}님</span>

            <HeaderIconAction
              kind="button"
              ariaLabel="로그아웃"
              tooltip="로그아웃"
              onClick={() => setLogoutOpen(true)}
              disabled={isPending}
            >
              <FiLogOut />
            </HeaderIconAction>

            <HeaderIconAction kind="link" ariaLabel="마이페이지" tooltip="마이페이지" href={mypageHref}>
              <FiUser />
            </HeaderIconAction>

            {userType !== 'ADMIN' && userType !== 'ORGANIZATION' && (
              <HeaderIconAction kind="link" ariaLabel="AI 심층 비교" tooltip="AI 심층 비교" href="/cart/compare">
                <PiRobotDuotone />
              </HeaderIconAction>
            )}
          </>
        ) : (
          // 로그인 안된 경우: 로그인 아이콘만 표시
          <HeaderIconAction kind="link" ariaLabel="로그인" tooltip="로그인" href="/login">
            <FiLogIn />
          </HeaderIconAction>
        )}
      </div>

      <LogoutDialog
        open={logoutOpen}
        onOpenChange={setLogoutOpen}
        onConfirm={handleLogout}
        confirmDisabled={isPending}
        hasCartItems={hasCartItems}
      />
    </header>
  )
}
