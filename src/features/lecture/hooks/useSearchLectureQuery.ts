import { useQuery } from '@tanstack/react-query'

import { getLectureSearch } from '@/features/lecture/api/lecture.api'
import type { LectureResponseDto } from '@/features/lecture/types/lecture-response.type'

export const useSearchLectureQuery = (queryString: string) => {
  return useQuery<LectureResponseDto[], unknown>({
    queryKey: ['lectures', 'search', queryString],
    queryFn: () => getLectureSearch(queryString),
  })
}
