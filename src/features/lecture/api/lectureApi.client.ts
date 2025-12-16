import { api } from '@/lib/axios'

import { mapApiLectureDetailToLectureDetail } from './lectureApi.mapper'
import { ApiLectureDetail, LectureDetail } from './lectureApi.types'

/**
 *   강의 상세 조회 API
 * - 서버에서 데이터를 가져온 후
 * - 프론트에서 사용하는 형태로 변환해서 반환
 */
export async function getLectureDetail(lectureId: string | number): Promise<LectureDetail> {
  const { data } = await api.get<ApiLectureDetail>(`/lectures/${lectureId}`)
  return mapApiLectureDetailToLectureDetail(data)
}
