'use client'

import { create } from 'zustand'

type DesktopNavigationState = {
  showDesktopNav: boolean
  activeMenu: number | null
  setActiveMenu: (menu: number | null) => void
  hideDesktopNav: () => void
}

export const useDesktopNavigationStore = create<DesktopNavigationState>(set => ({
  showDesktopNav: false,
  activeMenu: null,
  setActiveMenu: menu =>
    set({
      activeMenu: menu,
      showDesktopNav: menu !== null,
    }),
  hideDesktopNav: () =>
    set({
      activeMenu: null,
      showDesktopNav: false,
    }),
}))
