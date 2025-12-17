'use client'

import { useState } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { FormProvider, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { FieldGroup, FieldSet } from '@/components/ui/field'

const orgInfoSchema = z.object({
  organizationName: z.string().min(1, '기관명을 입력해주세요.'),
  businessRegistrationNumber: z.string().min(1, '사업자등록번호를 입력해주세요.'),
  ceoName: z.string().min(1, '대표자명을 입력해주세요.'),
  contactEmail: z.string().min(1, '이메일을 입력해주세요.').email('이메일 형식이 올바르지 않습니다.'),
  contactPhone: z.string().min(1, '연락처를 입력해주세요.'),
  address: z.string().optional(),
})
type OrgInfoFormValues = z.infer<typeof orgInfoSchema>

export function SurveyForm() {
  const router = useRouter()
  const [isPending, setIsPending] = useState(false)

  const methods = useForm<OrgInfoFormValues>({
    resolver: zodResolver(orgInfoSchema),
    mode: 'onChange',
    defaultValues: {
      organizationName: '',
      businessRegistrationNumber: '',
      ceoName: '',
      contactEmail: '',
      contactPhone: '',
      address: '',
    },
  })

  const {
    handleSubmit,
    formState: { isValid, errors },
    register,
  } = methods

  const onSubmit = async (values: OrgInfoFormValues) => {
    setIsPending(true)
    try {
      // For now, just simulate a save with a delay
      await new Promise(resolve => setTimeout(resolve, 500))
      toast.success('기업 정보가 저장되었습니다.')
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
              <label htmlFor="organizationName" className="mb-1 block font-medium">
                이름<span className="text-red-500">*</span>
              </label>
              <input
                id="organizationName"
                type="text"
                {...register('organizationName')}
                className="w-full rounded border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              {errors.organizationName && (
                <p className="mt-1 text-sm text-red-600">{errors.organizationName.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="contactEmail" className="mb-1 block font-medium">
                담당자 이메일<span className="text-red-500">*</span>
              </label>
              <input
                id="contactEmail"
                type="email"
                {...register('contactEmail')}
                className="w-full rounded border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              {errors.contactEmail && <p className="mt-1 text-sm text-red-600">{errors.contactEmail.message}</p>}
            </div>

            <div>
              <label htmlFor="contactPhone" className="mb-1 block font-medium">
                연락처<span className="text-red-500">*</span>
              </label>
              <input
                id="contactPhone"
                type="text"
                {...register('contactPhone')}
                className="w-full rounded border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              {errors.contactPhone && <p className="mt-1 text-sm text-red-600">{errors.contactPhone.message}</p>}
            </div>

            <div className="md:col-span-2">
              <label htmlFor="address" className="mb-1 block font-medium">
                주소
              </label>
              <input
                id="address"
                type="text"
                {...register('address')}
                className="w-full rounded border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>}
            </div>
          </FieldGroup>

          <div className="flex gap-2 pt-4">
            <Button type="submit" disabled={!isValid || isPending}>
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
