'use client'

import type { ReactNode } from 'react'

interface SectionHeaderProps {
  icon: ReactNode
  title: string
  badge?: ReactNode
}

/**
 * 섹션 헤더 컴포넌트
 * 모바일/PC 반응형 자동 적용
 */
export function SectionHeader({ icon, title, badge }: SectionHeaderProps) {
  return (
    <div className="flex items-center gap-2 lg:gap-3 mb-4 lg:mb-6">
      <div className="w-5 h-5 lg:w-6 lg:h-6 text-[#FEB706] [&>svg]:w-full [&>svg]:h-full">
        {icon}
      </div>
      <span className="text-base lg:text-lg font-semibold text-[#020202]">{title}</span>
      {badge}
    </div>
  )
}
