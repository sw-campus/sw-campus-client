'use client'

import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { useCartStore, type CartItem } from '@/store/cart.store'

const ITEMS: CartItem[] = [
  {
    id: 'item-1',
    title: '상품 A',
    image: 'https://picsum.photos/seed/aa/200',
  },
  {
    id: 'item-2',
    title: '상품 B',
    image: 'https://picsum.photos/seed/bb/200',
  },
]

export default function Home() {
  const add = useCartStore(s => s.add)

  const handleAdd = (item: CartItem) => {
    const result = add(item)

    switch (result) {
      case 'duplicate':
        toast.error('이미 장바구니에 있는 상품입니다.')
        break
      case 'limit':
        toast.error('장바구니는 최대 10개까지만 담을 수 있습니다.')
        break
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Button onClick={() => handleAdd(ITEMS[0])}>상품 A 담기</Button>
      <Button onClick={() => handleAdd(ITEMS[1])}>상품 B 담기</Button>
    </div>
  )
}
