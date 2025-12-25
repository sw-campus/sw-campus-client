import { api } from '@/lib/axios'

export interface AnalyticsReport {
  totalUsers: number
  activeUsers: number
  newUsers: number
  averageEngagementTime: number
  pageViews: number
  sessions: number
  dailyStats: DailyStat[]
  deviceStats: DeviceStat[]
}

export interface DailyStat {
  date: string
  totalUsers: number
  newUsers: number
  pageViews: number
}

export interface DeviceStat {
  category: string
  activeUsers: number
}

export interface EventStats {
  bannerClicks: number
  bigBannerClicks: number
  middleBannerClicks: number
  smallBannerClicks: number
  applyButtonClicks: number
  shareClicks: number
  events: EventDetail[]
}

export interface EventDetail {
  eventName: string
  eventCount: number
}

export interface BannerClickStats {
  bannerId: string
  bannerName: string
  bannerType: string
  clickCount: number
}

export interface LectureClickStats {
  lectureId: string
  lectureName: string
  views: number
  applyClicks: number
  shareClicks: number
  totalClicks: number
}

/**
 * 기본 통계 조회 (방문자, 페이지뷰 등)
 */
export async function fetchAnalyticsReport(days: number = 7): Promise<AnalyticsReport> {
  const { data } = await api.get<AnalyticsReport>(`/admin/analytics`, {
    params: { days },
  })
  return data
}

/**
 * 이벤트 통계 조회 (배너 클릭, 신청 등)
 */
export async function fetchEventStats(days: number = 7): Promise<EventStats> {
  const { data } = await api.get<EventStats>(`/admin/analytics/events`, {
    params: { days },
  })
  return data
}

/**
 * 배너 클릭 순위 조회
 */
export async function fetchTopBanners(days: number = 7, limit: number = 10): Promise<BannerClickStats[]> {
  const { data } = await api.get<BannerClickStats[]>(`/admin/analytics/events/top-banners`, {
    params: { days, limit },
  })
  return data
}

/**
 * 강의 클릭 순위 조회
 */
export async function fetchTopLectures(days: number = 7, limit: number = 10): Promise<LectureClickStats[]> {
  const { data } = await api.get<LectureClickStats[]>(`/admin/analytics/events/top-lectures`, {
    params: { days, limit },
  })
  return data
}

// =========================
// 인기 강의 & 인기 검색어
// =========================

export interface PopularLecture {
  lectureId: string
  lectureName: string
  views: number
}

export interface PopularSearchTerm {
  term: string
  count: number
}

/**
 * 인기 강의 조회 (페이지 조회수 기준)
 */
export async function fetchPopularLectures(days: number = 7, limit: number = 5): Promise<PopularLecture[]> {
  const { data } = await api.get<PopularLecture[]>(`/admin/analytics/popular-lectures`, {
    params: { days, limit },
  })
  return data
}

/**
 * 인기 검색어 조회
 */
export async function fetchPopularSearchTerms(days: number = 7, limit: number = 10): Promise<PopularSearchTerm[]> {
  const { data } = await api.get<PopularSearchTerm[]>(`/admin/analytics/popular-search-terms`, {
    params: { days, limit },
  })
  return data
}
