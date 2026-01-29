'use client'

import { CircleCheck } from 'lucide-react'

interface ServiceGridProps {
  services: string[]
}

/**
 * 지원 서비스 그리드 컴포넌트
 * 3열 그리드로 고정, 모바일/PC 반응형 자동 적용
 */
export function ServiceGrid({ services }: ServiceGridProps) {
  if (services.length === 0) {
    return <span className="text-sm lg:text-base text-[#888888]">지원 서비스 정보가 없습니다.</span>
  }

  return (
    <div className="grid grid-cols-3 lg:grid-cols-5 gap-2 lg:gap-4">
      {services.map((service, idx) => (
        <div
          key={idx}
          className="p-3 lg:p-4 bg-[#F2FFEE] rounded-lg flex flex-col items-center gap-2 lg:gap-3"
        >
          <CircleCheck className="w-[22px] h-[22px] lg:w-6 lg:h-6 text-[#34C68A]" />
          <span className="text-[10px] lg:text-sm text-black text-center">{service}</span>
        </div>
      ))}
    </div>
  )
}
