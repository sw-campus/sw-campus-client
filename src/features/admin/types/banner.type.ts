/**
 * 배너 타입
 */
export type BannerType = 'BIG' | 'MIDDLE' | 'SMALL'

/**
 * 배너 타입 필터 (ALL 포함)
 */
export type BannerTypeFilter = 'ALL' | BannerType

/**
 * 배너 정보
 */
export interface Banner {
  id: number
  lectureId: number
  lectureName: string
  type: BannerType
  url: string | null
  imageUrl: string
  startDate: string
  endDate: string
  isActive: boolean
}

/**
 * 배너 타입 한글 라벨
 */
export const BANNER_TYPE_LABEL: Record<BannerType, string> = {
  BIG: '대형',
  MIDDLE: '중형',
  SMALL: '소형',
}

/**
 * 배너 타입 필터 한글 라벨 (ALL 포함)
 */
export const BANNER_TYPE_FILTER_LABEL: Record<BannerTypeFilter, string> = {
  ALL: '전체',
  BIG: '대형',
  MIDDLE: '중형',
  SMALL: '소형',
}

/**
 * 배너 생성 요청
 */
export interface CreateBannerRequest {
  lectureId: number
  type: BannerType
  url?: string
  imageUrl?: string
  startDate: string
  endDate: string
}

/**
 * 배너 기간 상태
 */
export type BannerPeriodStatus = 'ALL' | 'SCHEDULED' | 'ACTIVE' | 'ENDED'

/**
 * 배너 기간 상태 라벨
 */
export const BANNER_PERIOD_STATUS_LABEL: Record<BannerPeriodStatus, string> = {
  ALL: '전체',
  SCHEDULED: '예정',
  ACTIVE: '진행중',
  ENDED: '진행완료',
}

/**
 * 배너 기간 상태 색상 (통계 카드와 동일한 색상 체계)
 */
export const BANNER_PERIOD_STATUS_COLOR: Record<Exclude<BannerPeriodStatus, 'ALL'>, string> = {
  SCHEDULED: 'bg-amber-500 text-white',
  ACTIVE: 'bg-emerald-500 text-white',
  ENDED: 'bg-gray-400 text-white',
}

/**
 * 배너 기간 상태 계산
 */
export function getBannerPeriodStatus(startDate: string, endDate: string): Exclude<BannerPeriodStatus, 'ALL'> {
  const now = new Date()
  const start = new Date(startDate)
  const end = new Date(endDate)

  if (now < start) return 'SCHEDULED'
  if (now > end) return 'ENDED'
  return 'ACTIVE'
}
