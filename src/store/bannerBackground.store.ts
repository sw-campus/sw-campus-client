'use client'

import { create } from 'zustand'

interface BannerBackgroundState {
  backgroundColor: string | null
  setBackgroundColor: (color: string | null) => void
}

/**
 * 대배너 배경색에 맞춰 페이지 배경을 동적으로 변경하기 위한 store
 * - LargeBanner에서 슬라이드 변경 시 setBackgroundColor 호출
 * - 페이지에서 backgroundColor를 구독하여 rgba 투명도로 배경 적용
 */
export const useBannerBackgroundStore = create<BannerBackgroundState>(set => ({
  backgroundColor: null,
  setBackgroundColor: (color: string | null) => set({ backgroundColor: color }),
}))

/**
 * HEX 색상을 rgba로 변환하는 유틸
 * @param hex HEX 색상 (예: #ff5733)
 * @param alpha 투명도 (0~1)
 */
export function hexToRgba(hex: string | null, alpha: number = 0.25): string {
  if (!hex) return 'transparent'

  // # 제거
  const cleanHex = hex.replace('#', '')

  // 3자리 HEX를 6자리로 변환
  const fullHex =
    cleanHex.length === 3
      ? cleanHex
          .split('')
          .map(c => c + c)
          .join('')
      : cleanHex

  const r = parseInt(fullHex.substring(0, 2), 16)
  const g = parseInt(fullHex.substring(2, 4), 16)
  const b = parseInt(fullHex.substring(4, 6), 16)

  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}
