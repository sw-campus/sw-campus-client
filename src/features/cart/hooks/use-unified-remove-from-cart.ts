'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'

import { removeCartLecture } from '@/features/cart/api/cart.api'
import { cartLecturesQueryKey } from '@/features/cart/hooks/use-cart-lectures-query'
import { useAuthStore } from '@/store/auth-store'
import { useGuestCartStore } from '@/store/guest-cart.store'

/**
 * 통합 Remove from Cart 훅 - 로그인 여부에 따라 서버/로컬 cart에서 자동 제거
 *
 * - 로그인 상태: 서버 API 호출
 * - 비로그인 상태: localStorage (guest cart)에서 제거
 */
export function useUnifiedRemoveFromCart() {
  const queryClient = useQueryClient()
  const isLoggedIn = useAuthStore(state => state.isLoggedIn)
  const removeGuestItem = useGuestCartStore(state => state.removeItem)

  // 서버 cart에서 제거하는 mutation (로그인 시)
  const serverMutation = useMutation({
    mutationFn: (lectureId: string | number) => removeCartLecture(lectureId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartLecturesQueryKey })
    },
  })

  /**
   * Cart에서 아이템 제거
   */
  const removeFromCart = (lectureId: string | number) => {
    const id = String(lectureId)

    if (isLoggedIn) {
      // 로그인 상태: 서버 API 호출
      serverMutation.mutate(id)
    } else {
      // 비로그인 상태: guest cart에서 제거
      removeGuestItem(id)
    }
  }

  return {
    mutate: removeFromCart,
    isPending: serverMutation.isPending,
  }
}
