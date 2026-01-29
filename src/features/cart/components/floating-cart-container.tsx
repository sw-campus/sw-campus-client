'use client'

import { useRouter, usePathname } from 'next/navigation'

import { FloatingCartPanel } from '@/components/common/floating-cart-panel'
import { useUnifiedCart } from '@/features/cart/hooks/use-unified-cart'
import { useUnifiedRemoveFromCart } from '@/features/cart/hooks/use-unified-remove-from-cart'
import { useFloatingBarStore } from '@/store/floating-bar.store'

export default function FloatingCartContainer() {
  const router = useRouter()
  const pathname = usePathname()

  const { items, hasHydrated } = useUnifiedCart()
  const { mutate: remove } = useUnifiedRemoveFromCart()

  const isOpen = useFloatingBarStore((state) => state.isOpen)
  const setIsOpen = useFloatingBarStore((state) => state.setIsOpen)

  // lecture 상세/검색 페이지에서는 자체 FloatingCartPanel 사용
  if (pathname.startsWith('/lectures/')) return null

  // hydration 완료 전에는 렌더링하지 않음 (flash 방지)
  if (!hasHydrated) return null

  // 비교 페이지에서는 숨김 (CartItemSidebar가 동일 기능 제공)
  if (pathname === '/cart/compare') return null

  return (
    <FloatingCartPanel
      items={items}
      onRemove={(id) => remove(id)}
      onCompare={() => router.push('/cart/compare')}
      isOpen={isOpen}
      onToggleOpen={() => setIsOpen(!isOpen)}
    />
  )
}
