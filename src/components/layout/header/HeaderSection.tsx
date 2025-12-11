'use client'

import { useEffect, useState } from 'react'

import Header from '@/components/layout/header/Header'
import Navigation from '@/components/layout/header/NavigationMenu'
import { useDesktopNavigationStore } from '@/store/navigation.store'

export default function HeaderSection() {
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  const setActiveMenu = useDesktopNavigationStore(state => state.setActiveMenu)
  const hideDesktopNav = useDesktopNavigationStore(state => state.hideDesktopNav)

  useEffect(() => setMounted(true), [])
  if (!mounted) return null // SSR 단계에서는 아무것도 렌더하지 않음

  const handleBootcampEnter = () => {
    setActiveMenu('bootcamp')
  }

  const handleOtherNavEnter = () => {
    setActiveMenu(null)
  }

  const handleDesktopEnter = () => {
    setActiveMenu('bootcamp')
  }

  const handleDesktopLeave = () => {
    hideDesktopNav()
  }

  return (
    <div className="relative">
      <Header
        onOpenNav={() => setOpen(true)}
        onBootcampEnter={handleBootcampEnter}
        onOtherNavEnter={handleOtherNavEnter}
      />
      <Navigation
        open={open}
        onClose={() => {
          setOpen(false)
          hideDesktopNav()
        }}
        onDesktopEnter={handleDesktopEnter}
        onDesktopLeave={handleDesktopLeave}
      />
    </div>
  )
}
