'use client'

import { useEffect, useRef } from 'react'

import { useRouter } from 'next/navigation'

import type { NavCategoryItem } from '@/components/layout/header/header'
import { useCategoryTree } from '@/features/category'
import { NavigationMenuDesktop } from '@/features/navigation/components/navigation-menu.desktop'
import { NavigationMenuMobileOverlay } from '@/features/navigation/components/navigation-menu.mobile'
import { buildActiveCategoryChildren, buildMobileNavData } from '@/features/navigation/components/navigation-menu.model'
import { useDesktopNavigationStore } from '@/store/navigation.store'

export default function Navigation({
  open,
  onClose,
  onDesktopEnter,
  onDesktopLeave,
  categories,
  isLoggedIn,
  nickname,
  mypageHref,
  onLogout,
  isLoggingOut,
  isHome = false,
}: {
  open: boolean
  onClose: () => void
  onDesktopEnter?: () => void
  onDesktopLeave?: () => void
  categories?: NavCategoryItem[]
  isLoggedIn?: boolean
  nickname?: string | null
  mypageHref?: string
  onLogout?: () => void
  isLoggingOut?: boolean
  isHome?: boolean
}) {
  const CLOSE_DELAY_MS = 180

  const router = useRouter()
  const showDesktop = useDesktopNavigationStore(state => state.showDesktopNav)
  const activeMenu = useDesktopNavigationStore(state => state.activeMenu)
  const { data: serverCategories } = useCategoryTree()
  const categoryTree = categories || serverCategories

  const closeTimerRef = useRef<number | null>(null)

  const clearCloseTimer = () => {
    if (closeTimerRef.current !== null) {
      window.clearTimeout(closeTimerRef.current)
      closeTimerRef.current = null
    }
  }

  useEffect(() => {
    // Keep timers in sync with desktop open/close.
    if (!showDesktop && closeTimerRef.current !== null) {
      window.clearTimeout(closeTimerRef.current)
      closeTimerRef.current = null
    }

    // Always cleanup on unmount (and before re-run).
    return () => {
      if (closeTimerRef.current !== null) {
        window.clearTimeout(closeTimerRef.current)
        closeTimerRef.current = null
      }
    }
  }, [showDesktop])

  const handleDesktopMouseEnter = () => {
    clearCloseTimer()
    onDesktopEnter?.()
  }

  const handleDesktopMouseLeave = () => {
    clearCloseTimer()
    closeTimerRef.current = window.setTimeout(() => {
      onDesktopLeave?.()
      closeTimerRef.current = null
    }, CLOSE_DELAY_MS)
  }

  const mobileNavData = buildMobileNavData(categoryTree)
  const activeCategoryChildren = buildActiveCategoryChildren(categoryTree, activeMenu)

  return (
    <>
      <NavigationMenuMobileOverlay
        open={open}
        onClose={onClose}
        items={mobileNavData}
        isLoggedIn={isLoggedIn}
        nickname={nickname}
        mypageHref={mypageHref}
        onLogout={onLogout}
        isLoggingOut={isLoggingOut}
      />
      <NavigationMenuDesktop
        showDesktop={showDesktop}
        items={activeCategoryChildren}
        onMouseEnter={handleDesktopMouseEnter}
        onMouseLeave={handleDesktopMouseLeave}
        onNavigate={href => router.push(href)}
        isHome={isHome}
      />
    </>
  )
}
