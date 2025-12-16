import type { LectureCreateRequest } from '@/features/lecture/types/lecture-request.type'
import { toLocalTimeString, toLocalDateString } from '@/features/lecture/utils/inputFormat'
import type { LectureFormValues } from '@/features/lecture/validation/lectureFormSchema'

export const mapLectureFormToCreateRequest = (values: LectureFormValues): LectureCreateRequest => {
  console.log('Mapper received lectureImageFile:', values.lectureImageFile)
  // 파일명은 로깅/참조용으로 전송되며, 실제 파일은 FormData를 통해 서버로 전송되어 S3에 업로드됩니다.
  const lectureImageUrl = values.lectureImageFile?.name ?? null

  const steps = (values.recruitProcedures ?? []).map((p, idx) => ({
    stepType: p.type,
    stepOrder: idx + 1,
  }))

  const afterCompletion = values.afterCompletion

  // 커리큘럼 매핑
  const curriculums = values.curriculums?.length
    ? values.curriculums.map(c => ({
        curriculumId: c.curriculumId,
        level: c.level,
      }))
    : undefined

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
    equipMerit: values.equipMerit?.trim() ? values.equipMerit.trim() : null,
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
    teachers: values.teachers?.length
      ? values.teachers.map(t => ({
          teacherName: t.teacherName,
          teacherDescription: t.teacherDescription ?? null,
          teacherImageUrl: t.teacherImageFile?.name ?? null,
        }))
      : undefined,
    adds: values.adds?.length ? values.adds : undefined,
    curriculums,
  }
}
