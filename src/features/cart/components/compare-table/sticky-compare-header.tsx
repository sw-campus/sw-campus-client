'use client'

import { useEffect, useRef, useState } from 'react'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { createPortal } from 'react-dom'
import { FiLoader } from 'react-icons/fi'
import { PiRobotDuotone } from 'react-icons/pi'

import { useIsMounted } from '@/hooks/use-is-mounted'
import { cn } from '@/lib/utils'

interface StickyCompareHeaderProps {
  leftTitle: string
  leftThumbnail: string | null
  rightTitle: string
  rightThumbnail: string | null
  leftId?: string | null
  rightId?: string | null
  canAnalyze: boolean
  isAiLoading: boolean
  hasAiResult: boolean
  onAiAnalyze: () => void
  triggerRef: React.RefObject<HTMLDivElement | null>
  onStickyChange: (isSticky: boolean) => void
}

// 모바일용 미니 카드 (Figma 스타일) - 외부 컴포넌트로 분리
function MobileMiniCard({ title, lectureId }: { title: string; lectureId?: string | null }) {
  const hasSelection = Boolean(title)
  return (
    <div className="flex flex-1 flex-col gap-3 overflow-hidden rounded-[12px] bg-white p-3 shadow-[4px_4px_20px_0px_rgba(161,161,170,0.25)]">
      <p
        className={cn(
          'truncate text-center text-sm font-bold text-[#020202]',
          !hasSelection && 'text-muted-foreground',
        )}
      >
        {hasSelection ? title : '미선택'}
      </p>
      {hasSelection && lectureId ? (
        <Link
          href={`/lectures/${lectureId}`}
          className="flex h-8 w-full items-center justify-center rounded-[8px] bg-[#f9f9f9] text-xs text-[#020202] hover:bg-[#f0f0f0]"
        >
          자세히 보기
        </Link>
      ) : (
        <div className="flex h-8 w-full items-center justify-center rounded-[8px] bg-[#f9f9f9] text-xs text-muted-foreground">
          자세히 보기
        </div>
      )}
    </div>
  )
}

// 공용 AI 버튼 - 모바일/데스크톱 공유 (Figma 스타일)
function StickyAiButton({
  canAnalyze,
  isLoading,
  hasResult,
  onAnalyze,
  className,
}: {
  canAnalyze: boolean
  isLoading: boolean
  hasResult: boolean
  onAnalyze: () => void
  className?: string
}) {
  if (hasResult) return null

  const isDisabled = !canAnalyze || isLoading

  const getButtonText = () => {
    if (isLoading) return 'AI가 분석하고 있어요...'
    if (!canAnalyze) return '두 강의를 선택해주세요'
    return 'AI에게 물어보고, 최적의 답을 발견하세요'
  }

  return (
    <motion.button
      type="button"
      onClick={onAnalyze}
      disabled={isDisabled}
      whileHover={canAnalyze ? { scale: 1.01 } : undefined}
      whileTap={canAnalyze ? { scale: 0.99 } : undefined}
      className={cn(
        'relative flex w-full items-center justify-center gap-2 rounded-[8px] border-2 border-[#feb706] transition-all',
        'h-[65px] text-sm md:h-[95px] md:text-xl',
        // Enabled state - yellow gradient (Figma 스타일)
        canAnalyze && !isLoading && 'bg-gradient-to-r from-[#fffdf6] via-[#ffe8b0] to-[#ffd454]',
        // Loading state
        isLoading && 'bg-[#ffe8b0]',
        // Disabled state
        !canAnalyze && !isLoading && 'cursor-not-allowed border-gray-300 bg-gray-200 text-gray-400',
        // Text colors
        (canAnalyze || isLoading) && 'text-[#020202]',
        className,
      )}
    >
      {/* Icon - 모바일만 표시 */}
      {isLoading ? (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
          className="md:hidden"
        >
          <FiLoader className="size-5" />
        </motion.div>
      ) : (
        <PiRobotDuotone className="size-6 md:hidden" />
      )}

      {/* Text */}
      <span className="font-semibold">{getButtonText()}</span>
    </motion.button>
  )
}

// 데스크톱용 미니 카드 (Figma 스타일: 제목 + 자세히 보기 버튼)
function DesktopMiniCard({ title, lectureId }: { title: string; lectureId?: string | null }) {
  const hasSelection = Boolean(title)
  return (
    <div className="flex flex-1 flex-col gap-3 overflow-hidden rounded-[12px] bg-white p-6 shadow-[4px_4px_20px_0px_rgba(161,161,170,0.25)]">
      <p
        className={cn(
          'truncate text-center text-xl font-bold text-[#020202]',
          !hasSelection && 'text-muted-foreground',
        )}
      >
        {hasSelection ? title : '미선택'}
      </p>
      {hasSelection && lectureId ? (
        <Link
          href={`/lectures/${lectureId}`}
          className="flex h-12 w-full items-center justify-center rounded-[8px] bg-[#f9f9f9] text-base text-[#020202] hover:bg-[#f0f0f0]"
        >
          자세히 보기
        </Link>
      ) : (
        <div className="flex h-12 w-full items-center justify-center rounded-[8px] bg-[#f9f9f9] text-base text-muted-foreground">
          자세히 보기
        </div>
      )}
    </div>
  )
}

/**
 * 비교 테이블 Sticky 헤더
 *
 * 모바일/데스크톱 통일된 Figma 스타일:
 * - VS 뱃지: 검정 배경 + 노란 텍스트
 * - AI 버튼: 노란 배경 + 로봇 아이콘
 */
export function StickyCompareHeader({
  leftTitle,
  leftThumbnail: _leftThumbnail,
  rightTitle,
  rightThumbnail: _rightThumbnail,
  leftId,
  rightId,
  canAnalyze,
  isAiLoading,
  hasAiResult,
  onAiAnalyze,
  triggerRef,
  onStickyChange,
}: StickyCompareHeaderProps) {
  const isMounted = useIsMounted()
  const [isSticky, setIsSticky] = useState(false)
  const [headerPosition, setHeaderPosition] = useState({ left: 0, width: 0 })
  const observerRef = useRef<IntersectionObserver | null>(null)

  // Sticky 상태 변경 시 부모에게 알림
  useEffect(() => {
    onStickyChange(isSticky)
  }, [isSticky, onStickyChange])

  // Intersection Observer로 sticky 상태 감지
  useEffect(() => {
    if (!triggerRef.current) return

    const updatePosition = () => {
      if (triggerRef.current) {
        const rect = triggerRef.current.getBoundingClientRect()
        setHeaderPosition({
          left: rect.left + window.scrollX,
          width: rect.width,
        })
      }
    }

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        const shouldBeSticky = !entry.isIntersecting && entry.boundingClientRect.top < 0
        setIsSticky(shouldBeSticky)
        if (shouldBeSticky) {
          updatePosition()
        }
      },
      {
        threshold: 0,
        rootMargin: '0px 0px 0px 0px',
      },
    )

    observerRef.current.observe(triggerRef.current)

    const handleScroll = () => {
      if (isSticky) {
        updatePosition()
      }
    }

    const handleResize = () => {
      updatePosition()
    }

    window.addEventListener('scroll', handleScroll)
    window.addEventListener('resize', handleResize)
    updatePosition()

    return () => {
      observerRef.current?.disconnect()
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleResize)
    }
  }, [triggerRef, isSticky])

  // 모바일 Sticky 헤더 콘텐츠 (Figma 스타일)
  const mobileHeaderContent = (
    <div className="flex flex-col gap-4 p-4">
      {/* 카드 영역 */}
      <div className="relative flex items-center gap-4">
        <MobileMiniCard title={leftTitle} lectureId={leftId} />
        <MobileMiniCard title={rightTitle} lectureId={rightId} />
        {/* VS 뱃지 - 중앙 (45px) */}
        <div className="absolute left-1/2 top-1/2 flex size-[45px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[#020202]">
          <span className="text-base font-bold text-[#feb706]">VS</span>
        </div>
      </div>
      {/* AI 버튼 */}
      <StickyAiButton
        canAnalyze={canAnalyze}
        isLoading={isAiLoading}
        hasResult={hasAiResult}
        onAnalyze={onAiAnalyze}
      />
    </div>
  )

  // 데스크톱 Sticky 헤더 콘텐츠 (Figma 스타일)
  const desktopHeaderContent = (
    <div className="flex flex-col gap-6 p-6">
      {/* 카드 영역 */}
      <div className="relative flex items-center gap-6">
        <DesktopMiniCard title={leftTitle} lectureId={leftId} />
        <DesktopMiniCard title={rightTitle} lectureId={rightId} />
        {/* VS 뱃지 - 중앙 (80px) */}
        <div className="absolute left-1/2 top-1/2 flex size-[80px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[#020202]">
          <span className="text-2xl font-bold text-[#feb706]">VS</span>
        </div>
      </div>
      {/* AI 버튼 */}
      <StickyAiButton
        canAnalyze={canAnalyze}
        isLoading={isAiLoading}
        hasResult={hasAiResult}
        onAnalyze={onAiAnalyze}
      />
    </div>
  )

  // Sticky 헤더 (Portal로 body에 렌더링)
  const stickyHeader =
    isMounted &&
    isSticky &&
    createPortal(
      <>
        {/* 모바일 Sticky 헤더 */}
        <div
          className="fixed top-0 z-[var(--z-fixed)] bg-[#fafafa] shadow-lg md:hidden"
          style={{
            left: 0,
            right: 0,
            width: '100%',
          }}
        >
          {mobileHeaderContent}
        </div>
        {/* 데스크톱 Sticky 헤더 */}
        <div
          className="fixed top-0 z-[var(--z-fixed)] hidden rounded-b-2xl border-b border-gray-200/50 bg-white/95 shadow-lg backdrop-blur-xl md:block"
          style={{
            left: `${headerPosition.left}px`,
            width: `${headerPosition.width}px`,
          }}
        >
          {desktopHeaderContent}
        </div>
      </>,
      document.body,
    )

  return (
    <>
      {/* Placeholder: sticky 상태일 때 공간 확보 */}
      <div className={isSticky ? 'h-[180px] md:h-[140px]' : ''} />
      {stickyHeader}
    </>
  )
}
