'use client'

import { useState } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { FormProvider, useForm } from 'react-hook-form'
import { FiX } from 'react-icons/fi'
import { toast } from 'sonner'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { FieldGroup, FieldSet } from '@/components/ui/field'
import AddressInput from '@/features/auth/components/AddressInput'

const orgInfoSchema = z.object({
  organizationName: z.string().min(1, '기관명을 입력해주세요.'),
  businessRegistrationNumber: z.string().min(1, '사업자등록번호를 입력해주세요.'),
  ceoName: z.string().min(1, '대표자명을 입력해주세요.'),
  contactEmail: z.string().min(1, '이메일을 입력해주세요.').email('이메일 형식이 올바르지 않습니다.'),
  contactPhone: z.string().min(1, '연락처를 입력해주세요.'),
  address: z.string().optional(),
})

type OrgInfoFormValues = z.infer<typeof orgInfoSchema>

// 모달 스크린샷처럼: 라운드, 얇은 보더, 포커스 앰버 컬러
const INPUT_CLASS =
  'h-10 w-full rounded-md border border-gray-200 bg-white px-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-amber-300 focus:ring-2 focus:ring-amber-200 focus:outline-none'

export function PeronalInfoForm({ embedded = false }: { embedded?: boolean }) {
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

  const onSubmit = async (_values: OrgInfoFormValues) => {
    setIsPending(true)
    try {
      // TODO: 실제 API 연결 전 임시 처리
      await new Promise(resolve => setTimeout(resolve, 500))
      toast.success('기업 정보가 저장되었습니다.')
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
            {/* 기관명 */}
            <div>
              <label htmlFor="organizationName" className="mb-1 block text-sm font-medium text-gray-800">
                기관명
              </label>
              <input
                id="organizationName"
                type="text"
                placeholder="예) (주)캠퍼스랩"
                {...register('organizationName')}
                className={INPUT_CLASS}
              />
              {errors.organizationName && (
                <p className="mt-1 text-xs text-red-600">{errors.organizationName.message}</p>
              )}
            </div>

            {/* 사업자등록번호 */}
            <div>
              <label htmlFor="businessRegistrationNumber" className="mb-1 block text-sm font-medium text-gray-800">
                사업자등록번호
              </label>
              <input
                id="businessRegistrationNumber"
                type="text"
                placeholder="예) 123-45-67890"
                {...register('businessRegistrationNumber')}
                className={INPUT_CLASS}
              />
              {errors.businessRegistrationNumber && (
                <p className="mt-1 text-xs text-red-600">{errors.businessRegistrationNumber.message}</p>
              )}
            </div>

            {/* 대표자명 */}
            <div>
              <label htmlFor="ceoName" className="mb-1 block text-sm font-medium text-gray-800">
                대표자명
              </label>
              <input
                id="ceoName"
                type="text"
                placeholder="예) 홍길동"
                {...register('ceoName')}
                className={INPUT_CLASS}
              />
              {errors.ceoName && <p className="mt-1 text-xs text-red-600">{errors.ceoName.message}</p>}
            </div>

            {/* 담당자 이메일 */}
            <div>
              <label htmlFor="contactEmail" className="mb-1 block text-sm font-medium text-gray-800">
                담당자 이메일
              </label>
              <input
                id="contactEmail"
                type="email"
                placeholder="예) contact@example.com"
                {...register('contactEmail')}
                className={INPUT_CLASS}
              />
              {errors.contactEmail && <p className="mt-1 text-xs text-red-600">{errors.contactEmail.message}</p>}
            </div>

            {/* 연락처 */}
            <div>
              <label htmlFor="contactPhone" className="mb-1 block text-sm font-medium text-gray-800">
                연락처
              </label>
              <input
                id="contactPhone"
                type="text"
                placeholder="예) 010-1234-5678"
                {...register('contactPhone')}
                className={INPUT_CLASS}
              />
              {errors.contactPhone && <p className="mt-1 text-xs text-red-600">{errors.contactPhone.message}</p>}
            </div>

            {/* 주소: AddressInput 사용 (파일 수정 금지) */}
            <div>
              <AddressInput />
              {errors.address && <p className="mt-1 text-xs text-red-600">{String(errors.address.message)}</p>}
            </div>
          </FieldGroup>

          {/* Footer */}
          <div className="pt-2">
            <Button
              type="submit"
              disabled={!isValid || isPending}
              className="h-11 w-full rounded-md bg-gray-900 px-6 text-sm font-semibold text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-500"
            >
              {isPending ? '저장 중...' : '저장'}
            </Button>
          </div>
        </FieldSet>
      </form>
    </FormProvider>
  )

  // 모달(DialogContent) 안에 들어갈 때: 내부 카드/헤더를 또 만들지 않도록
  if (embedded) {
    return (
      <div className="mx-auto w-full">
        <div className="px-0 pt-0 pb-0">{formContent}</div>
      </div>
    )
  }

  // 단독 페이지/컴포넌트로 렌더링될 때의 카드 UI
  return (
    <div className="mx-auto w-full">
      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-8 py-6">
          <h2 className="text-xl font-semibold text-gray-900">기업 정보 수정</h2>

          <button
            type="button"
            onClick={() => router.back()}
            className="inline-flex h-10 w-10 items-center justify-center rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-800"
            aria-label="닫기"
          >
            <FiX className="h-5 w-5" aria-hidden />
          </button>
        </div>

        {/* Body */}
        <div className="px-8 py-6">{formContent}</div>
      </div>
    </div>
  )
}
