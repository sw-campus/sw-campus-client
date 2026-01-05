'use client'

import { useState, useEffect, useRef } from 'react'

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
  const placeholderRef = useRef<HTMLDivElement>(null)

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      const headerOffset = 120 // 헤더 + 탭 높이 + 여유공간
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
    const handleScroll = () => {
      // Fixed 상태 체크
      if (placeholderRef.current) {
        const rect = placeholderRef.current.getBoundingClientRect()
        setIsFixed(rect.top <= 64) // 헤더 높이 (64px = top-16)
      }

      // Scroll spy functionality
      const headerOffset = 130
      let current = ''

      for (const tab of TABS) {
        const element = document.getElementById(tab.id)
        if (element) {
          const rect = element.getBoundingClientRect()
          if (rect.top <= headerOffset) {
            current = tab.id
          }
        }
      }
      if (current) setActiveTab(current)
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll() // 초기 상태 체크
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const tabContent = (
    <nav className="no-scrollbar mx-auto flex w-full max-w-6xl items-center gap-2 overflow-x-auto px-4 py-3 sm:gap-4 sm:px-6 lg:px-6">
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
      <div ref={placeholderRef} className={isFixed ? 'h-[60px]' : ''}>
        {!isFixed && (
          <div className="rounded-t-2xl bg-white/90 ring-1 ring-white/30 backdrop-blur-xl">
            {tabContent}
          </div>
        )}
      </div>

      {/* Fixed 탭 네비게이션 */}
      {isFixed && (
        <div className="fixed left-0 right-0 top-16 z-50 border-b border-gray-200/50 bg-white/95 shadow-sm backdrop-blur-xl">
          {tabContent}
        </div>
      )}
    </>
  )
}
