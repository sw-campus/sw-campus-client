'use client'

import { useEffect, useState } from 'react'

import { useRouter } from 'next/navigation'

import { DesktopHeader } from '@/components/layout/header/desktop-header'
import { LogoutDialog } from '@/components/layout/header/logout-dialog'
import { MobileHeader } from '@/components/layout/header/mobile-header'
import { useLogout } from '@/features/auth/hooks/use-logout'
import { useCartLecturesQuery } from '@/features/cart/hooks/use-cart-lectures-query'
import type { CategoryTreeNode } from '@/features/category'
import { ensureSessionActive } from '@/lib/axios'
import { useAuthStore } from '@/store/auth-store'

export interface NavCategoryItem extends CategoryTreeNode {
  type?: 'LECTURE' | 'BOARD'
  link?: string
}

export default function Header({
  categories,
  onOpenNav,
  onCategoryEnter,
  onOtherNavEnter,
}: {
  categories: NavCategoryItem[]
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

  const handleLogout = async () => {
    try {
      await logout()
      router.push('/')
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <>
      <MobileHeader
        isLoggedIn={isLoggedIn}
        nickname={nickname}
        userType={userType}
        hasHydrated={hasHydrated}
        mypageHref={mypageHref}
        onOpenNav={onOpenNav}
      />

      <DesktopHeader
        categories={categories}
        isLoggedIn={isLoggedIn}
        nickname={nickname}
        userType={userType}
        hasHydrated={hasHydrated}
        mypageHref={mypageHref}
        isPending={isPending}
        onLogoutClick={() => setLogoutOpen(true)}
        onCategoryEnter={onCategoryEnter}
        onOtherNavEnter={onOtherNavEnter}
      />

      <LogoutDialog
        open={logoutOpen}
        onOpenChange={setLogoutOpen}
        onConfirm={handleLogout}
        confirmDisabled={isPending}
        hasCartItems={hasCartItems}
      />
    </>
  )
}
