'use client'

import { useEffect, useState } from 'react'

import { createPortal } from 'react-dom'
import { FiLoader } from 'react-icons/fi'

import { cn } from '@/lib/utils'

interface AiFloatingButtonProps {
  isEnabled: boolean
  isLoading: boolean
  hasResult: boolean
  onAnalyze: () => void
  onClear: () => void
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

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleClick = () => {
    if (hasResult) {
      onClear()
    } else if (isEnabled && !isLoading) {
      onAnalyze()
    }
  }

  if (!mounted) return null

  return createPortal(
    <>
      {/* CSS Keyframes */}
      <style>{`
        @keyframes magicPulse {
          0%, 100% {
            box-shadow:
              0 0 20px rgba(251, 146, 60, 0.4),
              0 0 40px rgba(251, 146, 60, 0.3),
              0 0 60px rgba(249, 115, 22, 0.2),
              inset 0 0 30px rgba(255, 255, 255, 0.3);
          }
          50% {
            box-shadow:
              0 0 30px rgba(251, 146, 60, 0.6),
              0 0 60px rgba(251, 146, 60, 0.4),
              0 0 90px rgba(249, 115, 22, 0.3),
              inset 0 0 40px rgba(255, 255, 255, 0.4);
          }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        @keyframes sparkle {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%) rotate(45deg); }
          100% { transform: translateX(200%) rotate(45deg); }
        }
        @keyframes rotateGlow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>

      <button
        type="button"
        onClick={handleClick}
        disabled={!isEnabled && !hasResult}
        title={!isEnabled && !hasResult ? disabledReason : hasResult ? '분석 초기화' : 'AI 비교분석'}
        className={cn(
          // 고정 위치
          'fixed right-10 bottom-10 z-[100]',
          'flex flex-col items-center justify-center',
          'h-[90px] w-[90px] rounded-full',
          // 호버/클릭 효과
          'transition-all duration-500 ease-out',
          'hover:scale-110',
          'active:scale-95',
          // 비활성 상태
          'disabled:pointer-events-none disabled:opacity-0',
          isEnabled || hasResult ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
        style={{
          animation:
            isEnabled || hasResult ? 'float 3s ease-in-out infinite, magicPulse 2s ease-in-out infinite' : 'none',
          // 오렌지 마법의 물방울 그라데이션
          background: `
            radial-gradient(
              circle at 30% 20%,
              rgba(255, 255, 255, 0.95) 0%,
              rgba(255, 247, 237, 0.9) 15%,
              rgba(254, 215, 170, 0.85) 30%,
              rgba(253, 186, 116, 0.8) 45%,
              rgba(251, 146, 60, 0.75) 60%,
              rgba(249, 115, 22, 0.7) 75%,
              rgba(234, 88, 12, 0.65) 90%,
              rgba(194, 65, 12, 0.6) 100%
            )
          `,
          // 테두리
          border: '2px solid rgba(255, 255, 255, 0.5)',
        }}
      >
        {/* 회전하는 외곽 글로우 링 */}
        <span
          className="pointer-events-none absolute -inset-2 rounded-full"
          style={{
            background:
              'conic-gradient(from 0deg, transparent, rgba(251, 146, 60, 0.5), rgba(249, 115, 22, 0.5), rgba(253, 186, 116, 0.5), transparent)',
            animation: 'rotateGlow 4s linear infinite',
            filter: 'blur(8px)',
            opacity: 0.6,
          }}
        />

        {/* 상단 메인 하이라이트 */}
        <span
          className="pointer-events-none absolute"
          style={{
            top: '8px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '70%',
            height: '40%',
            borderRadius: '50%',
            background: `linear-gradient(
              to bottom,
              rgba(255, 255, 255, 0.95) 0%,
              rgba(255, 255, 255, 0.7) 30%,
              rgba(255, 255, 255, 0.3) 60%,
              transparent 100%
            )`,
          }}
        />

        {/* 시머(shimmer) 효과 - 빛나는 줄무늬 */}
        <span className="pointer-events-none absolute inset-0 overflow-hidden rounded-full" style={{ opacity: 0.4 }}>
          <span
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.8) 50%, transparent 70%)',
              animation: 'shimmer 3s ease-in-out infinite',
            }}
          />
        </span>

        {/* 반짝이는 별 파티클들 */}
        {[
          { top: '15px', left: '18px', size: '6px', delay: '0s' },
          { top: '25px', right: '20px', size: '4px', delay: '0.5s' },
          { bottom: '30px', left: '22px', size: '5px', delay: '1s' },
          { bottom: '25px', right: '25px', size: '4px', delay: '1.5s' },
          { top: '45px', left: '12px', size: '3px', delay: '0.8s' },
          { top: '50px', right: '15px', size: '3px', delay: '1.2s' },
        ].map((particle, i) => (
          <span
            key={i}
            className="pointer-events-none absolute"
            style={{
              top: particle.top,
              bottom: particle.bottom,
              left: particle.left,
              right: particle.right,
              width: particle.size,
              height: particle.size,
              borderRadius: '50%',
              background: 'radial-gradient(circle, #fff 0%, rgba(255,255,255,0.8) 40%, transparent 70%)',
              boxShadow: '0 0 6px 2px rgba(255, 255, 255, 0.8)',
              animation: `sparkle 2s ease-in-out ${particle.delay} infinite`,
            }}
          />
        ))}

        {/* 물방울 반사 효과 - 좌상단 */}
        <span
          className="pointer-events-none absolute"
          style={{
            top: '22px',
            left: '22px',
            width: '12px',
            height: '8px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.9)',
            filter: 'blur(1px)',
          }}
        />

        {/* 하단 반사 (바닥 반사) */}
        <span
          className="pointer-events-none absolute"
          style={{
            bottom: '12px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '50%',
            height: '18%',
            borderRadius: '50%',
            background: `linear-gradient(
              to top,
              rgba(251, 146, 60, 0.3) 0%,
              rgba(253, 186, 116, 0.15) 50%,
              transparent 100%
            )`,
          }}
        />

        {/* 가장자리 광택 링 */}
        <span
          className="pointer-events-none absolute inset-0 rounded-full"
          style={{
            border: '2px solid transparent',
            borderTopColor: 'rgba(255, 255, 255, 0.7)',
            borderLeftColor: 'rgba(255, 255, 255, 0.5)',
          }}
        />

        {/* 내부 텍스트 */}
        <div className="relative z-10 flex flex-col items-center">
          {isLoading ? (
            <>
              <FiLoader className="size-7 animate-spin text-white drop-shadow-lg" />
              <span
                className="mt-1 text-[11px] font-bold text-white"
                style={{ textShadow: '0 0 10px rgba(251, 146, 60, 0.8)' }}
              >
                분석중...
              </span>
            </>
          ) : (
            <>
              <span
                className="text-2xl font-black text-white"
                style={{
                  textShadow: '0 0 20px rgba(255, 255, 255, 0.8), 0 0 40px rgba(251, 146, 60, 0.6)',
                }}
              >
                AI
              </span>
              <span
                className="text-xs font-bold text-white/90"
                style={{ textShadow: '0 0 10px rgba(251, 146, 60, 0.6)' }}
              >
                {hasResult ? '초기화' : '비교분석'}
              </span>
            </>
          )}
        </div>

        {/* 활성화 알림 점 - 더 화려하게 */}
        {isEnabled && !isLoading && !hasResult && (
          <span className="absolute -top-1 -right-1 flex h-5 w-5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-yellow-300 opacity-75" />
            <span
              className="relative inline-flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-yellow-300 to-orange-400 text-[8px]"
              style={{ boxShadow: '0 0 12px rgba(251, 191, 36, 0.8)' }}
            >
              ✨
            </span>
          </span>
        )}

        {/* 완료 체크 - 더 화려하게 */}
        {hasResult && (
          <span
            className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-green-500 text-xs font-bold text-white"
            style={{ boxShadow: '0 0 15px rgba(16, 185, 129, 0.8)' }}
          >
            ✓
          </span>
        )}
      </button>
    </>,
    document.body,
  )
}
