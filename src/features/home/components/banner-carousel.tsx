'use client'

import LargeBanner from '@/features/banner/components/large-banner'
import MidBanner from '@/features/banner/components/mid-banner'

export function BannerCarousel() {
  return (
    <section className="flex flex-col gap-1 py-[30px] md:gap-2 md:py-[50px]">
      {/* 배너 상단 텍스트 */}
      <h2 className="text-foreground container-responsive mb-2 text-center text-xl font-bold md:mb-4 md:text-[32px]">
        소프트웨어 캠퍼스의 배너는 <br className="md:hidden" />
        <span className="text-brand-gold">별점 4점</span> 이상 강의만 소개합니다.
      </h2>
      <LargeBanner />
      <MidBanner />
    </section>
  )
}
