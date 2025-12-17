'use client'

import { useQuery } from '@tanstack/react-query'

import { getCartItems } from '@/features/cart/api/cart.api'
import { useAuthStore } from '@/store/authStore'

export const cartLecturesQueryKey = ['cart', 'lectures'] as const

export function useCartLecturesQuery() {
  const isLoggedIn = useAuthStore(state => state.isLoggedIn)
  return useQuery({
    queryKey: cartLecturesQueryKey,
    queryFn: getCartItems,
    enabled: isLoggedIn,
  })
}
