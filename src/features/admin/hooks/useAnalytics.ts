import { useQuery } from '@tanstack/react-query'

import { fetchAnalyticsReport, fetchEventStats, fetchTopBanners, fetchTopLectures } from '../api/analyticsApi'

export const analyticsKeys = {
  all: ['analytics'] as const,
  report: (days: number) => [...analyticsKeys.all, 'report', days] as const,
  events: (days: number) => [...analyticsKeys.all, 'events', days] as const,
  topBanners: (days: number, limit: number) => [...analyticsKeys.all, 'topBanners', days, limit] as const,
  topLectures: (days: number, limit: number) => [...analyticsKeys.all, 'topLectures', days, limit] as const,
}

export function useAnalyticsReportQuery(days: number = 7) {
  return useQuery({
    queryKey: analyticsKeys.report(days),
    queryFn: () => fetchAnalyticsReport(days),
    staleTime: 1000 * 60 * 5, // 5분
  })
}

export function useEventStatsQuery(days: number = 7) {
  return useQuery({
    queryKey: analyticsKeys.events(days),
    queryFn: () => fetchEventStats(days),
    staleTime: 1000 * 60 * 5, // 5분
  })
}

export function useTopBannersQuery(days: number = 7, limit: number = 10) {
  return useQuery({
    queryKey: analyticsKeys.topBanners(days, limit),
    queryFn: () => fetchTopBanners(days, limit),
    staleTime: 1000 * 60 * 5,
  })
}

export function useTopLecturesQuery(days: number = 7, limit: number = 10) {
  return useQuery({
    queryKey: analyticsKeys.topLectures(days, limit),
    queryFn: () => fetchTopLectures(days, limit),
    staleTime: 1000 * 60 * 5,
  })
}
