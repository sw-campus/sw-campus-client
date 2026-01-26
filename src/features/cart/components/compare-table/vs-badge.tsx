export function VsBadge() {
  return (
    <div className="flex items-center justify-center">
      {/* 모바일: Figma 스타일 - 검정 배경, 노란 텍스트 */}
      {/* 데스크톱: 그라데이션 스타일 유지 */}
      <div className="flex size-[45px] items-center justify-center rounded-full bg-[#020202] text-base font-bold text-[#feb706] md:bg-gradient-to-br md:from-indigo-500 md:to-purple-600 md:text-white md:shadow-lg">
        VS
      </div>
    </div>
  )
}
