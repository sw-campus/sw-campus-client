'use client'

import { useState, useEffect, useRef } from 'react'

import { createPortal } from 'react-dom'

import { useIsMounted } from '@/hooks/use-is-mounted'
import { cn } from '@/lib/utils'

/**
 * 강의 상세 페이지의 탭 네비게이션 컴포넌트
 *
 * ## 주요 기능
 * 1. **Sticky 동작**: 스크롤 시 탭이 화면 상단에 고정됨
 * 2. **Scroll Spy**: 현재 보이는 섹션에 따라 활성 탭 자동 업데이트
 * 3. **Smooth Scroll**: 탭 클릭 시 해당 섹션으로 부드럽게 스크롤
 *
 * ## 구현 방식
 * - **Portal 패턴**: 고정 상태에서는 `createPortal`을 사용해 body에 직접 렌더링
 *   → 부모 요소의 `overflow: hidden` 등에 영향받지 않고 올바른 위치에 표시
 * - **Placeholder**: 탭이 고정될 때 레이아웃 점프를 방지하기 위해 원래 위치에 빈 공간 유지
 * - **위치 동기화**: 스크롤/리사이즈 시 placeholder의 위치를 추적하여 고정 탭의 위치 업데이트
 */

/** 탭 목록 - 페이지 내 섹션 ID와 매핑됨 */
const TABS = [
  { id: 'overview', label: '모집개요' },
  { id: 'intro', label: '강의 소개' },
  { id: 'curriculum', label: '커리큘럼' },
  { id: 'review', label: '후기' },
]

export default function LectureTabNav() {
  // ========================================
  // 상태 관리
  // ========================================
  const [activeTab, setActiveTab] = useState('overview')
  const [isFixed, setIsFixed] = useState(false)
  const isMounted = useIsMounted()
  const [tabPosition, setTabPosition] = useState({ left: 0, width: 0 })
  const placeholderRef = useRef<HTMLDivElement>(null)

  // ========================================
  // 섹션으로 스크롤 이동
  // ========================================
  /**
   * 특정 섹션으로 부드럽게 스크롤하고 해당 탭을 활성화
   * @param id - 이동할 섹션의 DOM ID
   */
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

  // ========================================
  // 스크롤 및 리사이즈 이벤트 처리
  // ========================================
  useEffect(() => {
    /**
     * Placeholder의 현재 위치를 계산하여 고정 탭의 위치 동기화
     * - 리사이즈 시에도 호출되어 반응형 레이아웃 지원
     */
    const updatePosition = () => {
      if (placeholderRef.current) {
        const rect = placeholderRef.current.getBoundingClientRect()
        setTabPosition({
          left: rect.left + window.scrollX,
          width: rect.width,
        })
      }
    }

    /**
     * 스크롤 이벤트 핸들러
     * 1. 고정 상태 결정: placeholder가 뷰포트 상단에 도달하면 고정
     * 2. 위치 업데이트: 고정 탭의 left/width 동기화
     * 3. Scroll Spy: 현재 보이는 섹션 감지하여 활성 탭 업데이트
     */
    const handleScroll = () => {
      // 1. 고정 상태 체크: placeholder가 뷰포트 상단에 도달하면 고정
      if (placeholderRef.current) {
        const rect = placeholderRef.current.getBoundingClientRect()
        setIsFixed(rect.top <= 0)

        // 2. 위치 업데이트 (가로 스크롤 시에도 올바른 위치 유지)
        setTabPosition({
          left: rect.left + window.scrollX,
          width: rect.width,
        })
      }

      // 3. Scroll Spy: 현재 보이는 섹션 감지
      const headerOffset = 100
      let current = ''

      for (const tab of TABS) {
        const element = document.getElementById(tab.id)
        if (element) {
          const rect = element.getBoundingClientRect()
          // 섹션이 헤더 아래로 충분히 스크롤되면 해당 탭 활성화
          if (rect.top <= headerOffset + 50) {
            current = tab.id
          }
        }
      }
      if (current) setActiveTab(current)
    }

    // 초기 위치 계산 및 이벤트 리스너 등록
    updatePosition()

    window.addEventListener('scroll', handleScroll)
    window.addEventListener('resize', updatePosition)
    handleScroll() // 초기 상태 체크

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', updatePosition)
    }
  }, [])

  // ========================================
  // 탭 콘텐츠 (고정/비고정 상태 모두에서 재사용)
  // ========================================
  const tabContent = (
    <nav className="no-scrollbar flex w-full items-center gap-1.5 overflow-x-auto px-3 py-2.5 sm:gap-4 sm:px-6 sm:py-3">
      {TABS.map(tab => (
        <button
          key={tab.id}
          onClick={() => scrollToSection(tab.id)}
          aria-current={activeTab === tab.id ? 'page' : undefined}
          type="button"
          className={cn(
            'group relative shrink-0 rounded-xl px-3 py-2.5 text-sm transition-all duration-200 sm:px-5 sm:py-2 sm:text-lg',
            activeTab === tab.id
              ? 'bg-white font-extrabold text-gray-900 shadow-sm ring-1 ring-gray-200'
              : 'font-semibold text-gray-700 hover:bg-gray-100 hover:text-gray-900',
          )}
        >
          <span>{tab.label}</span>
        </button>
      ))}
    </nav>
  )

  // ========================================
  // 렌더링
  // ========================================
  return (
    <>
      {/* 
        Placeholder 영역
        - 탭이 고정될 때 레이아웃 점프를 방지하기 위해 원래 높이만큼 공간 확보
        - 고정 탭의 위치 계산을 위한 기준점 역할
      */}
      <div ref={placeholderRef} className={isFixed ? 'h-[56px]' : ''}>
        {!isFixed && (
          <div className="rounded-t-2xl bg-white/90 ring-1 ring-white/30 backdrop-blur-xl">{tabContent}</div>
        )}
      </div>

      {/* 
        고정 탭 네비게이션 (Portal)
        - createPortal을 사용해 body에 직접 렌더링
        - 부모 요소의 overflow, transform 등에 영향받지 않음
        - z-[var(--z-fixed)]: globals.css에 정의된 고정 요소용 z-index 토큰 사용
      */}
      {isMounted &&
        isFixed &&
        createPortal(
          <div
            className="fixed top-0 z-[var(--z-fixed)] rounded-t-2xl border-b border-gray-200/50 bg-white/95 shadow-sm backdrop-blur-xl"
            style={{
              left: `${tabPosition.left}px`,
              width: `${tabPosition.width}px`,
            }}
          >
            {tabContent}
          </div>,
          document.body,
        )}
    </>
  )
}
