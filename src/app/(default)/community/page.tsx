import type { Metadata } from 'next'

import { HeroBanner } from '@/features/bootcamp-list'

import CommunityContent from './community-content'

export const metadata: Metadata = {
  title: '커뮤니티',
  description:
    '부트캠프 수강생들의 생생한 수강일기를 만나보세요. 매주 배운 내용과 성장 과정을 기록하고 공유하는 커뮤니티입니다.',
  openGraph: {
    title: '커뮤니티 | 소프트웨어캠퍼스',
    description:
      '부트캠프 수강생들의 생생한 수강일기를 만나보세요. 매주 배운 내용과 성장 과정을 기록하고 공유하는 커뮤니티입니다.',
  },
}

export default function CommunityPage() {
  return (
    <div className="w-full min-h-screen bg-white flex flex-col items-center overflow-x-hidden">
      {/* Hero Banner */}
      <div className="w-full">
        <HeroBanner
          title="부트캠프 수강일기"
          description="매주 배운 내용과 성장 과정을 기록하고, 동료들과 함께 성장하세요"
          backgroundImageUrl="/images/bootcamp-hero.jpg"
        />
      </div>

      {/* Content */}
      <div className="w-full max-w-[1448px] mx-auto px-4 md:px-6 py-6">
        <CommunityContent />
      </div>
    </div>
  )
}
