'use client'

import { useState, useEffect, useRef } from 'react'

import { useRouter } from 'next/navigation'

import { FloatingCartPanel } from '@/features/bootcamp-list'
import { useUnifiedCart } from '@/features/cart/hooks/use-unified-cart'
import { useUnifiedRemoveFromCart } from '@/features/cart/hooks/use-unified-remove-from-cart'
import type { LectureDetail } from '@/features/lecture/api/lecture-api.types'
import { useLectureDetailQuery } from '@/features/lecture/hooks/use-lecture-detail-query'

import { LectureDetailMobile } from './detail/lecture-detail-mobile'
import { LectureDetailPC } from './detail/lecture-detail-pc'
import { mapApiToUIData, type TabType } from './detail/map-lecture-ui-data'

interface Props {
  lectureId: string
  initialData?: LectureDetail
}

export default function LectureDetailPage({ lectureId, initialData }: Props) {
  const router = useRouter()

  // API 호출
  const { data: lectureData, isLoading: isLectureLoading } = useLectureDetailQuery(lectureId, {
    initialData,
  })

  const [activeTab, setActiveTab] = useState<TabType>('overview')
  const [isCurriculumOpen, setIsCurriculumOpen] = useState(true)
  const [isInCart, setIsInCart] = useState(false)
  const [isFloatingBarOpen, setIsFloatingBarOpen] = useState(false)
  const [isHeaderFixed, setIsHeaderFixed] = useState(false)
  const [isScrolling, setIsScrolling] = useState(false)

  const headerRef = useRef<HTMLDivElement>(null)
  const headerPlaceholderRef = useRef<HTMLDivElement>(null)
  const mainContentRef = useRef<HTMLDivElement>(null)
  const heroRef = useRef<HTMLDivElement>(null)

  // 장바구니 훅
  const { items: cartItems } = useUnifiedCart()
  const { mutate: removeFromCart } = useUnifiedRemoveFromCart()

  // 비교 페이지로 이동
  const handleGoToCompare = () => {
    router.push('/cart/compare')
  }

  // API 데이터를 UI 형태로 변환
  const lecture = mapApiToUIData(lectureData)

  // 스크롤 위치에 따라 헤더 고정 여부 결정 (모바일 전용)
  useEffect(() => {
    const handleScroll = () => {
      // lg 이상에서는 헤더 고정 안 함
      if (window.innerWidth >= 1024) {
        setIsHeaderFixed(false)
        return
      }
      if (headerPlaceholderRef.current) {
        const rect = headerPlaceholderRef.current.getBoundingClientRect()
        setIsHeaderFixed(rect.top <= 0)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleScroll)
    }
  }, [])

  // 스크롤 시 현재 보이는 섹션에 맞게 탭 자동 변경
  useEffect(() => {
    const sectionIds: TabType[] = ['overview', 'intro', 'curriculum', 'review']

    const handleScrollForTabs = () => {
      // 프로그래매틱 스크롤 중에는 자동 탭 변경 방지
      if (isScrolling) return

      const isMobile = window.innerWidth < 1024
      const prefix = isMobile ? 'mobile-' : ''
      // PC: 헤더(80px) + 탭(56px) + 여유 = 200px, 모바일: 200px
      const headerOffset = isMobile ? 200 : 200
      const scrollPosition = window.scrollY + headerOffset

      // 각 섹션의 절대 위치 계산
      const sectionPositions: { id: TabType; offsetTop: number }[] = []
      for (const id of sectionIds) {
        const element = document.getElementById(prefix + id)
        if (element) {
          sectionPositions.push({ id, offsetTop: element.offsetTop })
        }
      }

      // 페이지 끝에 도달했는지 확인
      const isAtBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 100

      // 페이지 끝이면 마지막 섹션(후기) 활성화
      if (isAtBottom && sectionPositions.length > 0) {
        setActiveTab('review')
        return
      }

      // 현재 스크롤 위치보다 위에 있는 섹션 중 가장 마지막 섹션
      let activeSection: TabType = 'overview'
      for (const section of sectionPositions) {
        if (scrollPosition >= section.offsetTop) {
          activeSection = section.id
        }
      }

      setActiveTab(activeSection)
    }

    window.addEventListener('scroll', handleScrollForTabs, { passive: true })
    handleScrollForTabs() // 초기 실행

    return () => window.removeEventListener('scroll', handleScrollForTabs)
  }, [isScrolling])

  const scrollToSection = (tabId: TabType) => {
    setIsScrolling(true)
    setActiveTab(tabId)
    const isMobile = window.innerWidth < 1024
    const prefix = isMobile ? 'mobile-' : ''
    const element = document.getElementById(prefix + tabId)
    if (element) {
      // PC: 헤더(80px) + 탭(56px) + 여백 = 150px, 모바일: 160px
      const offset = isMobile ? 160 : 150
      const elementPosition = element.getBoundingClientRect().top + window.scrollY
      window.scrollTo({
        top: elementPosition - offset,
        behavior: 'smooth',
      })
      // 스크롤 애니메이션 완료 후 isScrolling 해제 (긴 스크롤을 위해 1.2초)
      setTimeout(() => {
        setIsScrolling(false)
      }, 1200)
    } else {
      setIsScrolling(false)
    }
  }

  // 로딩 상태 처리
  if (isLectureLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="text-lg text-gray-500">강의 정보를 불러오는 중...</div>
        </div>
      </div>
    )
  }

  // 데이터가 없는 경우
  if (!lectureData) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="text-lg text-gray-500">강의를 찾을 수 없습니다.</div>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* PC 레이아웃 (lg 이상) */}
      <LectureDetailPC
        lecture={lecture}
        activeTab={activeTab}
        isCurriculumOpen={isCurriculumOpen}
        isInCart={isInCart}
        mainContentRef={mainContentRef}
        heroRef={heroRef}
        onTabClick={scrollToSection}
        onCurriculumToggle={() => setIsCurriculumOpen(!isCurriculumOpen)}
        onCartToggle={() => setIsInCart(!isInCart)}
        onGoToCompare={handleGoToCompare}
      />

      {/* 모바일 레이아웃 (lg 미만) */}
      <LectureDetailMobile
        lecture={lecture}
        activeTab={activeTab}
        isCurriculumOpen={isCurriculumOpen}
        isInCart={isInCart}
        isHeaderFixed={isHeaderFixed}
        headerRef={headerRef}
        headerPlaceholderRef={headerPlaceholderRef}
        onTabClick={scrollToSection}
        onCurriculumToggle={() => setIsCurriculumOpen(!isCurriculumOpen)}
        onCartToggle={() => setIsInCart(!isInCart)}
        onGoToCompare={handleGoToCompare}
      />

      {/* 플로팅 관심 항목 바 (모바일: 하단, md+: 사이드) */}
      <FloatingCartPanel
        items={cartItems}
        onRemove={id => removeFromCart(id)}
        onCompare={handleGoToCompare}
        isOpen={isFloatingBarOpen}
        onToggleOpen={() => setIsFloatingBarOpen(prev => !prev)}
      />
    </>
  )
}
