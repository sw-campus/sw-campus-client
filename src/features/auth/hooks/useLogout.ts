'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'

import { logout as logoutApi } from '@/features/auth/authApi'
import { cartLecturesQueryKey } from '@/features/cart/hooks/useCartLecturesQuery'
import { useAuthStore } from '@/store/authStore'

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
