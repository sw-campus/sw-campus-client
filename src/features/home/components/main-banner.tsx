import Image from 'next/image'

export function MainBanner() {
  return (
    <>
      {/* 모바일 배너 */}
      <section className="relative aspect-360/432 w-full md:hidden">
        <Image src="/images/main/mobile.png" alt="메인 배너" fill className="object-cover" priority sizes="(max-width: 768px) 100vw, 0px" />
      </section>
      {/* 데스크톱 배너 */}
      <section className="relative hidden aspect-[1920/500] w-full bg-[#041032] md:flex">
        <Image src="/images/main/desktop.png" alt="메인 배너" fill className="object-contain" priority sizes="100vw" />
        {/* 그라데이션 오버레이 */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(270deg, rgba(4, 16, 50, 0) 0%, rgba(4, 16, 50, 0.80) 100%)',
          }}
        />
        {/* 텍스트 컨텐츠 */}
        <div className="absolute inset-0 z-10 flex flex-col justify-center gap-2 pl-[15%]">
          <p className="text-base font-normal text-[#CACACA]">
            부트캠프, 하나하나 클릭해서 비교해보시나요?
          </p>
          <h1 className="text-[32px] font-bold text-white">
            AI로 3초만에 스펙 비교하세요.
          </h1>
        </div>
      </section>
    </>
  )
}
