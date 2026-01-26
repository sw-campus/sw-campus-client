'use client'

import { useEffect, useRef, useState } from 'react'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { createPortal } from 'react-dom'
import { FiLoader } from 'react-icons/fi'
import { PiRobotDuotone } from 'react-icons/pi'

import { useIsMounted } from '@/hooks/use-is-mounted'
import { cn } from '@/lib/utils'

import { MiniLectureCard } from './mini-lecture-card'

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

// 모바일용 AI 버튼 - AiAnalyzeButton과 동일한 스타일
function MobileAiButton({
  canAnalyze,
  isAiLoading,
  hasAiResult,
  onAiAnalyze,
}: {
  canAnalyze: boolean
  isAiLoading: boolean
  hasAiResult: boolean
  onAiAnalyze: () => void
}) {
  if (hasAiResult) return null

  const isDisabled = !canAnalyze || isAiLoading

  const getButtonText = () => {
    if (isAiLoading) return 'AI가 분석하고 있어요...'
    if (!canAnalyze) return '두 강의를 선택해주세요'
    return 'AI에게 물어보고, 최적의 답을 발견하세요'
  }

  return (
    <motion.button
      type="button"
      onClick={onAiAnalyze}
      disabled={isDisabled}
      whileHover={canAnalyze ? { scale: 1.01 } : undefined}
      whileTap={canAnalyze ? { scale: 0.99 } : undefined}
      className={cn(
        'relative flex h-[65px] w-full items-center justify-center gap-2 rounded-xl transition-all',
        // Enabled state - yellow
        canAnalyze && !isAiLoading && 'bg-yellow-400 hover:bg-yellow-500 active:bg-yellow-600',
        // Loading state
        isAiLoading && 'bg-yellow-300',
        // Disabled state
        !canAnalyze && !isAiLoading && 'cursor-not-allowed bg-gray-200 text-gray-400',
        // Text colors
        (canAnalyze || isAiLoading) && 'text-gray-900',
      )}
    >
      {/* Icon */}
      {isAiLoading ? (
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}>
          <FiLoader className="size-5" />
        </motion.div>
      ) : (
        <PiRobotDuotone className="size-6" />
      )}

      {/* Text */}
      <span className="text-sm font-semibold">{getButtonText()}</span>
    </motion.button>
  )
}

// 데스크톱용 AI 버튼 - 외부 컴포넌트로 분리
function DesktopStickyAiButton({
  canAnalyze,
  isLoading,
  hasResult,
  onAnalyze,
}: {
  canAnalyze: boolean
  isLoading: boolean
  hasResult: boolean
  onAnalyze: () => void
}) {
  if (hasResult) return null

  const isDisabled = !canAnalyze || isLoading

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative">
        {canAnalyze && !isLoading && (
          <>
            <motion.div
              className="absolute inset-0 rounded-full bg-purple-500/30"
              animate={{ scale: [1, 1.4, 1.8], opacity: [0.6, 0.3, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
            />
            <motion.div
              className="absolute inset-0 rounded-full bg-purple-500/20"
              animate={{ scale: [1, 1.6, 2.2], opacity: [0.4, 0.2, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeOut', delay: 0.5 }}
            />
          </>
        )}
        <motion.button
          type="button"
          onClick={onAnalyze}
          disabled={isDisabled}
          whileHover={!isDisabled ? { scale: 1.05 } : undefined}
          whileTap={!isDisabled ? { scale: 0.95 } : undefined}
          className={cn(
            'relative z-10 flex size-20 items-center justify-center rounded-full',
            'bg-gradient-to-br from-purple-500 to-pink-600',
            'border-2 border-white/30 shadow-xl',
            'transition-all duration-300',
            canAnalyze && !isLoading && 'shadow-[0_0_30px_rgba(168,85,247,0.5)]',
            isDisabled && 'cursor-not-allowed opacity-50',
          )}
        >
          {isLoading ? (
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}>
              <FiLoader className="size-7 text-white" />
            </motion.div>
          ) : (
            <span className="text-xl font-bold text-white">AI</span>
          )}
        </motion.button>
      </div>
      <p className="text-sm font-medium text-gray-700">
        {isLoading ? 'AI가 분석 중입니다...' : 'AI에게 물어보고, 최적의 답을 발견하세요.'}
      </p>
    </div>
  )
}

/**
 * 비교 테이블 Sticky 헤더
 *
 * ## 모바일 vs 데스크톱
 * - 모바일: Figma 스타일 (카드 + VS 뱃지 + 전체 너비 AI 버튼)
 * - 데스크톱: 기존 스타일 (썸네일 + 제목 + 원형 AI 버튼)
 */
export function StickyCompareHeader({
  leftTitle,
  leftThumbnail,
  rightTitle,
  rightThumbnail,
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
        {/* VS 뱃지 - 중앙 */}
        <div className="absolute left-1/2 top-1/2 flex size-[45px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[#020202]">
          <span className="text-base font-bold text-[#feb706]">VS</span>
        </div>
      </div>
      {/* AI 버튼 */}
      <MobileAiButton
        canAnalyze={canAnalyze}
        isAiLoading={isAiLoading}
        hasAiResult={hasAiResult}
        onAiAnalyze={onAiAnalyze}
      />
    </div>
  )

  // 데스크톱 Sticky 헤더 콘텐츠 (기존 스타일)
  const desktopHeaderContent = (
    <div className="flex items-center justify-between gap-8 px-8 py-4">
      <MiniLectureCard title={leftTitle} thumbnailUrl={leftThumbnail} side="left" />
      <DesktopStickyAiButton
        canAnalyze={canAnalyze}
        isLoading={isAiLoading}
        hasResult={hasAiResult}
        onAnalyze={onAiAnalyze}
      />
      <MiniLectureCard title={rightTitle} thumbnailUrl={rightThumbnail} side="right" />
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
