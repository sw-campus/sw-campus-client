'use client'

import { useEffect, useState } from 'react'

import { AnimatePresence, motion } from 'framer-motion'
import { createPortal } from 'react-dom'
import { FiLoader } from 'react-icons/fi'

import { cn } from '@/lib/utils'

interface AiFloatingButtonProps {
  isEnabled: boolean
  isLoading: boolean
  hasResult: boolean
  onAnalyze: () => void
  onClear?: () => void
  disabledReason?: string
}

export function AiFloatingButton({
  isEnabled,
  isLoading,
  hasResult,
  onAnalyze,
  onClear,
  disabledReason = '두 강의를 모두 선택해주세요',
}: AiFloatingButtonProps) {
  const [mounted, setMounted] = useState(false)
  const [showCelebration, setShowCelebration] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true)
    }, 0)
    return () => clearTimeout(timer)
  }, [])

  // Trigger celebration when result appears
  useEffect(() => {
    if (hasResult) {
      // Defer to avoid concurrent render warning
      const t1 = setTimeout(() => setShowCelebration(true), 0)
      const t2 = setTimeout(() => setShowCelebration(false), 2000)
      return () => {
        clearTimeout(t1)
        clearTimeout(t2)
      }
    }
  }, [hasResult])

  const handleClick = () => {
    if (isLoading) return

    if (hasResult && onClear) {
      onClear()
      return
    }

    if (isEnabled && !hasResult) {
      onAnalyze()
    }
  }

  if (!mounted) return null

  return (
    <>
      {createPortal(<AnimatePresence>{showCelebration && <CelebrationEffect />}</AnimatePresence>, document.body)}
      {createPortal(
        <motion.button
          type="button"
          onClick={handleClick}
          disabled={(!isEnabled && !hasResult) || isLoading}
          title={
            isLoading ? 'AI 분석 중...' : hasResult ? '분석 완료' : isEnabled ? 'AI 비교분석 시작' : disabledReason
          }
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{
            opacity: isEnabled || hasResult || isLoading ? 1 : 0,
            scale: isEnabled || hasResult || isLoading ? 1 : 0.8,
            y: isEnabled || hasResult || isLoading ? [0, -8, 0] : 0,
          }}
          transition={{
            opacity: { duration: 0.3 },
            scale: { duration: 0.3 },
            y: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={cn(
            // Position
            'fixed right-10 bottom-10 z-100',
            'flex flex-col items-center justify-center',
            'h-[90px] w-[90px] rounded-full',
            // Default Glass
            !hasResult && 'border border-white/20 bg-white/10 backdrop-blur-md',
            !hasResult && 'shadow-[0_8px_32px_0_rgba(251,146,60,0.3)]',
            // Success (Radiant Gold)
            hasResult && 'border border-orange-300/50 bg-linear-to-br from-orange-500 to-yellow-400',
            hasResult && 'shadow-[0_0_50px_rgba(251,146,60,0.6)]',
            // Interaction
            'transition-all duration-500',
            'disabled:pointer-events-none disabled:opacity-0',
            (isEnabled || hasResult) && !isLoading ? 'cursor-pointer' : 'cursor-default',
          )}
        >
          {/* 1. Loading State */}
          {isLoading && (
            <div className="absolute inset-0 overflow-hidden rounded-full">
              <motion.div
                className="absolute inset-0"
                animate={{
                  background: [
                    'radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 1) 0%, rgba(251, 146, 60, 0.8) 20%, transparent 60%)',
                    'radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 1) 0%, rgba(251, 146, 60, 0.8) 40%, transparent 70%)',
                    'radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 1) 0%, rgba(251, 146, 60, 0.8) 20%, transparent 60%)',
                  ],
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
              <motion.div
                className="absolute inset-0 opacity-50"
                style={{
                  background: 'conic-gradient(from 0deg, transparent, #fb923c, #f97316, transparent)',
                }}
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              />
            </div>
          )}

          {/* 2. Success State: Radiant Portal (Gold) */}
          {hasResult && !isLoading && <RadiantPortal />}

          {/* 3. Default State */}
          {!hasResult && !isLoading && (
            <>
              <motion.div
                className="absolute inset-0 rounded-full"
                animate={{
                  background: [
                    'radial-gradient(circle at 30% 30%, rgba(251, 146, 60, 0.4), transparent 70%)',
                    'radial-gradient(circle at 70% 70%, rgba(251, 146, 60, 0.4), transparent 70%)',
                    'radial-gradient(circle at 30% 30%, rgba(251, 146, 60, 0.4), transparent 70%)',
                  ],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
              <motion.div
                className="absolute inset-[2px] rounded-full border border-white/30 border-t-white/80 border-l-transparent"
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
              />
              <div className="absolute top-2 left-4 h-8 w-12 -rotate-45 rounded-full bg-linear-to-b from-white/40 to-transparent blur-[1px]" />
            </>
          )}

          {/* Content */}
          <div className="relative z-10 flex flex-col items-center drop-shadow-md">
            {isLoading ? (
              <>
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 0.5, repeat: Infinity, ease: 'linear' }}>
                  <FiLoader className="size-6 text-white" />
                </motion.div>
                <span className="mt-1 text-[10px] font-medium text-white/90">분석중...</span>
              </>
            ) : (
              <>
                <span
                  className={cn(
                    'text-xl font-bold tracking-tight transition-colors duration-500',
                    hasResult ? 'text-white' : 'text-white',
                  )}
                >
                  AI
                </span>
                <span
                  className={cn(
                    'text-[10px] font-medium transition-colors duration-500',
                    hasResult ? 'text-white/90' : 'text-white/80',
                  )}
                >
                  {hasResult ? '완료' : '비교분석'}
                </span>
              </>
            )}
          </div>

          {/* Notification Dot */}
          {isEnabled && !isLoading && !hasResult && (
            <span className="absolute top-1 right-2 flex h-4 w-4">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-orange-400 opacity-75" />
              <span className="relative inline-flex h-4 w-4 items-center justify-center rounded-full border border-white/20 bg-orange-500 text-[8px] text-white shadow-sm">
                !
              </span>
            </span>
          )}

          {/* Success Check */}
          {hasResult && (
            <span className="absolute top-0 right-0 flex h-6 w-6 items-center justify-center rounded-full border border-white/20 bg-emerald-500 text-xs text-white shadow-[0_0_10px_rgba(255,255,255,0.8)] backdrop-blur-sm">
              ✓
            </span>
          )}
        </motion.button>,
        document.body,
      )}
    </>
  )
}

function RadiantPortal() {
  const [rays, setRays] = useState<{ id: number; rotate: number; delay: number }[]>([])

  useEffect(() => {
    const timer = setTimeout(() => {
      setRays(
        [...Array(8)].map((_, i) => ({
          id: i,
          rotate: i * 45,
          delay: i * 0.1,
        })),
      )
    }, 0)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="absolute inset-0 overflow-hidden rounded-full opacity-80 mix-blend-overlay">
      {/* Repeating Rays */}
      {rays.map(ray => (
        <motion.div
          key={ray.id}
          className="absolute top-1/2 left-1/2 h-[120%] w-2 origin-top bg-linear-to-b from-white/40 to-transparent"
          style={{ rotate: ray.rotate, x: '-50%', y: '-50%' }}
          animate={{ rotate: ray.rotate + 360 }}
          transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
        />
      ))}
      <div className="absolute inset-2 rounded-full border-2 border-white/30" />
    </div>
  )
}

function CelebrationEffect() {
  const [particles, setParticles] = useState<
    { id: number; x: number; y: number; color: string; size: number; duration: number }[]
  >([])

  useEffect(() => {
    // Avoid concurrent render
    const timer = setTimeout(() => {
      const colors = ['#f97316', '#fbbf24', '#ffffff', '#fb923c'] // Orange-500, Amber-400, White, Orange-400
      setParticles(
        [...Array(60)].map((_, i) => ({
          id: i,
          x: (Math.random() - 0.5) * window.innerWidth * 1.2, // Spread wider
          y: (Math.random() - 0.5) * window.innerHeight * 1.2,
          color: colors[Math.floor(Math.random() * colors.length)],
          size: Math.random() * 6 + 2, // 2px to 8px
          duration: Math.random() * 1 + 1, // 1s to 2s
        })),
      )
    }, 0)
    return () => clearTimeout(timer)
  }, [])

  if (particles.length === 0) return null

  return (
    <div className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center overflow-hidden">
      {/* 1. Flash Shockwave */}
      <motion.div
        className="absolute inset-0 bg-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.8, 0] }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      />

      {/* 2. Expanding Ring Shockwave */}
      <motion.div
        className="absolute rounded-full border-4 border-orange-300"
        initial={{ width: 0, height: 0, opacity: 1, borderWidth: 50 }}
        animate={{
          width: '150vw',
          height: '150vw',
          opacity: 0,
          borderWidth: 0,
        }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
      />

      {/* 3. Massive Particle Explosion */}
      {particles.map(p => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            backgroundColor: p.color,
            width: p.size,
            height: p.size,
            boxShadow: `0 0 ${p.size * 2}px ${p.color}`,
          }}
          initial={{ x: 0, y: 0, scale: 0 }}
          animate={{
            x: p.x,
            y: p.y,
            scale: [0, 1, 0], // Pop in then shrink out
            opacity: [1, 1, 0],
          }}
          transition={{
            duration: p.duration,
            ease: [0.22, 1, 0.36, 1], // Custom cubic bezier for explosion physics
          }}
        />
      ))}
    </div>
  )
}
