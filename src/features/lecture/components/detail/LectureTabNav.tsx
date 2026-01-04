'use client'

import { useState, useEffect } from 'react'

import { cn } from '@/lib/utils'

const TABS = [
  { id: 'overview', label: '모집개요' },
  { id: 'intro', label: '강의 소개' },
  { id: 'curriculum', label: '커리큘럼' },
  { id: 'review', label: '후기' },
]

export default function LectureTabNav() {
  const [activeTab, setActiveTab] = useState('overview')

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      const headerOffset = 80 // 헤더 높이 + 여유공간
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
    // Scroll spy functionality
    const handleScroll = () => {
      const headerOffset = 100
      let current = ''

      for (const tab of TABS) {
        const element = document.getElementById(tab.id)
        if (element) {
          const rect = element.getBoundingClientRect()
          if (rect.top <= headerOffset + 50) {
            // +50 threshold
            current = tab.id
          }
        }
      }
      if (current) setActiveTab(current)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="sticky top-0 z-40 rounded-t-2xl bg-white/70 ring-1 ring-white/30 backdrop-blur-xl">
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
    </div>
  )
}
