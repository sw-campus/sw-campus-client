'use client'

import LargeBanner from '@/features/banner/components/large-banner'
import MidBanner from '@/features/banner/components/mid-banner'

export function BannerCarousel() {
  return (
    <section className="flex flex-col gap-2 overflow-visible px-4 py-[30px] md:mx-auto md:w-full md:max-w-[1448px] md:gap-3 md:px-6 md:py-[50px]">
      <LargeBanner />
      <MidBanner />
    </section>
  )
}
