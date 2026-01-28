export function CompareHeroBanner() {
  return (
    <div className="relative flex h-[250px] w-full flex-col items-center justify-center gap-2.5 overflow-hidden p-2.5">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <img
          alt=""
          className="absolute size-full object-cover"
          src="/images/compare-hero-bg.jpg"
        />
        <div className="absolute inset-0 bg-black/60" />
      </div>

      <p className="relative text-[2rem] font-bold text-white">
        과정 비교 페이지
      </p>

      <p className="relative text-center text-lg text-white">
        원하는 강의들을 골라 비교해보며 최적의 강의를 선택해보세요.
      </p>
    </div>
  )
}
