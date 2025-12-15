import type { LectureCreateRequest } from '@/features/lecture/types/lecture-request.type'
import { toLocalTimeString, toLocalDateString } from '@/features/lecture/utils/inputFormat'
import type { LectureFormValues } from '@/features/lecture/validation/lectureFormSchema'

export const mapLectureFormToCreateRequest = (values: LectureFormValues): LectureCreateRequest => {
  // 현재는 업로드 없이 파일명만 저장(추후 S3 URL로 교체 예정)
  const lectureImageUrl = values.lectureImageFile?.name ?? null

  const osLabelMap: Record<'WINDOWS' | 'MACOS' | 'LINUX', string> = {
    WINDOWS: 'Windows',
    MACOS: 'macOS',
    LINUX: 'Linux',
  }

  const isEquipmentProvided = values.equipPc === 'PC' || values.equipPc === 'LAPTOP'
  const osLine =
    isEquipmentProvided && values.equipOs && values.equipOs.length > 0
      ? `OS: ${values.equipOs.map(v => osLabelMap[v]).join(', ')}`
      : null
  const equipMeritText = values.equipMerit?.trim() ? values.equipMerit.trim() : null
  const equipMeritMerged = [equipMeritText, osLine].filter(Boolean).join('\n')

  const steps = (values.recruitProcedures ?? []).map((p, idx) => ({
    stepType: p.type,
    stepOrder: idx + 1,
  }))

  const afterCompletion = values.afterCompletion

  return {
    lectureName: values.lectureName,
    days: values.days,
    startTime: toLocalTimeString(values.startTime),
    endTime: toLocalTimeString(values.endTime),
    lectureLoc: values.lectureLoc,
    location: values.location?.trim() ? values.location.trim() : null,
    recruitType: values.recruitType,
    subsidy: values.subsidy,
    lectureFee: values.lectureFee,
    eduSubsidy: values.eduSubsidy,
    goal: values.goal?.trim() ? values.goal.trim() : null,
    maxCapacity: values.maxCapacity ?? null,
    equipPc: values.equipPc ?? null,
    equipMerit: equipMeritMerged || null,
    books: values.books,
    resume: values.resume,
    mockInterview: values.mockInterview,
    employmentHelp: values.employmentHelp,
    afterCompletion,
    url: values.url?.trim() ? values.url.trim() : null,
    lectureImageUrl,
    projectNum: values.projectNum ?? null,
    projectTime: values.projectTime ?? null,
    projectTeam: values.projectTeam?.trim() ? values.projectTeam.trim() : null,
    projectTool: values.projectTool?.trim() ? values.projectTool.trim() : null,
    projectMentor: values.projectMentor ?? null,
    startAt: toLocalDateString(values.startAtDate),
    endAt: toLocalDateString(values.endAtDate),
    deadline: values.deadlineDate ? toLocalDateString(values.deadlineDate) : null,
    totalDays: values.totalDays,
    totalTimes: values.totalTimes,
    steps,
    quals: values.quals?.length ? values.quals : undefined,
    teachers: values.teachers?.length ? values.teachers : undefined,
    adds: values.adds?.length ? values.adds : undefined,
  }
}
