'use client'

import { useEffect, useState } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useRouter, useSearchParams } from 'next/navigation'
import { FormProvider, useForm } from 'react-hook-form'
import { FiX } from 'react-icons/fi'
import { toast } from 'sonner'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { FieldGroup, FieldSet } from '@/components/ui/field'
import { api } from '@/lib/axios'

const reviewItemSchema = z.object({
  category: z.string().min(1, '카테고리를 선택해주세요.'),
  score: z
    .union([z.number(), z.string()])
    .transform(v => (typeof v === 'string' ? Number(v) : v))
    .refine(v => Number.isFinite(v) && v >= 0 && v <= 5, '점수는 0에서 5 사이여야 합니다.'),
  comment: z.string().min(1, '후기를 입력해주세요.'),
})
const reviewSchema = z.object({
  items: z.array(reviewItemSchema).min(1, '최소 1개 항목이 필요합니다.'),
})
type ReviewFormValues = z.infer<typeof reviewSchema>

type ReviewItem = {
  category: string
  score: number
  comment: string
}

type ReviewResponse = {
  reviewId?: number
  items?: ReviewItem[]
}

const INPUT_CLASS =
  'h-10 w-full rounded-md border border-gray-200 bg-white px-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-amber-300 focus:ring-2 focus:ring-amber-200 focus:outline-none'

const TEXTAREA_CLASS =
  'w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-amber-300 focus:ring-2 focus:ring-amber-200 focus:outline-none'

export function ReviewForm({ embedded = false, reviewId }: { embedded?: boolean; reviewId?: number }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const resolvedReviewId = reviewId ?? Number(searchParams.get('reviewId') ?? 0)

  const [isPending, setIsPending] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const methods = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
    mode: 'onChange',
    defaultValues: {
      items: [{ category: 'TEACHER', score: 0, comment: '' }],
    },
  })

  const updateReview = useMutation({
    mutationFn: async (payload: ReviewItem[]) => {
      await api.put(`/reviews/${resolvedReviewId}`, payload)
    },
  })

  const {
    handleSubmit,
    formState: { isValid, errors },
    register,
    watch,
    setValue,
  } = methods

  useEffect(() => {
    let mounted = true

    const load = async () => {
      if (!resolvedReviewId) {
        setIsLoading(false)
        return
      }
      setIsLoading(true)
      try {
        const res = await api.get<ReviewResponse | ReviewItem[]>(`/reviews/${resolvedReviewId}`)
        if (!mounted) return

        const data = res.data
        let normalizedItems: ReviewItem[] = []
        if (Array.isArray(data)) {
          normalizedItems = data
        } else {
          normalizedItems = data.items ?? []
        }

        methods.reset({
          items: normalizedItems.length > 0 ? normalizedItems : [{ category: 'TEACHER', score: 0, comment: '' }],
        })
      } catch (e: any) {
      } finally {
        if (mounted) setIsLoading(false)
      }
    }

    load()

    return () => {
      mounted = false
    }
  }, [methods, resolvedReviewId])

  const onSubmit = async (values: ReviewFormValues) => {
    setIsPending(true)
    try {
      await updateReview.mutateAsync(values.items)
      toast.success('후기가 저장되었습니다.')
      router.back()
    } catch (error) {
      console.error('후기 저장 중 오류가 발생했습니다:', error)
      toast.error('후기 저장 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.')
    } finally {
      setIsPending(false)
    }
  }

  const items = watch('items')

  const formContent = (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <FieldSet>
          <FieldGroup className="space-y-6">
            {items.map((_, index) => (
              <div key={index} className="space-y-2 border-b border-gray-200 pb-6 last:border-none last:pb-0">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-semibold text-gray-900">항목 {index + 1}</label>
                  {items.length > 1 && (
                    <button
                      type="button"
                      onClick={() =>
                        setValue(
                          'items',
                          items.filter((_, i) => i !== index),
                          { shouldValidate: true, shouldDirty: true },
                        )
                      }
                      className="text-xs font-medium text-red-600 hover:underline"
                    >
                      삭제
                    </button>
                  )}
                </div>

                <div>
                  <label htmlFor={`items.${index}.category`} className="mb-1 block text-sm font-medium text-gray-800">
                    카테고리<span className="text-red-500">*</span>
                  </label>
                  <select
                    id={`items.${index}.category`}
                    {...register(`items.${index}.category` as const)}
                    className={INPUT_CLASS}
                  >
                    <option value="TEACHER">TEACHER</option>
                    <option value="CURRICULUM">CURRICULUM</option>
                    <option value="FACILITY">FACILITY</option>
                    <option value="ETC">ETC</option>
                  </select>
                  {errors.items?.[index]?.category && (
                    <p className="mt-1 text-xs text-red-600">{errors.items[index]?.category?.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor={`items.${index}.score`} className="mb-1 block text-sm font-medium text-gray-800">
                    점수 (0~5)<span className="text-red-500">*</span>
                  </label>
                  <input
                    id={`items.${index}.score`}
                    type="number"
                    step="0.5"
                    min={0}
                    max={5}
                    inputMode="decimal"
                    {...register(`items.${index}.score` as const, { valueAsNumber: true })}
                    className={INPUT_CLASS}
                  />
                  {errors.items?.[index]?.score && (
                    <p className="mt-1 text-xs text-red-600">{errors.items[index]?.score?.message as string}</p>
                  )}
                </div>

                <div>
                  <label htmlFor={`items.${index}.comment`} className="mb-1 block text-sm font-medium text-gray-800">
                    후기<span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id={`items.${index}.comment`}
                    rows={3}
                    {...register(`items.${index}.comment` as const)}
                    className={TEXTAREA_CLASS}
                  />
                  {errors.items?.[index]?.comment && (
                    <p className="mt-1 text-xs text-red-600">{errors.items[index]?.comment?.message}</p>
                  )}
                </div>
              </div>
            ))}

            <div>
              <button
                type="button"
                onClick={() =>
                  setValue('items', [...items, { category: 'TEACHER', score: 0, comment: '' }], {
                    shouldValidate: true,
                    shouldDirty: true,
                  })
                }
                className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:ring-2 focus:ring-amber-300 focus:ring-offset-1 focus:outline-none"
              >
                항목 추가
              </button>
            </div>
          </FieldGroup>

          <div className="pt-2">
            <Button
              type="submit"
              disabled={!isValid || isPending || updateReview.isPending || isLoading}
              className="h-11 w-full rounded-md bg-gray-900 px-6 text-sm font-semibold text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-500"
            >
              {isLoading ? '불러오는 중...' : isPending || updateReview.isPending ? '저장 중...' : '저장'}
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
          <h2 className="text-xl font-semibold text-gray-900">설문조사</h2>
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
