import { api } from '@/lib/axios'

export interface AnalyticsReport {
  totalUsers: number
  activeUsers: number
  pageViews: number
  sessions: number
  dailyStats: DailyStat[]
}

export interface DailyStat {
  date: string
  activeUsers: number
  pageViews: number
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
