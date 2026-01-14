'use client'

import { hexToRgba, useBannerBackgroundStore } from '@/store/bannerBackground.store'

/**
 * 대배너 배경색에 맞춰 동적으로 변하는 배경 컴포넌트
 * - 흰색 기본 배경 위에 배너 색상을 반투명하게 오버레이
 * - 색상 전환 시 부드러운 트랜지션 (2초)
 */
export default function DynamicBackground() {
  const backgroundColor = useBannerBackgroundStore(state => state.backgroundColor)

  return (
    <>
      {/* 흰색 기본 배경 */}
      <div className="pointer-events-none fixed inset-0 -z-20 bg-white" />
      {/* 배너 색상 오버레이 - 색상 변경 시 2초 동안 부드럽게 전환 */}
      <div
        className="pointer-events-none fixed inset-0 -z-10"
        style={{
          backgroundColor: hexToRgba(backgroundColor, 0.1),
          transition: 'background-color 2s ease-in-out',
        }}
      />
    </>
  )
}
