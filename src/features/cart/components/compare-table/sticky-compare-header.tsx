'use client'

import { useEffect, useRef, useState } from 'react'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { createPortal } from 'react-dom'
import { FiLoader } from 'react-icons/fi'

import { useIsMounted } from '@/hooks/use-is-mounted'
import { cn } from '@/lib/utils'

const AI_BUTTON_GRADIENT =
  'radial-gradient(ellipse at center, #fefdf6 0%, #ffe8b0 50%, #ffe494 75%, #ffdc74 87.5%, #ffd453 100%)'

interface StickyCompareHeaderProps {
  leftTitle: string
  rightTitle: string
  leftId?: string | null
  rightId?: string | null
  canAnalyze: boolean
  isAiLoading: boolean
  hasAiResult: boolean
  onAiAnalyze: () => void
  triggerRef: React.RefObject<HTMLDivElement | null>
  onStickyChange: (isSticky: boolean) => void
}

// ── 모바일용 미니 카드 ──
function MobileMiniCard({ title, lectureId }: { title: string; lectureId?: string | null }) {
  const hasSelection = Boolean(title)
  return (
    <div className="flex min-w-0 flex-1 flex-col gap-3 overflow-clip rounded-xl bg-white p-3 shadow-[4px_4px_20px_0px_rgba(161,161,170,0.25)]">
      <p
        className={cn(
          'truncate text-center text-sm font-bold text-foreground',
          !hasSelection && 'text-muted-foreground',
        )}
      >
        {hasSelection ? title : '미선택'}
      </p>
      {hasSelection && lectureId ? (
        <Link
          href={`/lectures/${lectureId}`}
          className="flex h-8 w-full items-center justify-center rounded-lg bg-[#f9f9f9] text-xs text-foreground hover:bg-[#f0f0f0]"
        >
          자세히 보기
        </Link>
      ) : (
        <div className="flex h-8 w-full items-center justify-center rounded-lg bg-[#f9f9f9] text-xs text-muted-foreground">
          자세히 보기
        </div>
      )}
    </div>
  )
}

// ── 데스크톱용 미니 카드 ──
function DesktopMiniCard({
  title,
  lectureId,
}: {
  title: string
  lectureId?: string | null
}) {
  const hasSelection = Boolean(title)
  return (
    <div className="flex min-w-0 flex-1 flex-col gap-3 overflow-clip rounded-xl bg-white p-6 shadow-[4px_4px_20px_0px_rgba(161,161,170,0.25)]">
      <p
        className={cn(
          'truncate text-center text-xl font-bold text-foreground',
          !hasSelection && 'text-muted-foreground',
        )}
      >
        {hasSelection ? title : '미선택'}
      </p>
      {hasSelection && lectureId ? (
        <Link
          href={`/lectures/${lectureId}`}
          className="flex h-12 w-full items-center justify-center rounded-lg bg-[#f9f9f9] text-base text-foreground hover:bg-[#f0f0f0]"
        >
          자세히 보기
        </Link>
      ) : (
        <div className="flex h-12 w-full items-center justify-center rounded-lg bg-[#f9f9f9] text-base text-muted-foreground">
          자세히 보기
        </div>
      )}
    </div>
  )
}

// ── AI 분석 버튼 (gold gradient) ──
function StickyAiButton({
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

  const getButtonText = () => {
    if (isLoading) return 'AI가 분석하고 있어요...'
    if (!canAnalyze) return '두 강의를 선택해주세요'
    return 'AI에게 물어보고, 최적의 답을 발견하세요.'
  }

  return (
    <motion.button
      type="button"
      onClick={onAnalyze}
      disabled={isDisabled}
      whileHover={canAnalyze ? { scale: 1.01 } : undefined}
      whileTap={canAnalyze ? { scale: 0.99 } : undefined}
      className={cn(
        'relative flex w-full items-center justify-center gap-2 rounded-lg border-2 border-brand-gold transition-all',
        'h-[65px] text-sm font-semibold md:h-[95px] md:text-xl',
        (canAnalyze || isLoading) && 'text-foreground',
        !canAnalyze && !isLoading && 'cursor-not-allowed border-border bg-gray-200 text-gray-400',
      )}
      style={(canAnalyze || isLoading) ? { background: AI_BUTTON_GRADIENT } : undefined}
    >
      {isLoading && (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
        >
          <FiLoader className="size-5" />
        </motion.div>
      )}
      <span>{getButtonText()}</span>
    </motion.button>
  )
}

/**
 * 비교 테이블 Sticky 헤더
 *
 * - AI 결과 없음: 카드(제목+버튼) + VS + AI 버튼(gold gradient)
 * - AI 결과 있음: 카드(제목+버튼) + VS (AI 버튼 숨김)
 */
export function StickyCompareHeader({
  leftTitle,
  rightTitle,
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

  // ── 모바일 Sticky 헤더 ──
  const mobileHeaderContent = (
    <div className="flex flex-col gap-4 p-4">
      {/* 카드 영역 */}
      <div className="relative flex items-center gap-4">
        <MobileMiniCard title={leftTitle} lectureId={leftId} />
        <MobileMiniCard title={rightTitle} lectureId={rightId} />
        {/* VS 뱃지 */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
          <div className="flex size-[45px] items-center justify-center rounded-full bg-foreground text-base font-bold text-brand-gold">
            VS
          </div>
        </div>
      </div>
      {/* AI 버튼 (결과 없을 때만) */}
      <StickyAiButton
        canAnalyze={canAnalyze}
        isLoading={isAiLoading}
        hasResult={hasAiResult}
        onAnalyze={onAiAnalyze}
      />
    </div>
  )

  // ── 데스크톱 Sticky 헤더 ──
  const desktopHeaderContent = (
    <div className="flex flex-col gap-6 p-6">
      {/* 카드 영역 */}
      <div className="relative flex items-center gap-6">
        <DesktopMiniCard title={leftTitle} lectureId={leftId} />
        <DesktopMiniCard title={rightTitle} lectureId={rightId} />
        {/* VS 뱃지 */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
          <div className="flex size-[80px] items-center justify-center rounded-full bg-foreground text-2xl font-bold text-brand-gold">
            VS
          </div>
        </div>
      </div>

      {/* AI 버튼 (결과 없을 때만) */}
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
          className="fixed top-0 z-[var(--z-fixed)] bg-white shadow-lg md:hidden"
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
          className="fixed top-0 z-[var(--z-fixed)] hidden rounded-b-2xl bg-white shadow-lg md:block"
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
