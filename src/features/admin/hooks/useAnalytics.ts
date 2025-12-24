import { useQuery } from '@tanstack/react-query'

import {
  fetchAnalyticsReport,
  fetchEventStats,
  fetchPopularLectures,
  fetchPopularSearchTerms,
  fetchTopBanners,
  fetchTopLectures,
} from '../api/analyticsApi'

export const analyticsKeys = {
  all: ['analytics'] as const,
  report: (days: number) => [...analyticsKeys.all, 'report', days] as const,
  events: (days: number) => [...analyticsKeys.all, 'events', days] as const,
  topBanners: (days: number, limit: number) => [...analyticsKeys.all, 'topBanners', days, limit] as const,
  topLectures: (days: number, limit: number) => [...analyticsKeys.all, 'topLectures', days, limit] as const,
  popularLectures: (days: number, limit: number) => [...analyticsKeys.all, 'popularLectures', days, limit] as const,
  popularSearchTerms: (days: number, limit: number) =>
    [...analyticsKeys.all, 'popularSearchTerms', days, limit] as const,
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

export function usePopularLecturesQuery(days: number = 7, limit: number = 5) {
  return useQuery({
    queryKey: analyticsKeys.popularLectures(days, limit),
    queryFn: () => fetchPopularLectures(days, limit),
    staleTime: 1000 * 60 * 5,
  })
}

export function usePopularSearchTermsQuery(days: number = 7, limit: number = 10) {
  return useQuery({
    queryKey: analyticsKeys.popularSearchTerms(days, limit),
    queryFn: () => fetchPopularSearchTerms(days, limit),
    staleTime: 1000 * 60 * 5,
  })
}
