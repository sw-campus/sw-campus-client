'use client'

import { Button } from '@/components/ui/button'

import { useAddToCart } from '../hooks/useAddToCart'
import { CartItem } from '../types/cart.type'

interface AddToCartButtonProps {
  item: CartItem
  children?: React.ReactNode
  [key: string]: any // 다른 모든 props 허용 (className 등)
}

export function AddToCartButton({ item, children, onClick, ...props }: AddToCartButtonProps) {
  const { addToCart } = useAddToCart()

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    e.stopPropagation()
    addToCart(item)
    onClick?.(e)
  }

  return (
    <Button {...props} onClick={handleClick}>
      {children ?? 'Add to cart'}
    </Button>
  )
}
