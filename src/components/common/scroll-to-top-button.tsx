'use client'

import { useEffect, useState } from 'react'

import { AnimatePresence, motion } from 'framer-motion'
import { createPortal } from 'react-dom'
import { FiArrowUp } from 'react-icons/fi'

import { useIsMounted } from '@/hooks/use-is-mounted'
import { useFloatingBarStore } from '@/store/floating-bar.store'

export function ScrollToTopButton() {
  const isMounted = useIsMounted()
  const [isVisible, setIsVisible] = useState(false)
  const [pcLeftPosition, setPcLeftPosition] = useState<number | null>(null)
  const isFloatingBarOpen = useFloatingBarStore(state => state.isOpen)

  useEffect(() => {
    const handleScroll = () => {
      // 300px 이상 스크롤하면 버튼 표시
      setIsVisible(window.scrollY > 300)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // PC 버전 동적 위치 계산 (본문 컨테이너 오른쪽 끝 기준)
  useEffect(() => {
    const updatePosition = () => {
      const mainContent = document.querySelector('[data-main-content]') as HTMLElement
      if (mainContent) {
        const rect = mainContent.getBoundingClientRect()
        setPcLeftPosition(rect.right + 12)
      }
    }

    updatePosition()
    window.addEventListener('resize', updatePosition)

    const observer = new MutationObserver(updatePosition)
    observer.observe(document.body, { childList: true, subtree: true })

    return () => {
      window.removeEventListener('resize', updatePosition)
      observer.disconnect()
    }
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (!isMounted) return null

  // 플로팅 바 열림: 195px, 닫힘: 60px (모바일)
  const bottomPosition = isFloatingBarOpen ? 'bottom-[195px]' : 'bottom-[60px]'

  return createPortal(
    <>
      {/* 모바일 버전 */}
      <div
        className={`pointer-events-none fixed inset-x-0 ${bottomPosition} z-40 mx-auto w-full max-w-[360px] px-4 transition-all duration-300 xl:hidden`}
      >
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
              className="pointer-events-auto ml-auto flex h-9 w-9 items-center justify-center rounded-full border border-gray-300 bg-white text-gray-700 shadow-lg transition-colors hover:bg-gray-50 hover:text-orange-500"
              aria-label="상단으로 이동"
              title="상단으로 이동"
            >
              <FiArrowUp className="size-4" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* PC 버전 - 장바구니 사이드바와 같은 가로 위치, 하단 고정 */}
      {pcLeftPosition && (
        <div className="pointer-events-none fixed bottom-10 z-40 hidden xl:block" style={{ left: pcLeftPosition }}>
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
                className="pointer-events-auto flex h-10 w-10 items-center justify-center rounded-full border border-gray-300 bg-white text-gray-700 shadow-lg transition-colors hover:bg-gray-50 hover:text-orange-500"
                aria-label="상단으로 이동"
                title="상단으로 이동"
              >
                <FiArrowUp className="size-5" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      )}
    </>,
    document.body,
  )
}
