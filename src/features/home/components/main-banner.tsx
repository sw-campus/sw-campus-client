import Image from 'next/image'

export function MainBanner() {
  return (
    <>
      {/* 모바일 배너 */}
      <section className="relative aspect-360/432 w-full md:hidden">
        <Image src="/images/main/mobile.png" alt="메인 배너" fill className="object-cover" priority />
      </section>
      {/* 데스크톱 배너 */}
      <section className="relative hidden aspect-1920/600 w-full md:block">
        <Image src="/images/main/desktop.png" alt="메인 배너" fill className="object-cover" priority />
      </section>
    </>
  )
}
