import Image from 'next/image'

export function MainBanner() {
  return (
    <>
      {/* 모바일 배너 */}
      <section className="relative aspect-360/432 w-full md:hidden">
        <Image src="/images/main/mobile.png" alt="메인 배너" fill className="object-cover" priority />
      </section>
      {/* 데스크톱 배너 */}
      <section className="relative hidden aspect-[1920/719] w-full md:flex">
        <Image src="/images/main/desktop.png" alt="메인 배너" fill className="object-cover" priority />
        {/* 그라데이션 오버레이 */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(270deg, rgba(0, 6, 25, 0) 0%, rgba(0, 6, 25, 0.80) 100%)',
          }}
        />
        {/* 텍스트 컨텐츠 */}
        <div className="container-responsive relative z-10 flex flex-col justify-center gap-4">
          <p className="text-[22px] font-normal text-[#CACACA]">
            부트캠프, 하나하나 클릭해서 비교해보시나요?
          </p>
          <h1 className="text-[48px] font-bold text-white">
            AI로 3초만에 스펙 비교하세요.
          </h1>
        </div>
      </section>
    </>
  )
}
