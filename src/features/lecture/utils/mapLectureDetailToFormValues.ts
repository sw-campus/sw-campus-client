import type { CategoryTreeNode } from '@/features/category/types/category.type'
import type { LectureResponseDto } from '@/features/lecture/types/lecture-response.type'
import type { LectureFormValues } from '@/features/lecture/validation/lectureFormSchema'

/**
 * 카테고리 트리에서 이름으로 카테고리 ID 찾기
 */
const findCategoryIdByName = (categoryName: string | null, categoryTree: CategoryTreeNode[]): number | null => {
  if (!categoryName) return null

  for (const category of categoryTree) {
    if (category.categoryName === categoryName) {
      return category.categoryId
    }
    // 자식 카테고리 검색
    if (category.children?.length) {
      const found = findCategoryIdByName(categoryName, category.children)
      if (found) return found
    }
  }
  return null
}

/**
 * 강의 상세 응답을 폼 값으로 변환
 * - 서버 응답 데이터를 수정 폼에 채우기 위한 매퍼
 * @param detail 강의 상세 응답
 * @param categoryTree 카테고리 트리 (categoryName에서 categoryId를 찾기 위해 필요)
 */
export const mapLectureDetailToFormValues = (
  detail: LectureResponseDto,
  categoryTree?: CategoryTreeNode[],
): LectureFormValues => {
  // 날짜 문자열을 Date로 변환 (yyyy-MM-dd 또는 yyyy-MM-ddTHH:mm:ss 형식)
  const parseDate = (dateStr: string | null): Date | null => {
    if (!dateStr) return null
    const parsed = new Date(dateStr)
    return isNaN(parsed.getTime()) ? null : parsed
  }

  // 시간 문자열 변환 (HH:mm:ss -> HH:mm)
  const formatTime = (timeStr: string | null): string => {
    if (!timeStr) return ''
    // HH:mm:ss 형식이면 HH:mm으로 변환
    const parts = timeStr.split(':')
    if (parts.length >= 2) {
      return `${parts[0]}:${parts[1]}`
    }
    return timeStr
  }

  // 선발 절차 매핑
  const recruitProcedures =
    detail.steps?.map(step => ({
      type: step.stepType as 'DOCUMENT' | 'CODING_TEST' | 'INTERVIEW' | 'PRE_TASK',
    })) ?? []

  // 지원 자격 매핑
  const quals =
    detail.quals?.map(qual => ({
      type: (qual.type as 'REQUIRED' | 'PREFERRED') ?? 'REQUIRED',
      text: qual.text ?? '',
    })) ?? []

  // 강사 매핑
  const teachers =
    detail.teachers?.map(teacher => ({
      teacherId: teacher.teacherId,
      teacherName: teacher.teacherName ?? '',
      teacherDescription: null,
      teacherImageFile: null,
      teacherImageUrl: teacher.teacherImageUrl ?? null,
    })) ?? []

  // 추가 혜택 매핑
  const adds =
    detail.adds?.map(add => ({
      addName: add.addName ?? '',
    })) ?? []

  // 커리큘럼 매핑
  const curriculums =
    detail.curriculums?.map(curr => ({
      curriculumId: curr.curriculumId,
      level: (curr.level as 'NONE' | 'BASIC' | 'ADVANCED') ?? 'NONE',
    })) ?? []

  // 카테고리 ID (백엔드에서 직접 받은 ID 사용)
  // 만약 백엔드에서 null을 준다면 기존 로직(이름 기반 찾기)으로 fallback하거나 null 처리
  // 여기서는 백엔드가 categoryId를 준다고 가정하고 우선 사용
  const categoryId =
    detail.categoryId ?? (categoryTree ? findCategoryIdByName(detail.categoryName, categoryTree) : null)

  return {
    orgId: detail.orgId,
    lectureName: detail.lectureName ?? '',
    lectureLoc: (detail.lectureLoc as 'ONLINE' | 'OFFLINE' | 'MIXED') ?? 'OFFLINE',
    location: detail.location ?? null,
    days: (detail.days ?? []) as ('MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY')[],
    startTime: formatTime(detail.startTime),
    endTime: formatTime(detail.endTime),
    recruitProcedures: recruitProcedures.length > 0 ? recruitProcedures : [{ type: 'DOCUMENT' as const }],
    recruitType: (detail.recruitType as 'GENERAL' | 'CARD_REQUIRED') ?? 'GENERAL',
    subsidy: detail.subsidy ?? 0,
    lectureFee: detail.lectureFee ?? 0,
    eduSubsidy: detail.eduSubsidy ?? 0,
    goal: detail.goal ?? null,
    maxCapacity: detail.maxCapacity ?? null,
    equipPc: (detail.equipPc as 'NONE' | 'PC' | 'LAPTOP' | 'PERSONAL') ?? null,
    equipMerit: detail.equipMerit ?? null,
    books: detail.books ?? false,
    resume: detail.resume ?? false,
    mockInterview: detail.mockInterview ?? false,
    employmentHelp: detail.employmentHelp ?? false,
    afterCompletion: !!detail.afterCompletion,
    url: detail.url ?? null,
    lectureImageFile: null, // 기존 이미지는 URL로만 표시
    startAtDate: parseDate(detail.startAt),
    endAtDate: parseDate(detail.endAt),
    deadlineDate: parseDate(detail.deadline),
    totalDays: detail.totalDays ?? 1,
    totalTimes: detail.totalTimes ?? 1,
    projectNum: detail.projectNum ?? null,
    projectTime: detail.projectTime ?? null,
    projectTeam: detail.projectTeam ?? null,
    projectTool: detail.projectTool ?? null,
    projectMentor: detail.projectMentor ?? false,
    quals: quals.length > 0 ? quals : undefined,
    teachers:
      teachers.length > 0
        ? teachers
        : [
            {
              teacherId: null,
              teacherName: '',
              teacherDescription: null,
              teacherImageFile: null,
              teacherImageUrl: null,
            },
          ],
    adds: adds.length > 0 ? adds : undefined,
    categoryId,
    curriculums: curriculums.length > 0 ? curriculums : undefined,
  }
}
