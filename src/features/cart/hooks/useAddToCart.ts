import { toast } from 'sonner'

import { useCartStore, type CartItem } from '@/store/cart.store'

export function useAddToCart() {
  const add = useCartStore(s => s.add)

  const addToCart = (item: CartItem) => {
    const result = add(item)

    switch (result) {
      case 'duplicate':
        toast.error('이미 장바구니에 있는 상품입니다.')
        break
      case 'limit':
        toast.error('장바구니는 최대 10개까지만 담을 수 있습니다.')
        break
    }

    return result
  }

  return { addToCart }
}
