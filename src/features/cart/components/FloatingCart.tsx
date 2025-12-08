'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { ArrowUpRight, X } from 'lucide-react'
import { useRouter } from 'next/navigation'

import { useCartStore } from '@/store/cart.store'

export default function FloatingCart() {
  const router = useRouter()

  const items = useCartStore(s => s.items)
  const remove = useCartStore(s => s.remove)

  return (
    <AnimatePresence>
      {items.length > 0 && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 120 }}
          className="no-scrollbar fixed bottom-6 left-1/2 z-999 flex w-[95%] -translate-x-1/2 items-center gap-4 overflow-x-auto rounded-full border border-white/40 bg-white/40 px-6 py-4 shadow-xl backdrop-blur-xl md:w-[700px]"
        >
          <div className="flex items-center gap-4">
            {items.map(item => (
              <div key={item.id} className="relative shrink-0">
                {/* 이미지 */}
                <div className="relative h-14 w-14 overflow-hidden rounded-full border border-white/60 shadow-sm">
                  {/* <Image src={item.image} alt="" fill sizes="56px" className="object-cover" /> */}
                </div>

                {/* 삭제 버튼 */}
                <button
                  onClick={() => remove(item.id)}
                  className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/70 text-[10px] text-white hover:bg-black/90"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>

          {/* 우측 화살표 */}
          <button
            // onClick={() => router.push('/')} // 비교하기 페이지로 이동
            className="ml-auto flex h-10 w-10 items-center justify-center rounded-full border border-white/30 text-white backdrop-blur-lg"
          >
            <ArrowUpRight />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
