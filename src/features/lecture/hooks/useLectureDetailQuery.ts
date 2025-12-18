import { useQuery } from '@tanstack/react-query'

import { getLectureDetail, type LectureDetail } from '@/features/lecture/api/lectureApi'

export function useLectureDetailQuery(lectureId: string | null | undefined) {
  return useQuery<LectureDetail, unknown>({
    queryKey: ['lectureDetail', lectureId],
    queryFn: () => getLectureDetail(lectureId!),
    enabled: !!lectureId,
    staleTime: 1000 * 60,
  })
}
