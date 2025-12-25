'use client'

import { useEffect, useRef } from 'react'

import { useRouter } from 'next/navigation'

import { useCategoryTree } from '@/features/category'
import { NavigationMenuDesktop } from '@/features/navigation/components/NavigationMenu.desktop'
import { NavigationMenuMobileOverlay } from '@/features/navigation/components/NavigationMenu.mobile'
import { buildActiveCategoryChildren, buildMobileNavData } from '@/features/navigation/components/navigation-menu.model'
import { useDesktopNavigationStore } from '@/store/navigation.store'

export default function Navigation({
  open,
  onClose,
  onDesktopEnter,
  onDesktopLeave,
}: {
  open: boolean
  onClose: () => void
  onDesktopEnter?: () => void
  onDesktopLeave?: () => void
}) {
  const CLOSE_DELAY_MS = 180

  const router = useRouter()
  const showDesktop = useDesktopNavigationStore(state => state.showDesktopNav)
  const activeMenu = useDesktopNavigationStore(state => state.activeMenu)
  const { data: categoryTree } = useCategoryTree()

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
      <NavigationMenuMobileOverlay open={open} onClose={onClose} items={mobileNavData} />
      <NavigationMenuDesktop
        showDesktop={showDesktop}
        items={activeCategoryChildren}
        onMouseEnter={handleDesktopMouseEnter}
        onMouseLeave={handleDesktopMouseLeave}
        onNavigate={href => router.push(href)}
      />
    </>
  )
}
