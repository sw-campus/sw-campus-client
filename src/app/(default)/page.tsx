'use client'

import LargeBanner from '@/features/banner/components/LargeBanner'
import MidBanner from '@/features/banner/components/MidBanner'
import LectureSection from '@/features/lecture/components/LectureSection'

export default function Home() {
  return (
    <>
      {/* 큰 배너 */}
      <LargeBanner />
      {/* 중간 배너 */}
      <MidBanner />
      {/* 분야별 부트캠프 */}
      <LectureSection />
    </>
  )
}
