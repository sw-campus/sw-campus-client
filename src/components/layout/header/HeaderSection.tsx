'use client'

import { useEffect, useState } from 'react'

import Header from '@/components/layout/header/Header'
import Navigation from '@/components/layout/header/NavigationMenu'
import { useCategoryTree } from '@/features/category'
import { useDesktopNavigationStore } from '@/store/navigation.store'

export default function HeaderSection() {
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  const { data: categoryTree } = useCategoryTree()
  const setActiveMenu = useDesktopNavigationStore(state => state.setActiveMenu)
  const hideDesktopNav = useDesktopNavigationStore(state => state.hideDesktopNav)

  useEffect(() => setMounted(true), [])
  if (!mounted) return null // SSR 단계에서는 아무것도 렌더하지 않음

  const handleCategoryEnter = (categoryId: number) => {
    setActiveMenu(categoryId)
  }

  const handleOtherNavEnter = () => {
    setActiveMenu(null)
  }



  const handleDesktopLeave = () => {
    hideDesktopNav()
  }

  return (
    <div className="relative">
      <Header
        categories={categoryTree || []}
        onOpenNav={() => setOpen(true)}
        onCategoryEnter={handleCategoryEnter}
        onOtherNavEnter={handleOtherNavEnter}
      />
      <Navigation
        open={open}
        onClose={() => {
          setOpen(false)
          hideDesktopNav()
        }}
        onDesktopEnter={() => { }}
        onDesktopLeave={handleDesktopLeave}
      />
    </div>
  )
}
