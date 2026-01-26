export function VsBadge() {
  return (
    <div className="flex items-center justify-center">
      {/* Figma 스타일 - 검정 배경, 노란 텍스트 (모바일 45px, 데스크톱 80px) */}
      <div className="flex size-[45px] items-center justify-center rounded-full bg-[#020202] text-base font-bold text-[#feb706] md:size-[80px] md:text-2xl">
        VS
      </div>
    </div>
  )
}
