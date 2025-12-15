import type { LectureCreateRequest, LectureCreateResponse } from '@/features/lecture/types/lecture-request.type'
import type { LectureResponseDto } from '@/features/lecture/types/lecture-response.type'
import { api } from '@/lib/axios'

export const createLecture = async (payload: LectureCreateRequest): Promise<LectureCreateResponse> => {
  const res = await api.post('/lectures', payload)
  return res.data
}

export const getLectureSearch = async (queryString: string): Promise<LectureResponseDto[]> => {
  const path = queryString ? `/lectures/search?${queryString}` : '/lectures/search'
  const res = await api.get(path)

  const payload = res.data
  if (Array.isArray(payload)) return payload

  const wrappedCandidates = [payload?.data, payload?.items, payload?.content, payload?.lectures]
  for (const candidate of wrappedCandidates) {
    if (Array.isArray(candidate)) return candidate
  }

  throw new Error('Unexpected /lectures/search response shape')
}
