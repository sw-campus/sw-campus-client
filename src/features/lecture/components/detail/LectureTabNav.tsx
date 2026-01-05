'use client'

import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'

import { cn } from '@/lib/utils'

const TABS = [
  { id: 'overview', label: '모집개요' },
  { id: 'intro', label: '강의 소개' },
  { id: 'curriculum', label: '커리큘럼' },
  { id: 'review', label: '후기' },
]

export default function LectureTabNav() {
  const [activeTab, setActiveTab] = useState('overview')
  const [isFixed, setIsFixed] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [tabPosition, setTabPosition] = useState({ left: 0, width: 0 })
  const placeholderRef = useRef<HTMLDivElement>(null)

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      const headerOffset = 80 // 탭 높이 + 여유공간
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      })
      setActiveTab(id)
    }
  }

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const updatePosition = () => {
      if (placeholderRef.current) {
        const rect = placeholderRef.current.getBoundingClientRect()
        setTabPosition({
          left: rect.left + window.scrollX,
          width: rect.width,
        })
      }
    }

    const handleScroll = () => {
      // Fixed 상태 체크: placeholder가 뷰포트 상단에 도달하면 고정
      if (placeholderRef.current) {
        const rect = placeholderRef.current.getBoundingClientRect()
        setIsFixed(rect.top <= 0)
        // 위치 업데이트
        setTabPosition({
          left: rect.left + window.scrollX,
          width: rect.width,
        })
      }

      // Scroll spy functionality
      const headerOffset = 100
      let current = ''

      for (const tab of TABS) {
        const element = document.getElementById(tab.id)
        if (element) {
          const rect = element.getBoundingClientRect()
          if (rect.top <= headerOffset + 50) {
            current = tab.id
          }
        }
      }
      if (current) setActiveTab(current)
    }

    // 초기 위치 계산
    updatePosition()

    window.addEventListener('scroll', handleScroll)
    window.addEventListener('resize', updatePosition)
    handleScroll() // 초기 상태 체크

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', updatePosition)
    }
  }, [])

  const tabContent = (
    <nav className="no-scrollbar flex w-full items-center gap-2 overflow-x-auto px-4 py-3 sm:gap-4 sm:px-6">
      {TABS.map(tab => (
        <button
          key={tab.id}
          onClick={() => scrollToSection(tab.id)}
          aria-current={activeTab === tab.id ? 'page' : undefined}
          type="button"
          className={cn(
            'group relative shrink-0 rounded-xl px-4 py-2 text-base transition-all duration-200 sm:px-5 sm:text-lg',
            activeTab === tab.id
              ? 'bg-white font-extrabold text-gray-900 shadow-sm ring-1 ring-gray-200'
              : 'font-semibold text-gray-500 hover:bg-gray-100/50 hover:text-gray-700',
          )}
        >
          <span>{tab.label}</span>
        </button>
      ))}
    </nav>
  )

  return (
    <>
      {/* Placeholder - 고정될 때 공간 유지 */}
      <div ref={placeholderRef} className={isFixed ? 'h-[56px]' : ''}>
        {!isFixed && (
          <div className="rounded-t-2xl bg-white/90 ring-1 ring-white/30 backdrop-blur-xl">
            {tabContent}
          </div>
        )}
      </div>

      {/* Fixed 탭 네비게이션 - Portal을 사용해 body에 직접 렌더링 */}
      {mounted && isFixed && createPortal(
        <div 
          className="fixed top-0 z-[9999] rounded-t-2xl border-b border-gray-200/50 bg-white/95 shadow-sm backdrop-blur-xl"
          style={{
            left: `${tabPosition.left}px`,
            width: `${tabPosition.width}px`,
          }}
        >
          {tabContent}
        </div>,
        document.body
      )}
    </>
  )
}
