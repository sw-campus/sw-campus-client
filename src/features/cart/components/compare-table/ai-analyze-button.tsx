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
  onClear: _onClear,
  disabledReason = '두 강의를 모두 선택해주세요',
  className,
}: AiAnalyzeButtonProps) {
  // 분석 완료 시 버튼 숨김 (Figma 디자인)
  if (hasResult) return null

  const handleClick = () => {
    if (isLoading) return
    if (isEnabled) {
      onAnalyze()
    }
  }

  const getButtonText = () => {
    if (isLoading) return 'AI가 분석하고 있어요...'
    if (!isEnabled) return disabledReason
    return 'AI에게 물어보고, 최적의 답을 발견하세요'
  }

  return (
    <motion.button
      type="button"
      onClick={handleClick}
      disabled={!isEnabled || isLoading}
      whileHover={isEnabled ? { scale: 1.01 } : undefined}
      whileTap={isEnabled ? { scale: 0.99 } : undefined}
      className={cn(
        'relative flex h-[65px] w-full items-center justify-center gap-2 rounded-xl transition-all md:h-[59px] md:gap-3 md:max-w-[348px]',
        // Enabled state - yellow
        isEnabled && !isLoading && 'bg-yellow-400 hover:bg-yellow-500 active:bg-yellow-600',
        // Loading state
        isLoading && 'bg-yellow-300',
        // Disabled state
        !isEnabled && !isLoading && 'cursor-not-allowed bg-gray-200 text-gray-400',
        // Text colors
        (isEnabled || isLoading) && 'text-gray-900',
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
    </motion.button>
  )
}
