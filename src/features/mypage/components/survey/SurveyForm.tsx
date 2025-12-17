'use client'

import { useState } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { FormProvider, useForm } from 'react-hook-form'
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

export function SurveyForm() {
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

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <FieldSet>
          <FieldGroup className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label htmlFor="major" className="mb-1 block font-medium">
                전공<span className="text-red-500">*</span>
              </label>
              <input
                id="major"
                type="text"
                {...register('major')}
                className="w-full rounded border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              {errors.major && <p className="mt-1 text-sm text-red-600">{errors.major.message}</p>}
            </div>

            <div>
              <label htmlFor="affordableAmount" className="mb-1 block font-medium">
                가능 금액(원)<span className="text-red-500">*</span>
              </label>
              <input
                id="affordableAmount"
                type="number"
                inputMode="numeric"
                {...register('affordableAmount')}
                className="w-full rounded border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              {errors.affordableAmount && (
                <p className="mt-1 text-sm text-red-600">{errors.affordableAmount.message as string}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <label htmlFor="wantedJobs" className="mb-1 block font-medium">
                희망 직무<span className="text-red-500">*</span>
              </label>
              <textarea
                id="wantedJobs"
                rows={3}
                {...register('wantedJobs')}
                className="w-full rounded border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              {errors.wantedJobs && <p className="mt-1 text-sm text-red-600">{errors.wantedJobs.message}</p>}
            </div>

            <div className="md:col-span-2">
              <label htmlFor="licenses" className="mb-1 block font-medium">
                자격증<span className="text-red-500">*</span>
              </label>
              <textarea
                id="licenses"
                rows={3}
                {...register('licenses')}
                className="w-full rounded border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              {errors.licenses && <p className="mt-1 text-sm text-red-600">{errors.licenses.message}</p>}
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

          <div className="flex gap-2 pt-4">
            <Button type="submit" disabled={!isValid || isPending || upsertSurvey.isPending}>
              저장
            </Button>
            <Button variant="outline" type="button" onClick={() => router.back()} disabled={isPending}>
              취소
            </Button>
          </div>
        </FieldSet>
      </form>
    </FormProvider>
  )
}
