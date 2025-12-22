import { z } from 'zod'

import { LECTURE_DAYS } from '@/features/lecture/types/lecture.type'

export const lectureFormSchema = z
  .object({
    orgId: z.number(), // 기관 ID (수정 시 필수)
    lectureName: z.string().trim().min(1, '강의명은 필수입니다.'),
    lectureLoc: z.enum(['ONLINE', 'OFFLINE', 'MIXED']),
    location: z.string().trim().optional().nullable(),
    days: z.array(z.enum(LECTURE_DAYS)).min(1, '운영 요일을 1개 이상 선택해 주세요.'),

    startTime: z.string().trim().min(1, '시작 시간은 필수입니다.'), // HH:mm
    endTime: z.string().trim().min(1, '종료 시간은 필수입니다.'), // HH:mm

    recruitProcedures: z
      .array(
        z.object({
          type: z.enum(['DOCUMENT', 'CODING_TEST', 'INTERVIEW', 'PRE_TASK']),
        }),
      )
      .min(1, '선발 절차를 1개 이상 추가해 주세요.'),

    // backend: RecruitType
    recruitType: z.enum(['GENERAL', 'CARD_REQUIRED']),

    // 원 단위로 입력(0 이상 정수)
    subsidy: z.number().int().nonnegative('0 이상만 입력할 수 있어요.'),
    lectureFee: z.number().int().nonnegative('0 이상만 입력할 수 있어요.'),
    eduSubsidy: z.number().int().nonnegative('0 이상만 입력할 수 있어요.'),

    goal: z.string().trim().optional().nullable(),
    maxCapacity: z.number().int().positive('모집 정원은 1 이상이어야 합니다.').optional().nullable(),

    equipPc: z.enum(['NONE', 'PC', 'LAPTOP', 'PERSONAL']).optional().nullable(),
    equipMerit: z.string().trim().optional().nullable(),

    books: z.boolean(),
    resume: z.boolean(),
    mockInterview: z.boolean(),
    employmentHelp: z.boolean(),

    afterCompletion: z.boolean(),
    url: z.string().trim().url('올바른 URL 형식이 아닙니다.').optional().nullable(),
    lectureImageFile: z.any().optional().nullable(), // File | null

    // 강의 기간은 날짜로만 입력(전송 시 LocalDateTime으로 변환)
    startAtDate: z.date().refine(d => d instanceof Date && !Number.isNaN(d.getTime()), '강의 시작일은 필수입니다.'),
    endAtDate: z.date().refine(d => d instanceof Date && !Number.isNaN(d.getTime()), '강의 종료일은 필수입니다.'),

    deadlineDate: z.date().optional().nullable(),

    totalDays: z.number().int().positive('총 교육일수는 1 이상이어야 합니다.'),
    totalTimes: z.number().int().positive('총 교육시간은 1 이상이어야 합니다.'),

    projectNum: z.number().int().nonnegative().optional().nullable(),
    projectTime: z.number().int().nonnegative().optional().nullable(),
    projectTeam: z.string().trim().optional().nullable(),
    projectTool: z.string().trim().optional().nullable(),
    projectMentor: z.boolean().optional(),

    quals: z
      .array(
        z.object({
          type: z.enum(['REQUIRED', 'PREFERRED']),
          text: z.string().trim().min(1, '자격 요건 내용을 입력해 주세요.'),
        }),
      )
      .optional(),

    teachers: z
      .array(
        z.object({
          teacherId: z.number().optional().nullable(), // 기존 강사 선택 시 ID
          teacherName: z.string().trim().min(1, '강사명을 입력해 주세요.'),
          teacherDescription: z.string().trim().optional().nullable(),
          teacherImageFile: z.any().optional().nullable(), // File | null
          teacherImageUrl: z.string().optional().nullable(), // 기존 강사 이미지 URL
        }),
      )
      .min(1, '강사를 최소 1명 이상 등록해 주세요.'),

    adds: z
      .array(
        z.object({
          addName: z.string().trim().min(1, '추가 제공 항목명을 입력해 주세요.'),
        }),
      )
      .optional(),

    // 카테고리 및 커리큘럼
    categoryId: z.number().positive('카테고리를 선택해 주세요.').optional().nullable(),
    curriculums: z
      .array(
        z.object({
          curriculumId: z.number(),
          level: z.enum(['NONE', 'BASIC', 'ADVANCED']),
        }),
      )
      .optional(),
  })
  .superRefine((data, ctx) => {
    if (data.startAtDate && data.endAtDate && data.startAtDate > data.endAtDate) {
      ctx.addIssue({
        code: 'custom',
        path: ['startAtDate'],
        message: '강의 시작일은 종료일보다 앞서야 합니다.',
      })
      ctx.addIssue({
        code: 'custom',
        path: ['endAtDate'],
        message: '강의 종료일은 시작일보다 뒤여야 합니다.',
      })
    }

    // OFFLINE/MIXED면 location 필수
    if ((data.lectureLoc === 'OFFLINE' || data.lectureLoc === 'MIXED') && !data.location?.trim()) {
      ctx.addIssue({
        code: 'custom',
        path: ['location'],
        message: '오프라인 장소를 입력해 주세요.',
      })
    }

    // deadline은 backend에서 LocalDate로 파싱하므로 시간은 선택

    // 선발 절차는 중복 불가
    if (data.recruitProcedures?.length) {
      const types = data.recruitProcedures.map(p => p.type)
      const unique = new Set(types)
      if (unique.size !== types.length) {
        ctx.addIssue({
          code: 'custom',
          path: ['recruitProcedures'],
          message: '선발 절차는 중복으로 추가할 수 없습니다.',
        })
      }
    }
  })

export type LectureFormValues = z.infer<typeof lectureFormSchema>
