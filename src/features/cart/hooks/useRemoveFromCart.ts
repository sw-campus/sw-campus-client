'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'

import { removeCartLecture } from '@/features/cart/api/cart.api'
import { cartLecturesQueryKey } from '@/features/cart/hooks/useCartLecturesQuery'

export function useRemoveFromCart() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: (lectureId: string | number) => removeCartLecture(lectureId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartLecturesQueryKey })
    },
  })

  return mutation
}
