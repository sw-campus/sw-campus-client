import type { Metadata } from 'next'

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
  return <CommunityContent />
}
