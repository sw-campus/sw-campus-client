'use client'

import LargeBanner from '@/features/banner/components/LargeBanner'
import MidBanner from '@/features/banner/components/MidBanner'
import CourseSection from '@/features/course/components/CourseSection'

export default function Home() {
  return (
    <>
      {/* 큰 배너 */}
      <LargeBanner />
      {/* 중간 배너 */}
      <MidBanner />
      {/* 분야별 부트캠프 */}
      <CourseSection />
    </>
  )
}
