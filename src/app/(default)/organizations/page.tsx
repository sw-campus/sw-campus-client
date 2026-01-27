import type { Metadata } from 'next'

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
    <div className="bg-background min-h-screen">
      <div className="mx-auto max-w-3xl px-4 md:max-w-7xl md:px-6">
        <OrganizationList />
      </div>
    </div>
  )
}
