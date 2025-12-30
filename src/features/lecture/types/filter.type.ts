export type SortOption = {
  value: string
  label: string
}

export type FilterGroupKey = 'procedure' | 'region'

export const COST_FILTERS = ['무료(내배카O)', '무료(내배카X)', '유료(자부담)'] as const

export const PROCEDURE_FILTERS = ['면접 없음', '코딩테스트 없음', '사전학습과제 없음'] as const

export const REGION_FILTERS = [
  '서울특별시',
  '인천광역시',
  '부산광역시',
  '대구광역시',
  '울산광역시',
  '세종특별자치시',
  '경기도',
  '강원도',
  '충청북도',
  '충청남도',
  '전라북도',
  '전라남도',
  '경상북도',
  '경상남도',
  '제주특별자치도',
] as const

export const SORT_OPTIONS: SortOption[] = [
  { value: 'LATEST', label: '최신순(기본)' },
  { value: 'FEE_ASC', label: '자기부담금 낮은 순' },
  { value: 'FEE_DESC', label: '자기부담금 높은 순' },
  { value: 'START_SOON', label: '마감 임박순' },
  { value: 'DURATION_ASC', label: '교육기간 짧은 순' },
  { value: 'DURATION_DESC', label: '교육기간 긴 순' },
  { value: 'REVIEW_COUNT_DESC', label: '후기 많은순' },
  { value: 'SCORE_DESC', label: '별점순' },
]

export const DEFAULT_SORT = SORT_OPTIONS[0].value

export const DEFAULT_PAGE_SIZE = '12'

export const COST_QUERY_MAP: Record<string, string> = {
  '무료(내배카O)': 'isFreeKdt',
  '무료(내배카X)': 'isFreeNoKdt',
  '유료(자부담)': 'isPaid',
}

export const PROCEDURE_QUERY_MAP: Record<string, string> = {
  '면접 없음': 'hasInterview',
  '코딩테스트 없음': 'hasCodingTest',
  '사전학습과제 없음': 'hasPreTask',
}

export const REGION_QUERY_MAP: Record<string, string> = {
  서울특별시: '서울',
  인천광역시: '인천',
  부산광역시: '부산',
  대구광역시: '대구',
  울산광역시: '울산',
  세종특별자치시: '세종',
  경기도: '경기',
  강원도: '강원',
  충청북도: '충북',
  충청남도: '충남',
  전라북도: '전북',
  전라남도: '전남',
  경상북도: '경북',
  경상남도: '경남',
  제주특별자치도: '제주',
}

export const STATUS_FILTERS = ['모집중', '마감'] as const

export const STATUS_QUERY_MAP: Record<string, string> = {
  모집중: 'RECRUITING',
  마감: 'FINISHED',
}
