import { z } from 'zod'

import { LECTURE_DAYS } from '@/features/lecture/types/lecture.type'

/**
 * 단계별 필드 검증을 위한 스키마
 * 각 단계 전환 시 해당 단계의 필드만 검증
 */

// Step 1: 기본 정보 (BasicInfo, Category, Curriculum)
export const step1Schema = z.object({
  lectureName: z.string().trim().min(1, '강의명은 필수입니다.'),
  lectureImageFile: z.any().optional().nullable(),
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

// Step 2: 일정 및 장소 (Location, Schedule)
export const step2Schema = z
  .object({
    lectureLoc: z.enum(['ONLINE', 'OFFLINE', 'MIXED']),
    location: z.string().trim().optional().nullable(),
    days: z.array(z.enum(LECTURE_DAYS)).min(1, '운영 요일을 1개 이상 선택해 주세요.'),
    startTime: z.string().trim().min(1, '시작 시간은 필수입니다.'),
    endTime: z.string().trim().min(1, '종료 시간은 필수입니다.'),
    startAtDate: z.date().optional().nullable(),
    endAtDate: z.date().optional().nullable(),
    totalDays: z.number().int().positive('총 교육일수는 1 이상이어야 합니다.'),
    totalTimes: z.number().int().positive('총 교육시간은 1 이상이어야 합니다.'),
    deadlineDate: z.date().optional().nullable(),
  })
  .superRefine((data, ctx) => {
    if ((data.lectureLoc === 'OFFLINE' || data.lectureLoc === 'MIXED') && !data.location?.trim()) {
      ctx.addIssue({
        code: 'custom',
        path: ['location'],
        message: '오프라인 장소를 입력해 주세요.',
      })
    }
    if (data.startAtDate && data.endAtDate && data.startAtDate > data.endAtDate) {
      ctx.addIssue({
        code: 'custom',
        path: ['startAtDate'],
        message: '강의 시작일은 종료일보다 앞서야 합니다.',
      })
    }
  })

// Step 3: 모집 및 비용 (RecruitProcedure, Qualification, Cost)
export const step3Schema = z
  .object({
    recruitProcedures: z
      .array(
        z.object({
          type: z.enum(['DOCUMENT', 'CODING_TEST', 'INTERVIEW', 'PRE_TASK']),
        }),
      )
      .optional(),
    quals: z
      .array(
        z.object({
          type: z.enum(['REQUIRED', 'PREFERRED']),
          text: z.string().trim().min(1, '자격 요건 내용을 입력해 주세요.'),
        }),
      )
      .optional(),
    recruitType: z.enum(['GENERAL', 'CARD_REQUIRED']),
    subsidy: z.number().int().nonnegative('0 이상만 입력할 수 있어요.'),
    lectureFee: z.number().int().nonnegative('0 이상만 입력할 수 있어요.'),
    eduSubsidy: z.number().int().nonnegative('0 이상만 입력할 수 있어요.'),
    maxCapacity: z.number().int().positive('모집 정원은 1 이상이어야 합니다.').optional().nullable(),
    goal: z.string().trim().optional().nullable(),
  })
  .superRefine((data, ctx) => {
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

// Step 4: 옵션 및 환경 (Options, Equipment, Project)
export const step4Schema = z.object({
  books: z.boolean(),
  resume: z.boolean(),
  mockInterview: z.boolean(),
  employmentHelp: z.boolean(),
  afterCompletion: z.boolean(),
  url: z.string().trim().url('올바른 URL 형식이 아닙니다.').optional().nullable().or(z.literal('')),
  equipPc: z.enum(['NONE', 'PC', 'LAPTOP', 'PERSONAL']).optional().nullable(),
  equipMerit: z.string().trim().optional().nullable(),
  projectNum: z.number().int().nonnegative().optional().nullable(),
  projectTime: z.number().int().nonnegative().optional().nullable(),
  projectTeam: z.string().trim().optional().nullable(),
  projectTool: z.string().trim().optional().nullable(),
  projectMentor: z.boolean().optional(),
})

// Step 5: 강사 및 추가 정보 (Teachers, Adds)
export const step5Schema = z.object({
  teachers: z
    .array(
      z.object({
        teacherId: z.number().optional().nullable(),
        teacherName: z.string().trim().min(1, '강사명을 입력해 주세요.'),
        teacherDescription: z.string().trim().optional().nullable(),
        teacherImageFile: z.any().optional().nullable(),
        teacherImageUrl: z.string().optional().nullable(),
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
})

// 단계별 스키마 배열
export const stepSchemas = [step1Schema, step2Schema, step3Schema, step4Schema, step5Schema] as const

// 단계별 필드 이름
export const stepFields = {
  0: ['lectureName', 'lectureImageFile', 'categoryId', 'curriculums'],
  1: [
    'lectureLoc',
    'location',
    'days',
    'startTime',
    'endTime',
    'startAtDate',
    'endAtDate',
    'totalDays',
    'totalTimes',
    'deadlineDate',
  ],
  2: ['recruitProcedures', 'quals', 'recruitType', 'subsidy', 'lectureFee', 'eduSubsidy', 'maxCapacity', 'goal'],
  3: [
    'books',
    'resume',
    'mockInterview',
    'employmentHelp',
    'afterCompletion',
    'url',
    'equipPc',
    'equipMerit',
    'projectNum',
    'projectTime',
    'projectTeam',
    'projectTool',
    'projectMentor',
  ],
  4: ['teachers', 'adds'],
} as const

export type StepIndex = keyof typeof stepFields
