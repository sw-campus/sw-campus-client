'use client'

interface RecruitmentStatusBadgeProps {
  status: string
}

/**
 * 모집 상태 배지 컴포넌트
 * RECRUITING = 모집중 (초록), 그 외 = 모집마감 (회색)
 */
export function RecruitmentStatusBadge({ status }: RecruitmentStatusBadgeProps) {
  const isRecruiting = status === 'RECRUITING'

  return (
    <div
      className={`h-5 px-2 rounded-full flex items-center justify-center gap-1 ${
        isRecruiting ? 'bg-emerald-100' : 'bg-gray-100'
      }`}
    >
      <div
        className={`w-1.5 h-1.5 rounded-full ${
          isRecruiting ? 'bg-emerald-500' : 'bg-gray-400'
        }`}
      />
      <span
        className={`text-[10px] font-medium ${
          isRecruiting ? 'text-emerald-600' : 'text-gray-500'
        }`}
      >
        {isRecruiting ? '모집중' : '모집마감'}
      </span>
    </div>
  )
}
