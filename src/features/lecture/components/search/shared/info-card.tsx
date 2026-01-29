'use client'

import type { ReactNode } from 'react'

interface InfoCardProps {
  icon: ReactNode
  title: string
  description: string
  action?: ReactNode
}

/**
 * 정보 카드 컴포넌트 (아이콘 + 제목 + 설명)
 * 교육기관 정보, 강사진 소개 등에 사용
 * 모바일/PC 반응형 자동 적용
 */
export function InfoCard({ icon, title, description, action }: InfoCardProps) {
  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-3 lg:gap-4">
        <div className="w-[45px] h-[45px] lg:w-14 lg:h-14 bg-[#FFFCF4] rounded-full flex items-center justify-center">
          <div className="w-5 h-5 lg:w-6 lg:h-6 text-[#888888] [&>svg]:w-full [&>svg]:h-full">
            {icon}
          </div>
        </div>
        <div className="flex flex-col gap-2 lg:gap-2">
          <span className="text-sm lg:text-base font-semibold text-black">{title}</span>
          <span className="text-xs lg:text-sm text-[#888888]">{description}</span>
        </div>
      </div>
      {action}
    </div>
  )
}
