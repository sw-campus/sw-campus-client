import { useMutation, useQueryClient } from '@tanstack/react-query'

import { addCartLecture } from '@/features/cart/api/cart.api'
import { cartLecturesQueryKey } from '@/features/cart/hooks/useCartLecturesQuery'
import type { AddToCartItem } from '@/features/cart/types/cart.type'

export function useAddToCart() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: (lectureId: string) => addCartLecture(lectureId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartLecturesQueryKey })
    },
  })

  const addToCart = (item: AddToCartItem) => {
    mutation.mutate(String(item.lectureId))
  }

  return { addToCart, ...mutation }
}
