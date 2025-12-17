'use client'

import { useQueries } from '@tanstack/react-query'

import { useCartLecturesQuery } from '@/features/cart/hooks/useCartLecturesQuery'
import { getLectureDetail } from '@/features/lecture/api/lectureApi'

export function useCartLecturesWithDetailQuery() {
  const cartQuery = useCartLecturesQuery()

  const items = cartQuery.data ?? []
  const lectureIds = Array.from(
    new Set(items.filter(item => !item.orgName || !item.title || !item.thumbnailUrl).map(item => item.lectureId)),
  )

  const detailQueries = useQueries({
    queries: lectureIds.map(lectureId => ({
      queryKey: ['lectureDetail', lectureId],
      queryFn: () => getLectureDetail(lectureId),
      enabled: cartQuery.isSuccess,
      staleTime: 1000 * 60,
    })),
  })

  const detailByLectureId = new Map<string, { title?: string; orgName?: string; thumbnailUrl?: string }>()

  for (const q of detailQueries) {
    if (!q.data) continue
    detailByLectureId.set(q.data.id, {
      title: q.data.title,
      orgName: q.data.orgName,
      thumbnailUrl: q.data.thumbnailUrl,
    })
  }

  const enrichedData = items.map(item => {
    const detail = detailByLectureId.get(item.lectureId)
    return {
      ...item,
      title: item.title || detail?.title || item.lectureId,
      orgName: item.orgName || detail?.orgName,
      thumbnailUrl: item.thumbnailUrl || detail?.thumbnailUrl,
    }
  })

  return {
    ...cartQuery,
    data: enrichedData,
  }
}
