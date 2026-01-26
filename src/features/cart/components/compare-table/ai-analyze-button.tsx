'use client'

import { motion } from 'framer-motion'
import { FiLoader } from 'react-icons/fi'
import { PiRobotDuotone } from 'react-icons/pi'

import { cn } from '@/lib/utils'

interface AiAnalyzeButtonProps {
  isEnabled: boolean
  isLoading: boolean
  hasResult: boolean
  onAnalyze: () => void
  onClear?: () => void
  disabledReason?: string
  className?: string
}

export function AiAnalyzeButton({
  isEnabled,
  isLoading,
  hasResult,
  onAnalyze,
  onClear,
  disabledReason = '두 강의를 모두 선택해주세요',
  className,
}: AiAnalyzeButtonProps) {
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

  const getButtonText = () => {
    if (isLoading) return 'AI가 분석하고 있어요...'
    if (hasResult) return '분석 완료! 다시 분석하려면 클릭하세요'
    if (!isEnabled) return disabledReason
    return 'AI에게 물어보고, 최적의 답을 발견하세요'
  }

  return (
    <motion.button
      type="button"
      onClick={handleClick}
      disabled={(!isEnabled && !hasResult) || isLoading}
      whileHover={isEnabled || hasResult ? { scale: 1.01 } : undefined}
      whileTap={isEnabled || hasResult ? { scale: 0.99 } : undefined}
      className={cn(
        'relative flex h-[65px] w-full items-center justify-center gap-2 rounded-xl transition-all md:h-[59px] md:gap-3 md:max-w-[348px]',
        // Enabled/Success state - yellow
        (isEnabled || hasResult) && !isLoading && 'bg-yellow-400 hover:bg-yellow-500 active:bg-yellow-600',
        // Loading state
        isLoading && 'bg-yellow-300',
        // Disabled state
        !isEnabled && !hasResult && !isLoading && 'cursor-not-allowed bg-gray-200 text-gray-400',
        // Text colors
        (isEnabled || hasResult || isLoading) && 'text-gray-900',
        className,
      )}
    >
      {/* Icon */}
      {isLoading ? (
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}>
          <FiLoader className="size-5" />
        </motion.div>
      ) : (
        <PiRobotDuotone className="size-6" />
      )}

      {/* Text */}
      <span className="text-sm font-semibold md:text-base">{getButtonText()}</span>

      {/* Success indicator */}
      {hasResult && !isLoading && (
        <span className="absolute right-4 flex size-6 items-center justify-center rounded-full bg-green-500 text-xs text-white">
          ✓
        </span>
      )}
    </motion.button>
  )
}
