'use client'

interface QualificationsSectionProps {
  required: string[]
  preferred: string[]
}

/**
 * 자격 요건 섹션 컴포넌트
 * 모바일: 세로 나열, PC: 2열 그리드
 */
export function QualificationsSection({
  required,
  preferred,
}: QualificationsSectionProps) {
  return (
    <div className="flex flex-col gap-4 lg:grid lg:grid-cols-2 lg:gap-8">
      {/* 필수 */}
      <div className="flex flex-col gap-3 lg:gap-4">
        <div className="px-3 lg:px-4 py-1 lg:py-1.5 bg-blue-500/10 rounded-full border border-blue-500 w-fit flex items-center justify-center">
          <span className="text-xs lg:text-sm text-blue-500">필수</span>
        </div>
        {required.length > 0 ? (
          required.map((item, idx) => (
            <div key={idx} className="flex items-start gap-1 lg:gap-2">
              <span className="text-sm lg:text-base text-[#020202]">-</span>
              <span className="text-sm lg:text-base text-[#020202]">{item}</span>
            </div>
          ))
        ) : (
          <span className="text-sm lg:text-base text-[#888888]">필수 조건 정보가 없습니다.</span>
        )}
      </div>

      {/* 우대 */}
      <div className="flex flex-col gap-3 lg:gap-4">
        <div className="px-3 lg:px-4 py-1 lg:py-1.5 bg-emerald-500/10 rounded-full border border-emerald-500 w-fit flex items-center justify-center">
          <span className="text-xs lg:text-sm text-emerald-500">우대</span>
        </div>
        {preferred.length > 0 ? (
          preferred.map((item, idx) => (
            <div key={idx} className="flex items-start gap-1 lg:gap-2">
              <span className="text-sm lg:text-base text-[#020202]">-</span>
              <span className="text-sm lg:text-base text-[#020202]">{item}</span>
            </div>
          ))
        ) : (
          <span className="text-sm lg:text-base text-[#888888]">우대 조건 정보가 없습니다.</span>
        )}
      </div>
    </div>
  )
}
