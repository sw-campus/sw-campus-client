import type { LectureResponseDto } from '@/features/lecture/types/lecture-response.type'
import type { LectureSummary, LectureTag } from '@/features/lecture/types/lecture.type'

const toDatePart = (value: string | null | undefined) => {
  if (!value) return ''
  return value.includes('T') ? (value.split('T')[0] ?? '') : value
}

export const mapLectureResponseToSummary = (dto: LectureResponseDto): LectureSummary => {
  const tags: LectureTag[] = []

  if (dto.recruitType) tags.push({ id: `recruit-${dto.recruitType}`, name: dto.recruitType })
  if (dto.lectureLoc) tags.push({ id: `loc-${dto.lectureLoc}`, name: dto.lectureLoc })
  if (dto.status) tags.push({ id: `status-${dto.status}`, name: dto.status })

  if (tags.length === 0) tags.push({ id: 'lecture', name: 'LECTURE' })

  return {
    id: String(dto.lectureId),
    title: dto.lectureName,
    organization: dto.orgName ?? '',
    periodStart: toDatePart(dto.startAt),
    periodEnd: toDatePart(dto.endAt),
    tags,
    imageUrl: dto.lectureImageUrl ?? undefined,
  }
}
