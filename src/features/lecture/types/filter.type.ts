export type SortOption = {
  value: string
  label: string
}

export type FilterGroupKey = 'procedure' | 'region'

export const COST_FILTERS = ['무료(내배카 필요)', '무료(내배카 필요X)', '유료(자부담)'] as const

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
  { value: 'START_SOON', label: '개강 빠른 순' },
  { value: 'DURATION_ASC', label: '교육기간 짧은 순' },
  { value: 'DURATION_DESC', label: '교육기간 긴 순' },
]

export const DEFAULT_SORT = SORT_OPTIONS[0].value

export const COST_QUERY_MAP: Record<string, string> = {
  '무료(내배카 필요)': 'isFreekdt',
  '무료(내배카 필요X)': 'isFreeNoKdt',
  '유료(자부담)': 'isPaid',
}

export const PROCEDURE_QUERY_MAP: Record<string, string> = {
  '면접 없음': 'hasInterview',
  '코딩테스트 없음': 'hasCodingTest',
  '사전학습과제 없음': 'hasPreTask',
}
