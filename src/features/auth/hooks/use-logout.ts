'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'

import { logout as logoutApi } from '@/features/auth/auth-api'
import { cartLecturesQueryKey } from '@/features/cart/hooks/use-cart-lectures-query'
import { useAuthStore } from '@/store/auth-store'
import { useGuestCartStore } from '@/store/guest-cart.store'

export function useLogout() {
  const queryClient = useQueryClient()
  const clearAuth = useAuthStore(state => state.logout)
  const clearGuestCart = useGuestCartStore(state => state.clear)

  const mutation = useMutation({
    mutationFn: logoutApi,
    onSuccess: () => {
      clearAuth()
      queryClient.removeQueries({ queryKey: cartLecturesQueryKey })
      // 로그아웃 시 guest cart도 비움 (빈 상태로 시작)
      clearGuestCart()
    },
  })

  return {
    logout: mutation.mutateAsync,
    ...mutation,
  }
}
