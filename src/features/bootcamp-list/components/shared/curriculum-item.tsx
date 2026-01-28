'use client'

interface CurriculumItemProps {
  index: number
  title: string
  level: 'basic' | 'advanced'
}

/**
 * 커리큘럼 아이템 컴포넌트
 * 모바일/PC 반응형 자동 적용
 */
export function CurriculumItem({ index, title, level }: CurriculumItemProps) {
  return (
    <div className="px-3 lg:px-4 py-3 lg:py-4 border-b border-[#EEEEEE] flex justify-between items-center">
      <div className="flex items-center gap-2 lg:gap-3">
        <div className="w-5 h-5 lg:w-6 lg:h-6 bg-[#EEEEEE] rounded-full flex items-center justify-center">
          <span className="text-xs lg:text-sm text-[#888888]">{index}</span>
        </div>
        <span className="text-sm lg:text-base text-[#020202]">{title}</span>
      </div>
      <div
        className={`px-3 lg:px-4 py-1 rounded border flex items-center justify-center ${
          level === 'basic'
            ? 'bg-[#DBEAFF] border-[#1447E6]'
            : 'bg-[#F3E8FF] border-[#8A0DDC]'
        }`}
      >
        <span
          className={`text-xs ${
            level === 'basic' ? 'text-[#1447E6]' : 'text-[#8A0DDC]'
          }`}
        >
          {level === 'basic' ? '기본' : '심화'}
        </span>
      </div>
    </div>
  )
}
