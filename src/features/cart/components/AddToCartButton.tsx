'use client'

import { Button } from '@/components/ui/button'
import { useAddToCart } from '@/features/cart/hooks/useAddToCart'
import type { AddToCartItem } from '@/features/cart/types/cart.type'

type ButtonProps = React.ComponentProps<typeof Button>

interface AddToCartButtonProps extends Omit<ButtonProps, 'onClick'> {
  item: AddToCartItem
  onClick?: ButtonProps['onClick']
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
