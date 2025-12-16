import type { LectureResponseDto } from '@/features/lecture/types/lecture-response.type'
import type { LectureSummary, LectureTag } from '@/features/lecture/types/lecture.type'

const toDatePart = (value: string | null | undefined) => {
  if (!value) return ''
  return value.includes('T') ? (value.split('T')[0] ?? '') : value
}

export const mapLectureResponseToSummary = (dto: LectureResponseDto): LectureSummary => {
  const tags: LectureTag[] = []

  // 1. Category Name (Top priority)
  if (dto.categoryName) {
    tags.push({ id: `cat-${dto.categoryName}`, name: dto.categoryName })
  }

  // 2. Localized Recruit Type
  const recruitTypeMap: Record<string, string> = {
    CARD_REQUIRED: '내배카 필요 O',
    GENERAL: '내배카 필요 X',
  }
  if (dto.recruitType) {
    const name = recruitTypeMap[dto.recruitType] || dto.recruitType
    tags.push({ id: `recruit-${dto.recruitType}`, name })
  }

  // 3. Localized Location
  const locMap: Record<string, string> = {
    ONLINE: '온라인',
    OFFLINE: '오프라인',
    MIXED: '온오프혼합',
  }
  if (dto.lectureLoc) {
    const name = locMap[dto.lectureLoc] || dto.lectureLoc
    tags.push({ id: `loc-${dto.lectureLoc}`, name })
  }

  // 4. Total Days / Times (Optional)
  if (dto.totalDays) {
    tags.push({ id: `days-${dto.totalDays}`, name: `${dto.totalDays}일 과정` })
  } else if (dto.totalTimes) {
    tags.push({ id: `times-${dto.totalTimes}`, name: `${dto.totalTimes}시간 과정` })
  }

  return {
    id: String(dto.lectureId),
    title: dto.lectureName,
    organization: dto.orgName ?? '',
    periodStart: toDatePart(dto.startAt),
    periodEnd: toDatePart(dto.endAt),
    tags,
    imageUrl: dto.lectureImageUrl ?? undefined,
    status: dto.status ?? undefined, // Pass status for badge
    averageScore: dto.averageScore ?? undefined, // Pass score for star rating
    reviewCount: dto.reviewCount ?? undefined, // Pass review count
  }
}
