'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'

import { logout as logoutApi } from '@/features/auth/auth-api'
import { cartLecturesQueryKey } from '@/features/cart/hooks/use-cart-lectures-query'
import { useAuthStore } from '@/store/auth-store'

export function useLogout() {
  const queryClient = useQueryClient()
  const clearAuth = useAuthStore(state => state.logout)

  const mutation = useMutation({
    mutationFn: logoutApi,
    onSuccess: () => {
      clearAuth()
      queryClient.removeQueries({ queryKey: cartLecturesQueryKey })
    },
  })

  return {
    logout: mutation.mutateAsync,
    ...mutation,
  }
}
