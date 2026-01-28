'use client'

import LargeBanner from '@/features/banner/components/large-banner'
import MidBanner from '@/features/banner/components/mid-banner'

export function BannerCarousel() {
  return (
    <section className="container-responsive flex flex-col gap-2 overflow-visible py-[30px] md:gap-3 md:py-[50px]">
      <LargeBanner />
      <MidBanner />
    </section>
  )
}
