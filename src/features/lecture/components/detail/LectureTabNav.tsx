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
    <div className="sticky top-0 z-20 w-full border-b border-gray-200 bg-white/80 backdrop-blur-md">
      <div className="no-scrollbar flex w-full gap-8 overflow-x-auto px-6 md:px-8">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => scrollToSection(tab.id)}
            className={cn(
              'relative shrink-0 border-b-2 pt-4 pb-4 text-sm font-bold transition-all duration-200',
              activeTab === tab.id
                ? 'border-gray-900 text-gray-900'
                : 'border-transparent text-gray-400 hover:text-gray-700',
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  )
}
