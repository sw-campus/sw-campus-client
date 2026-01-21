'use client'

import { create } from 'zustand'

type Side = 'left' | 'right'

type CartCompareState = {
  leftId: string | null
  rightId: string | null
  setLeftId: (id: string | null) => void
  setRightId: (id: string | null) => void
  setSelected: (side: Side, id: string | null) => void
  clear: () => void
}

export const useCartCompareStore = create<CartCompareState>(set => ({
  leftId: null,
  rightId: null,
  setLeftId: id => set({ leftId: id }),
  setRightId: id => set({ rightId: id }),
  setSelected: (side, id) => set(side === 'left' ? { leftId: id } : { rightId: id }),
  clear: () => set({ leftId: null, rightId: null }),
}))
