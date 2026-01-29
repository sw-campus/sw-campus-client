import type { Metadata } from 'next'

import { HeroBanner } from '@/features/bootcamp-list'
import { OrganizationList } from '@/features/organization/components/organization-list'

export const metadata: Metadata = {
  title: '훈련기관',
  description:
    '국비지원 IT 부트캠프를 운영하는 훈련기관들을 만나보세요. 각 기관의 특징과 운영 강의를 확인할 수 있습니다.',
  openGraph: {
    title: '훈련기관 | 소프트웨어캠퍼스',
    description:
      '국비지원 IT 부트캠프를 운영하는 훈련기관들을 만나보세요. 각 기관의 특징과 운영 강의를 확인할 수 있습니다.',
  },
}

export default function OrganizationsPage() {
  return (
    <div className="w-full min-h-screen bg-white flex flex-col items-center overflow-x-hidden">
      {/* Hero Banner */}
      <div className="w-full">
        <HeroBanner
          title="훈련기관"
          description={"훈련기관을 살펴보고 \n훈련기관 별 교육과정도 확인해보세요."}
          backgroundImageUrl="/images/org/organization_banner.jpg"
        />
      </div>

      {/* Content */}
      <div className="w-full max-w-[1448px] mx-auto px-4 md:px-6 py-6">
        <OrganizationList />
      </div>
    </div>
  )
}
