'use client'

import { useState } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { FormProvider, useForm } from 'react-hook-form'
import { FiX } from 'react-icons/fi'
import { toast } from 'sonner'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { FieldGroup, FieldSet } from '@/components/ui/field'
import { api } from '@/lib/axios'

const surveySchema = z.object({
  major: z.string().min(1, '전공을 입력해주세요.'),
  bootcampCompleted: z.boolean(),
  wantedJobs: z.string().min(1, '희망 직무를 입력해주세요.'),
  licenses: z.string().min(1, '자격증을 입력해주세요.'),
  hasGovCard: z.boolean(),
  affordableAmount: z
    .union([z.number(), z.string()])
    .transform(v => (typeof v === 'string' ? Number(v) : v))
    .refine(v => Number.isFinite(v) && v >= 0, '가능 금액은 0 이상 숫자여야 합니다.'),
})
type SurveyFormValues = z.infer<typeof surveySchema>

// PersonalForm과 동일 톤의 입력 스타일
const INPUT_CLASS =
  'h-10 w-full rounded-md border border-gray-200 bg-white px-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-amber-300 focus:ring-2 focus:ring-amber-200 focus:outline-none'

const TEXTAREA_CLASS =
  'w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-amber-300 focus:ring-2 focus:ring-amber-200 focus:outline-none'

export function SurveyForm({ embedded = false }: { embedded?: boolean }) {
  const router = useRouter()
  const [isPending, setIsPending] = useState(false)

  const methods = useForm<SurveyFormValues>({
    resolver: zodResolver(surveySchema),
    mode: 'onChange',
    defaultValues: {
      major: '',
      bootcampCompleted: false,
      wantedJobs: '',
      licenses: '',
      hasGovCard: false,
      affordableAmount: 0,
    },
  })

  const upsertSurvey = useMutation({
    mutationFn: async (payload: SurveyFormValues) => {
      // Swagger 기준: PUT /api/v1/mypage/survey
      // baseURL = NEXT_PUBLIC_API_URL (예: http://localhost:8080/api/v1)
      await api.put('/mypage/survey', payload)
    },
  })

  const {
    handleSubmit,
    formState: { isValid, errors },
    register,
  } = methods

  const onSubmit = async (values: SurveyFormValues) => {
    setIsPending(true)
    try {
      await upsertSurvey.mutateAsync(values)
      toast.success('설문조사가 저장되었습니다.')
      router.back()
    } finally {
      setIsPending(false)
    }
  }

  const formContent = (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <FieldSet>
          <FieldGroup className="grid grid-cols-1 gap-6">
            <div>
              <label htmlFor="major" className="mb-1 block text-sm font-medium text-gray-800">
                전공<span className="text-red-500">*</span>
              </label>
              <input id="major" type="text" {...register('major')} className={INPUT_CLASS} />
              {errors.major && <p className="mt-1 text-xs text-red-600">{errors.major.message}</p>}
            </div>

            <div>
              <label htmlFor="affordableAmount" className="mb-1 block text-sm font-medium text-gray-800">
                가능 금액(원)<span className="text-red-500">*</span>
              </label>
              <input
                id="affordableAmount"
                type="number"
                inputMode="numeric"
                {...register('affordableAmount')}
                className={INPUT_CLASS}
              />
              {errors.affordableAmount && (
                <p className="mt-1 text-xs text-red-600">{errors.affordableAmount.message as string}</p>
              )}
            </div>

            <div>
              <label htmlFor="wantedJobs" className="mb-1 block text-sm font-medium text-gray-800">
                희망 직무<span className="text-red-500">*</span>
              </label>
              <textarea id="wantedJobs" rows={3} {...register('wantedJobs')} className={TEXTAREA_CLASS} />
              {errors.wantedJobs && <p className="mt-1 text-xs text-red-600">{errors.wantedJobs.message}</p>}
            </div>

            <div>
              <label htmlFor="licenses" className="mb-1 block text-sm font-medium text-gray-800">
                자격증<span className="text-red-500">*</span>
              </label>
              <textarea id="licenses" rows={3} {...register('licenses')} className={TEXTAREA_CLASS} />
              {errors.licenses && <p className="mt-1 text-xs text-red-600">{errors.licenses.message}</p>}
            </div>

            <div className="flex items-center gap-3">
              <input
                id="bootcampCompleted"
                type="checkbox"
                {...register('bootcampCompleted')}
                className="h-4 w-4 rounded border-gray-300"
              />
              <label htmlFor="bootcampCompleted" className="font-medium">
                부트캠프 수료
              </label>
            </div>

            <div className="flex items-center gap-3">
              <input
                id="hasGovCard"
                type="checkbox"
                {...register('hasGovCard')}
                className="h-4 w-4 rounded border-gray-300"
              />
              <label htmlFor="hasGovCard" className="font-medium">
                국민내일배움카드 보유
              </label>
            </div>
          </FieldGroup>

          <div className="pt-2">
            <Button
              type="submit"
              disabled={!isValid || isPending || upsertSurvey.isPending}
              className="h-11 w-full rounded-md bg-gray-900 px-6 text-sm font-semibold text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-500"
            >
              {isPending || upsertSurvey.isPending ? '저장 중...' : '저장'}
            </Button>
          </div>
        </FieldSet>
      </form>
    </FormProvider>
  )

  if (embedded) {
    return (
      <div className="mx-auto w-full">
        <div className="px-0 pt-0 pb-0">{formContent}</div>
      </div>
    )
  }

  return (
    <div className="mx-auto w-full">
      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-gray-200 px-8 py-6">
          <h2 className="text-xl font-semibold text-gray-900">개인 정보 수정</h2>
          <button
            type="button"
            onClick={() => router.back()}
            className="inline-flex h-10 w-10 items-center justify-center rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-800"
            aria-label="닫기"
          >
            <FiX className="h-5 w-5" aria-hidden />
          </button>
        </div>
        <div className="px-8 py-6">{formContent}</div>
      </div>
    </div>
  )
}
