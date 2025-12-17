'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

import { addCartLecture } from '@/features/cart/api/cart.api'
import { cartLecturesQueryKey } from '@/features/cart/hooks/useCartLecturesQuery'
import type { AddToCartItem } from '@/features/cart/types/cart.type'
import { useAuthStore } from '@/store/authStore'

export function useAddToCart() {
  const queryClient = useQueryClient()
  const router = useRouter()
  const isLoggedIn = useAuthStore(state => state.isLoggedIn)

  const mutation = useMutation({
    mutationFn: (lectureId: string) => addCartLecture(lectureId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartLecturesQueryKey })
    },
  })

  const addToCart = (item: AddToCartItem) => {
    if (!isLoggedIn) {
      toast.error('로그인이 필요합니다.')
      router.push('/login')
      return
    }
    mutation.mutate(String(item.lectureId))
  }

  return { addToCart, ...mutation }
}
