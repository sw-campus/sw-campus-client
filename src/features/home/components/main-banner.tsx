import Image from 'next/image'

export function MainBanner() {
  return (
    <section className="relative aspect-[360/432] w-full md:hidden">
      <Image src="/images/main_banner.png" alt="메인 배너" fill className="object-cover" priority />
    </section>
  )
}
