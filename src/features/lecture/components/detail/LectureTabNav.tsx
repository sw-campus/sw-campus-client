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
    <div className="w-full">
      <nav className="no-scrollbar flex w-full items-center gap-8 overflow-x-auto py-5">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => scrollToSection(tab.id)}
            aria-current={activeTab === tab.id ? 'page' : undefined}
            className={cn(
              'relative shrink-0 px-1 text-base transition-colors duration-200 sm:text-lg',
              activeTab === tab.id ? 'font-extrabold text-gray-900' : 'font-semibold text-gray-500 hover:text-gray-700',
            )}
          >
            <span>{tab.label}</span>
            {activeTab === tab.id && (
              <span className="absolute -bottom-1 left-1/2 h-0.75 w-9 -translate-x-1/2 rounded-full bg-gray-900 sm:w-10" />
            )}
          </button>
        ))}
      </nav>
    </div>
  )
}
