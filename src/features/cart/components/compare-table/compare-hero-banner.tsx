export function CompareHeroBanner() {
  return (
    <div className="relative flex h-[250px] w-full flex-col items-center justify-center gap-2.5 overflow-hidden p-2.5">
      {/* Background Image + Dark Overlay */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        {/* 모바일: 실제 배경 이미지 대신 그라데이션 패턴 사용 */}
        <div className="absolute inset-0 bg-slate-900" />
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%234f46e5' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        {/* Dark overlay - Figma: bg-[rgba(0,0,0,0.6)] */}
        <div className="absolute inset-0 bg-black/60" />
      </div>

      {/* 제목 - Figma: text-[20px] font-bold text-white */}
      <p className="relative text-xl font-bold text-white">과정 비교 페이지</p>

      {/* 부제목 - Figma: text-[12px] text-center text-white */}
      <p className="relative text-center text-xs text-white">
        원하는 강의들을 골라 비교해보며 최적의 강의를 선택해보세요.
      </p>
    </div>
  )
}
