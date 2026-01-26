'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

import { useUnifiedCart } from '@/features/cart/hooks/use-unified-cart'
import { useUnifiedRemoveFromCart } from '@/features/cart/hooks/use-unified-remove-from-cart'

export default function FloatingCart() {
  const router = useRouter()

  const { items, hasHydrated } = useUnifiedCart()
  const { mutate: remove } = useUnifiedRemoveFromCart()

  // hydration 완료 전에는 렌더링하지 않음 (flash 방지)
  if (!hasHydrated) return null

  return (
    <AnimatePresence>
      {items.length > 0 && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 120 }}
          className="fixed bottom-6 left-1/2 z-999 flex w-[90%] -translate-x-1/2 items-center gap-2 overflow-x-auto rounded-full border border-white/40 bg-white/40 px-4 py-2 shadow-xl backdrop-blur-xl md:w-auto md:max-w-[90%] md:min-w-[43.75rem] md:gap-4 md:px-6 md:py-4"
        >
          <div className="flex items-center gap-2 md:gap-4">
            {items.map(item => (
              <div key={item.lectureId} className="relative shrink-0">
                {/* 이미지 */}
                <div className="relative h-10 w-10 overflow-hidden rounded-full border border-white/60 shadow-sm md:h-14 md:w-14">
                  {item.thumbnailUrl ? (
                    <Image
                      src={item.thumbnailUrl}
                      alt=""
                      fill
                      sizes="56px"
                      className="object-cover"
                      unoptimized={item.thumbnailUrl.startsWith('http')}
                    />
                  ) : null}
                </div>

                {/* 삭제 버튼 */}
                <button
                  onClick={() => remove(item.lectureId)}
                  className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/70 text-[10px] text-white hover:bg-black/90"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>

          {/* 과정비교 버튼 */}
          <button
            onClick={() => router.push('/cart/compare')}
            className="bg-accent ml-auto shrink-0 rounded-full px-4 py-2 text-sm font-semibold text-black shadow-lg transition-transform hover:scale-105 active:scale-95"
          >
            과정비교가기
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
