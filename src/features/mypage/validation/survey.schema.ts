import { z } from 'zod'

// Learning Method enum
export const learningMethodSchema = z.enum(['ONLINE', 'OFFLINE', 'MIXED'])

// Desired Job enum
export const desiredJobSchema = z.enum(['BACKEND', 'FRONTEND', 'DATA', 'AI', 'MOBILE', 'OTHER'])

// Budget Range enum
export const budgetRangeSchema = z.enum(['UNDER_50', 'RANGE_50_100', 'RANGE_100_200', 'OVER_200'])

// Job Type Code enum (for Part 3)
export const jobTypeCodeSchema = z.enum(['F', 'B', 'D'])

/**
 * 기초 설문 폼 스키마
 */
export const basicSurveySchema = z.object({
  major: z
    .string()
    .min(1, '전공을 입력해주세요.')
    .max(100, '전공은 100자 이내로 입력해주세요.'),
  hasProgrammingExperience: z.boolean(),
  bootcampName: z.string().nullable(),
  preferredLearningMethod: learningMethodSchema,
  desiredJobs: z
    .array(desiredJobSchema)
    .min(1, '최소 1개 이상의 희망 직무를 선택해주세요.'),
  desiredJobOther: z.string().nullable(),
  affordableBudgetRange: budgetRangeSchema,
}).refine(
  (data) => {
    // 프로그래밍 경험이 있으면 bootcampName이 있어야 함 (선택사항이지만 권장)
    // 여기서는 경험 있음 선택 시에만 bootcampName 입력 가능하도록
    if (!data.hasProgrammingExperience && data.bootcampName) {
      return false
    }
    return true
  },
  {
    message: '프로그래밍 경험이 없는 경우 부트캠프명을 입력할 수 없습니다.',
    path: ['bootcampName'],
  }
).refine(
  (data) => {
    // 기타를 선택한 경우 desiredJobOther가 있어야 함
    if (data.desiredJobs.includes('OTHER') && (!data.desiredJobOther || data.desiredJobOther.trim() === '')) {
      return false
    }
    return true
  },
  {
    message: '기타 직무를 선택한 경우 내용을 입력해주세요.',
    path: ['desiredJobOther'],
  }
)

export type BasicSurveyFormValues = z.infer<typeof basicSurveySchema>

/**
 * 성향 테스트 Part 1 스키마 (논리/사고력)
 */
export const aptitudeTestPart1Schema = z.object({
  q1: z.number().min(1).max(3),
  q2: z.number().min(1).max(3),
  q3: z.number().min(1).max(3),
  q4: z.number().min(1).max(3),
})

/**
 * 성향 테스트 Part 2 스키마 (끈기/학습태도)
 */
export const aptitudeTestPart2Schema = z.object({
  q5: z.number().min(1).max(3),
  q6: z.number().min(1).max(3),
  q7: z.number().min(1).max(3),
  q8: z.number().min(1).max(3),
})

/**
 * 성향 테스트 Part 3 스키마 (직무성향)
 */
export const aptitudeTestPart3Schema = z.object({
  q9: jobTypeCodeSchema,
  q10: jobTypeCodeSchema,
  q11: jobTypeCodeSchema,
  q12: jobTypeCodeSchema,
  q13: jobTypeCodeSchema,
  q14: jobTypeCodeSchema,
  q15: jobTypeCodeSchema,
})

/**
 * 성향 테스트 전체 스키마
 */
export const aptitudeTestSchema = z.object({
  part1Answers: aptitudeTestPart1Schema,
  part2Answers: aptitudeTestPart2Schema,
  part3Answers: aptitudeTestPart3Schema,
})

export type AptitudeTestFormValues = z.infer<typeof aptitudeTestSchema>
