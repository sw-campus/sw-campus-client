'use client'

import { useQuery } from '@tanstack/react-query'

import { getCartItems } from '@/features/cart/api/cart.api'

export const cartLecturesQueryKey = ['cart', 'lectures'] as const

export function useCartLecturesQuery() {
  return useQuery({
    queryKey: cartLecturesQueryKey,
    queryFn: getCartItems,
  })
}
