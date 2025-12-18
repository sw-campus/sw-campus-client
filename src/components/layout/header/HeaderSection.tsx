'use client'

import { useState } from 'react'

import Header from '@/components/layout/header/Header'
import Navigation from '@/components/layout/header/NavigationMenu'
import { useCategoryTree } from '@/features/category'
import { useDesktopNavigationStore } from '@/store/navigation.store'

export default function HeaderSection() {
  const [open, setOpen] = useState(false)

  const { data: categoryTree } = useCategoryTree()
  const setActiveMenu = useDesktopNavigationStore(state => state.setActiveMenu)
  const hideDesktopNav = useDesktopNavigationStore(state => state.hideDesktopNav)

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
        onDesktopEnter={undefined}
        onDesktopLeave={handleDesktopLeave}
      />
    </div>
  )
}
