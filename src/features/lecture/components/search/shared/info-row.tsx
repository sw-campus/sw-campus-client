'use client'

import type { ReactNode } from 'react'

interface InfoRowProps {
  label: string
  value: ReactNode
  labelWidth?: string
}

/**
 * 정보 행 컴포넌트 (라벨: 값 형태)
 * 모바일/PC 반응형 자동 적용
 */
export function InfoRow({ label, value, labelWidth = 'w-14 lg:w-20' }: InfoRowProps) {
  return (
    <div className="flex items-center gap-6">
      <span className={`${labelWidth} text-sm lg:text-base text-[#888888] flex-shrink-0`}>
        {label}
      </span>
      <span className="text-sm lg:text-base font-semibold text-black">
        {value}
      </span>
    </div>
  )
}
