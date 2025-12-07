import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type CartItem = {
  id: string
  title: string
  image: string
}

type AddResult = 'ok' | 'duplicate' | 'limit'
interface CartState {
  items: CartItem[]
  add: (item: CartItem) => AddResult
  remove: (id: string) => void
  clear: () => void
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      add: item => {
        const items = get().items
        if (items.some(i => i.id === item.id)) return 'duplicate' // 같은 상품 중복 추가 방지
        if (items.length >= 10) return 'limit' // 최대 10개 제한
        set({ items: [...items, item] })
        return 'ok'
      },
      remove: id => {
        set({ items: get().items.filter(i => i.id !== id) })
      },
      clear: () => set({ items: [] }),
    }),
    {
      name: 'floating-cart-storage',
    },
  ),
)
