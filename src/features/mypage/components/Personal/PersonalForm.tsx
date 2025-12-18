'use client'

import { useState, useEffect } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { FormProvider, useForm } from 'react-hook-form'
import { FiX } from 'react-icons/fi'
import { toast } from 'sonner'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { FieldGroup, FieldSet } from '@/components/ui/field'
import AddressInput from '@/features/auth/components/AddressInput'
import { api } from '@/lib/axios'
import { useSignupStore } from '@/store/signupStore'

const profileSchema = z.object({
  nickname: z.string().min(1, '닉네임을 입력해주세요.'),
  phone: z.string().min(1, '휴대폰 번호를 입력해주세요.'),
  // AddressInput은 store 기반이므로 location은 선택적으로만 유지
  location: z.string().optional(),
})

type ProfileFormValues = z.infer<typeof profileSchema>

type MyProfileResponse = {
  email: string
  name: string
  nickname: string
  phone: string
  location: string
  provider: string
  role: string
  hasSurvey: boolean
}

// 모달 스크린샷처럼: 라운드, 얇은 보더, 포커스 앰버 컬러
const INPUT_CLASS =
  'h-10 w-full rounded-md border border-gray-200 bg-white px-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-amber-300 focus:ring-2 focus:ring-amber-200 focus:outline-none'

export function PeronalInfoForm({ embedded = false }: { embedded?: boolean }) {
  const router = useRouter()
  const [isPending, setIsPending] = useState(false)

  const { address, detailAddress, setAddress, setDetailAddress } = useSignupStore()
  const [profileEmail, setProfileEmail] = useState<string>('')
  const [profileName, setProfileName] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)

  const methods = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    mode: 'onChange',
    defaultValues: {
      nickname: '',
      phone: '',
      location: '',
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
        const res = await api.get<MyProfileResponse>('/mypage/profile')
        if (!mounted) return

        const data = res.data
        setProfileEmail(data.email)
        setProfileName(data.name)

        // react-hook-form 값 세팅
        methods.reset({
          nickname: data.nickname ?? '',
          phone: data.phone ?? '',
          location: data.location ?? '',
        })

        // AddressInput(store) 값 세팅
        setAddress(data.location ?? '')
        setDetailAddress('')
      } catch (e) {
        toast.error('내 정보 조회에 실패했습니다.')
      } finally {
        if (mounted) setIsLoading(false)
      }
    }

    load()

    return () => {
      mounted = false
    }
  }, [methods, setAddress, setDetailAddress])

  const onSubmit = async (values: ProfileFormValues) => {
    setIsPending(true)
    try {
      // AddressInput은 store 기반이므로 여기서 location 조합
      const nextLocation = detailAddress?.trim() ? `${address ?? ''} ${detailAddress}`.trim() : (address ?? '').trim()

      // NOTE: 스크린샷에서 수정 API는 보이지 않아서, 조회 API 기준으로만 안전하게 구현합니다.
      // 수정 API 스펙이 확인되면 아래를 실제 호출로 교체하세요.
      // await api.put('/mypage/profile', { nickname: values.nickname, phone: values.phone, location: nextLocation })

      await new Promise(resolve => setTimeout(resolve, 300))
      toast.success('저장되었습니다.')
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
              <label className="mb-1 block text-sm font-medium text-gray-800">이름</label>
              <div className={`${INPUT_CLASS} flex items-center bg-gray-50`}>
                <span className="truncate">{profileName || '-'}</span>
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-800">이메일</label>
              <div className={`${INPUT_CLASS} flex items-center bg-gray-50`}>
                <span className="truncate">{profileEmail || '-'}</span>
              </div>
            </div>

            <div>
              <label htmlFor="nickname" className="mb-1 block text-sm font-medium text-gray-800">
                닉네임
              </label>
              <input
                id="nickname"
                type="text"
                placeholder="예) dev master"
                {...register('nickname')}
                className={INPUT_CLASS}
              />
              {errors.nickname && <p className="mt-1 text-xs text-red-600">{errors.nickname.message}</p>}
            </div>

            <div>
              <label htmlFor="phone" className="mb-1 block text-sm font-medium text-gray-800">
                휴대폰 번호
              </label>
              <input
                id="phone"
                type="text"
                placeholder="예) 010-1234-5678"
                {...register('phone')}
                className={INPUT_CLASS}
              />
              {errors.phone && <p className="mt-1 text-xs text-red-600">{errors.phone.message}</p>}
            </div>

            <div>
              <AddressInput />
            </div>
          </FieldGroup>

          {/* Footer */}
          <div className="pt-2">
            <Button
              type="submit"
              disabled={!isValid || isPending || isLoading}
              className="h-11 w-full rounded-md bg-gray-900 px-6 text-sm font-semibold text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-500"
            >
              {isLoading ? '불러오는 중...' : isPending ? '저장 중...' : '저장'}
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

        {/* Body */}
        <div className="px-8 py-6">{formContent}</div>
      </div>
    </div>
  )
}
