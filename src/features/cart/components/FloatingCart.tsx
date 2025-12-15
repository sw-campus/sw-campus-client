'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { ArrowUpRight, X } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

import { useCartLecturesQuery } from '@/features/cart/hooks/useCartLecturesQuery'
import { useRemoveFromCart } from '@/features/cart/hooks/useRemoveFromCart'

export default function FloatingCart() {
  const router = useRouter()

  const { data } = useCartLecturesQuery()
  const items = data ?? []

  const { mutate: remove } = useRemoveFromCart()

  return (
    <AnimatePresence>
      {items.length > 0 && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 120 }}
          className="fixed bottom-6 left-1/2 z-999 flex w-[95%] -translate-x-1/2 items-center gap-4 overflow-x-auto rounded-full border border-white/40 bg-white/40 px-6 py-4 shadow-xl backdrop-blur-xl md:w-[700px]"
        >
          <div className="flex items-center gap-4">
            {items.map(item => (
              <div key={item.lectureId} className="relative shrink-0">
                {/* 이미지 */}
                <div className="relative h-14 w-14 overflow-hidden rounded-full border border-white/60 shadow-sm">
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

          {/* 우측 화살표 */}
          <button
            onClick={() => router.push('/cart/compare')}
            className="ml-auto flex h-10 w-10 items-center justify-center rounded-full border border-white/30 text-white backdrop-blur-lg"
          >
            <ArrowUpRight />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
