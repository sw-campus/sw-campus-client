'use client'

import { useEffect, useState } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { FormProvider, useForm } from 'react-hook-form'
import { FiX } from 'react-icons/fi'
import { toast } from 'sonner'
import { z } from 'zod'

import { Button } from '@/components/ui/Button'
import { FieldGroup, FieldSet } from '@/components/ui/Field'
import { api } from '@/lib/axios'

const surveySchema = z.object({
  major: z.string().min(1, '전공을 입력해주세요.'),
  bootcampCompleted: z.boolean(),
  hasGovCard: z.boolean(),
  affordableAmount: z.number().min(0, '가능 금액은 0 이상 숫자여야 합니다.'),
})
type SurveyFormValues = z.infer<typeof surveySchema>

// GET /api/v1/mypage/survey 응답(저장된 설문이 있으면 반환)
type MySurveyResponse = {
  memberId: number
  major: string
  bootcampCompleted: boolean
  hasGovCard: boolean
  affordableAmount: number
  createdAt: string
  updatedAt: string
}

// PersonalForm과 동일 톤의 입력 스타일
const INPUT_CLASS =
  'h-10 w-full rounded-md border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/20 focus:outline-none'

export function SurveyForm({ embedded = false }: { embedded?: boolean }) {
  const router = useRouter()
  const [isPending, setIsPending] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const methods = useForm<SurveyFormValues>({
    resolver: zodResolver(surveySchema),
    mode: 'onChange',
    defaultValues: {
      major: '',
      bootcampCompleted: false,
      hasGovCard: false,
      affordableAmount: 0,
    },
  })

  const upsertSurvey = useMutation({
    mutationFn: async (payload: SurveyFormValues) => {
      await api.put('/mypage/survey', payload)
    },
  })

  const {
    handleSubmit,
    formState: { isValid, errors },
    register,
  } = methods

  useEffect(() => {
    let mounted = true

    const load = async () => {
      setIsLoading(true)
      try {
        const res = await api.get<MySurveyResponse>('/mypage/survey')
        if (!mounted) return

        const data = res.data
        methods.reset({
          major: data.major ?? '',
          bootcampCompleted: !!data.bootcampCompleted,
          hasGovCard: !!data.hasGovCard,
          affordableAmount: data.affordableAmount ?? 0,
        })
      } catch {
        // API 오류 시 기본값 사용
      } finally {
        if (mounted) setIsLoading(false)
      }
    }

    load()

    return () => {
      mounted = false
    }
  }, [methods])

  const onSubmit = async (values: SurveyFormValues) => {
    setIsPending(true)
    try {
      await upsertSurvey.mutateAsync(values)
      // notify other parts of the app that survey is saved
      try {
        window.dispatchEvent(new Event('survey:saved'))
      } catch (error) {
        console.error(error)
      }
      toast.success('설문조사가 저장되었습니다.')
      router.back()
    } catch (error) {
      console.error('설문조사 저장 중 오류가 발생했습니다:', error)
      // API 에러 toast는 axios 인터셉터에서 처리
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
              <label htmlFor="major" className="mb-1 block text-sm font-medium text-foreground">
                전공<span className="text-red-500">*</span>
              </label>
              <input id="major" type="text" {...register('major')} className={INPUT_CLASS} />
              {errors.major && <p className="mt-1 text-xs text-red-600">{errors.major.message}</p>}
            </div>

            <div>
              <label htmlFor="affordableAmount" className="mb-1 block text-sm font-medium text-foreground">
                가능 금액(원)<span className="text-red-500">*</span>
              </label>
              <input
                id="affordableAmount"
                type="number"
                inputMode="numeric"
                {...register('affordableAmount', { valueAsNumber: true })}
                className={INPUT_CLASS}
              />
              {errors.affordableAmount && (
                <p className="mt-1 text-xs text-red-600">{errors.affordableAmount.message as string}</p>
              )}
            </div>

            <div className="flex items-center gap-3">
              <input
                id="bootcampCompleted"
                type="checkbox"
                {...register('bootcampCompleted')}
                className="h-4 w-4 rounded border-border"
              />
              <label htmlFor="bootcampCompleted" className="text-sm font-medium text-foreground">
                부트캠프 수료
              </label>
            </div>

            <div className="flex items-center gap-3">
              <input
                id="hasGovCard"
                type="checkbox"
                {...register('hasGovCard')}
                className="h-4 w-4 rounded border-border"
              />
              <label htmlFor="hasGovCard" className="text-sm font-medium text-foreground">
                국민내일배움카드 보유
              </label>
            </div>
          </FieldGroup>

          <div className="pt-2">
            <Button
              type="submit"
              disabled={!isValid || isPending || upsertSurvey.isPending || isLoading}
              className="h-11 w-full"
            >
              {isLoading ? '불러오는 중...' : isPending || upsertSurvey.isPending ? '저장 중...' : '저장'}
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
      <div className="rounded-2xl border border-border bg-card shadow-sm">
        <div className="flex items-center justify-between border-b border-border px-8 py-6">
          <h2 className="text-xl font-semibold text-foreground">설문조사</h2>
          <button
            type="button"
            onClick={() => router.back()}
            className="inline-flex h-10 w-10 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
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
