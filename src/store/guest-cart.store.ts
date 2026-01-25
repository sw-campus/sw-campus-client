'use client'

import { create } from 'zustand'
import type { StateCreator } from 'zustand'
import { persist } from 'zustand/middleware'

import type { CartItem } from '@/features/cart/types/cart.type'

const MAX_CART_ITEMS = 10
const STORAGE_KEY = 'guest-cart-storage'

type AddItemResult = { success: true } | { success: false; reason: 'duplicate' | 'limit' }

interface GuestCartState {
  items: CartItem[]
  hasHydrated: boolean

  // actions
  addItem: (item: CartItem) => AddItemResult
  removeItem: (lectureId: string) => void
  clear: () => void
  setHasHydrated: (state: boolean) => void
}

export const useGuestCartStore = create<GuestCartState>()(
  persist<GuestCartState>(
    (set, get) => ({
      items: [],
      hasHydrated: false,

      addItem: (item: CartItem) => {
        const { items } = get()

        // 중복 체크
        if (items.some(i => i.lectureId === item.lectureId)) {
          return { success: false, reason: 'duplicate' }
        }

        // 최대 개수 제한
        if (items.length >= MAX_CART_ITEMS) {
          return { success: false, reason: 'limit' }
        }

        set({ items: [...items, item] })
        return { success: true }
      },

      removeItem: (lectureId: string) => {
        set(state => ({
          items: state.items.filter(item => item.lectureId !== lectureId),
        }))
      },

      clear: () => {
        set({ items: [] })
      },

      setHasHydrated: (state: boolean) => set({ hasHydrated: state }),
    }),
    {
      name: STORAGE_KEY,
      onRehydrateStorage: () => state => {
        state?.setHasHydrated(true)
      },
    },
  ) as unknown as StateCreator<GuestCartState>,
)

/**
 * Guest cart의 아이템 목록을 가져오는 셀렉터
 */
export const selectGuestCartItems = (state: GuestCartState) => state.items

/**
 * Guest cart의 hydration 상태를 가져오는 셀렉터
 */
export const selectGuestCartHasHydrated = (state: GuestCartState) => state.hasHydrated
