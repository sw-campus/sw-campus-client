'use client'

import { create } from 'zustand'

type DesktopNavigationState = {
  showDesktopNav: boolean
  activeMenu: 'bootcamp' | null
  setActiveMenu: (menu: 'bootcamp' | null) => void
  hideDesktopNav: () => void
}

export const useDesktopNavigationStore = create<DesktopNavigationState>(set => ({
  showDesktopNav: false,
  activeMenu: null,
  setActiveMenu: menu =>
    set({
      activeMenu: menu,
      showDesktopNav: menu === 'bootcamp',
    }),
  hideDesktopNav: () =>
    set({
      activeMenu: null,
      showDesktopNav: false,
    }),
}))
