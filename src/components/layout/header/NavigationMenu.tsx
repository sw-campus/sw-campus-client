'use client'

import { useEffect, useMemo, useRef } from 'react'

import { useRouter } from 'next/navigation'

import { useCategoryTree } from '@/features/category'
import { useDesktopNavigationStore } from '@/store/navigation.store'

import { NavigationMenuDesktop } from './NavigationMenu.desktop'
import { NavigationMenuMobileOverlay } from './NavigationMenu.mobile'
import { buildActiveCategoryChildren, buildMobileNavData } from './navigation-menu.model'

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
    return () => {
      clearCloseTimer()
    }
  }, [])

  useEffect(() => {
    if (!showDesktop) clearCloseTimer()
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
    }, 180)
  }

  const mobileNavData = useMemo(() => buildMobileNavData(categoryTree), [categoryTree])
  const activeCategoryChildren = useMemo(
    () => buildActiveCategoryChildren(categoryTree, activeMenu),
    [categoryTree, activeMenu],
  )

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
