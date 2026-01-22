import type { Metadata } from 'next'

import { OrganizationList } from '@/features/organization/components/organization-list'

export const metadata: Metadata = {
  title: '교육기관',
  description: '국비지원 IT 부트캠프를 운영하는 교육기관들을 만나보세요. 각 기관의 특징과 운영 강의를 확인할 수 있습니다.',
  openGraph: {
    title: '교육기관 | 소프트웨어캠퍼스',
    description:
      '국비지원 IT 부트캠프를 운영하는 교육기관들을 만나보세요. 각 기관의 특징과 운영 강의를 확인할 수 있습니다.',
  },
}

export default function OrganizationsPage() {
  return (
    <div className="custom-container">
      <div className="custom-card">
        <OrganizationList />
      </div>
    </div>
  )
}
