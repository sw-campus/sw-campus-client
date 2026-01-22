import type { Metadata } from 'next'

import HomeContent from './home-content'

export const metadata: Metadata = {
  title: '소프트웨어캠퍼스 - 국비지원 IT 부트캠프 비교',
  description:
    '국비지원 IT 부트캠프를 한눈에 비교하세요. 강의 정보, 수강 후기, 취업률까지 모든 정보를 제공합니다.',
  openGraph: {
    title: '소프트웨어캠퍼스 - 국비지원 IT 부트캠프 비교',
    description:
      '국비지원 IT 부트캠프를 한눈에 비교하세요. 강의 정보, 수강 후기, 취업률까지 모든 정보를 제공합니다.',
  },
}

export default function Home() {
  return <HomeContent />
}
