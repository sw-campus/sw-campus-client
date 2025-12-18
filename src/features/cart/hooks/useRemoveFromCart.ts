'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

import { removeCartLecture } from '@/features/cart/api/cart.api'
import { cartLecturesQueryKey } from '@/features/cart/hooks/useCartLecturesQuery'
import { useAuthStore } from '@/store/authStore'

const LOGIN_REQUIRED_ERROR = new Error('LOGIN_REQUIRED')

export function useRemoveFromCart() {
  const queryClient = useQueryClient()
  const router = useRouter()
  const isLoggedIn = useAuthStore(state => state.isLoggedIn)

  const mutation = useMutation({
    mutationFn: (lectureId: string | number) => removeCartLecture(lectureId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartLecturesQueryKey })
    },
  })

  const ensureLoggedIn = () => {
    if (isLoggedIn) return true
    toast.error('로그인이 필요합니다.')
    router.push('/login')
    return false
  }

  return {
    ...mutation,
    mutate: (lectureId: string | number, options?: Parameters<typeof mutation.mutate>[1]) => {
      if (!ensureLoggedIn()) return
      mutation.mutate(lectureId, options)
    },
    mutateAsync: async (lectureId: string | number, options?: Parameters<typeof mutation.mutateAsync>[1]) => {
      if (!ensureLoggedIn()) throw LOGIN_REQUIRED_ERROR
      return mutation.mutateAsync(lectureId, options)
    },
  }
}
