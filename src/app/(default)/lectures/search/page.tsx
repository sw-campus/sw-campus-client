import type { Metadata } from 'next'

import SearchContent from './search-content'

export const metadata: Metadata = {
  title: '강의 검색',
  description:
    '국비지원 IT 부트캠프를 검색하세요. 분야별, 지역별, 비용별 다양한 조건으로 나에게 맞는 강의를 찾아보세요.',
  openGraph: {
    title: '강의 검색 | 소프트웨어캠퍼스',
    description:
      '국비지원 IT 부트캠프를 검색하세요. 분야별, 지역별, 비용별 다양한 조건으로 나에게 맞는 강의를 찾아보세요.',
  },
}

export default function LectureSearchPage() {
  return <SearchContent />
}
