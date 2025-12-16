import { ApiLectureDetail, LectureDetail } from './lectureApi.types'

/**
 *   API 응답 → 프론트 타입 변환 함수
 * - 백엔드 구조와 UI 구조를 분리하기 위한 매핑 레이어
 * - API 변경 시 이 함수만 수정하면 됨
 */
export function mapApiLectureDetailToLectureDetail(api: ApiLectureDetail): LectureDetail {
  return {
    id: String(api.lectureId),
    title: api.lectureName,
    orgName: api.orgName,
    tags: [api.categoryName, api.recruitType].filter(Boolean),
    thumbnailUrl: api.lectureImageUrl,
    summary: api.goal,
    schedule: {
      recruitPeriod: { start: api.deadline, end: api.startAt },
      coursePeriod: { start: api.startAt, end: api.endAt },
      days: api.days.map(day => dayKor(day)).join(', '),
      time: `${api.startTime.slice(0, 5)} - ${api.endTime.slice(0, 5)}`,
      totalHours: api.totalTimes,
    },
    support: {
      tuition: api.lectureFee,
      stipend: api.subsidy ? `월 ${api.subsidy.toLocaleString()}원` : undefined,
      extraSupport: api.eduSubsidy ? `교육비 지원 ${api.eduSubsidy.toLocaleString()}원` : undefined,
    },
    location: api.location,
    recruitStatus: api.status === 'RECRUITING' ? 'OPEN' : api.status === 'DRAFT' ? 'DRAFT' : 'CLOSED',
    photos: api.orgFacilityImageUrls ?? [],
  }
}

/**
 *   요일 영문(enum) → 한글 변환 함수
 */
const DAY_KOR_MAP: Record<string, string> = {
  MONDAY: '월',
  TUESDAY: '화',
  WEDNESDAY: '수',
  THURSDAY: '목',
  FRIDAY: '금',
  SATURDAY: '토',
  SUNDAY: '일',
}

export function dayKor(day: string): string {
  return DAY_KOR_MAP[day] ?? day
}
