import { z } from 'zod'

export const lectureFormSchema = z
  .object({
    recruitStart: z.date().nullable().optional(),
    recruitEnd: z.date().nullable().optional(),
    lectureStart: z.date().nullable().optional(),
    lectureEnd: z.date().nullable().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.recruitStart && data.recruitEnd && data.recruitStart > data.recruitEnd) {
      ctx.addIssue({
        code: 'custom',
        path: ['recruitStart'],
        message: '모집 시작일은 종료일보다 앞서야 합니다.',
      })
      ctx.addIssue({
        code: 'custom',
        path: ['recruitEnd'],
        message: '모집 종료일은 시작일보다 뒤여야 합니다.',
      })
    }
    if (data.lectureStart && data.lectureEnd && data.lectureStart > data.lectureEnd) {
      ctx.addIssue({
        code: 'custom',
        path: ['lectureStart'],
        message: '강의 시작일은 종료일보다 앞서야 합니다.',
      })
      ctx.addIssue({
        code: 'custom',
        path: ['lectureEnd'],
        message: '강의 종료일은 시작일보다 뒤여야 합니다.',
      })
    }
  })

export type LectureFormValues = z.infer<typeof lectureFormSchema>
