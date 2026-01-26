'use client'

import { useEffect, useState } from 'react'

import { AnimatePresence, motion } from 'framer-motion'
import { createPortal } from 'react-dom'
import { FiArrowUp } from 'react-icons/fi'

import { useIsMounted } from '@/hooks/use-is-mounted'

export function ScrollToTopButton() {
  const isMounted = useIsMounted()
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      // 300px 이상 스크롤하면 버튼 표시
      setIsVisible(window.scrollY > 300)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (!isMounted) return null

  return createPortal(
    <div className="pointer-events-none fixed right-4 bottom-20 z-50 md:right-[max(48px,calc((100vw-1280px)/2+48px))]">
      <AnimatePresence>
        {isVisible && (
          <motion.button
            type="button"
            onClick={scrollToTop}
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="pointer-events-auto flex h-12 w-12 items-center justify-center rounded-full border border-gray-300 bg-white text-gray-700 shadow-lg transition-colors hover:bg-gray-50 hover:text-orange-500"
            aria-label="상단으로 이동"
            title="상단으로 이동"
          >
            <FiArrowUp className="size-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>,
    document.body,
  )
}
