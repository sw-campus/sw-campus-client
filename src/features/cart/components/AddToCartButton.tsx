'use client'

import { Button } from '@/components/ui/button'

import { useAddToCart } from '../hooks/useAddToCart'
import { CartItem } from '../types/cart.type'

interface AddToCartButtonProps {
  item: CartItem
  children?: React.ReactNode
  [key: string]: any // 다른 모든 props 허용 (className 등)
}

export function AddToCartButton({ item, children, ...props }: AddToCartButtonProps) {
  const { addToCart } = useAddToCart()

  return (
    <Button {...props} onClick={() => addToCart(item)}>
      {children ?? 'Add to cart'}
    </Button>
  )
}
