'use client'

import { useState, useEffect } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { FormProvider, useForm } from 'react-hook-form'
import { FiX } from 'react-icons/fi'
import { toast } from 'sonner'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { FieldGroup, FieldSet } from '@/components/ui/field'
import AddressInput from '@/features/auth/components/address-input'
import { PROFILE_QUERY_KEY } from '@/features/mypage/components/profile-card'
import { api } from '@/lib/axios'
import { useAuthStore } from '@/store/auth-store'
import { useSignupStore } from '@/store/signup-store'

const profileSchema = z.object({
  nickname: z.string().min(1, '닉네임을 입력해주세요.').max(12, '닉네임은 12자 이내로 입력해주세요.'),
  phone: z
    .string()
    .min(1, '휴대폰 번호를 입력해주세요.')
    .regex(/^[0-9]+$/, '휴대폰 번호는 숫자만 입력해주세요. (하이픈 제외)')
    .min(10, '휴대폰 번호는 10자리 이상이어야 합니다.')
    .max(11, '휴대폰 번호는 11자리 이하여야 합니다.'),
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
  'h-10 sm:h-11 w-full rounded-md border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-ring/50 focus:outline-none'

// AddressInput(daum.Postcode)이 동작하려면 postcode 스크립트가 필요합니다.
const DAUM_POSTCODE_SCRIPT_ID = 'daum-postcode-script'

const loadDaumPostcodeScript = () => {
  if (typeof window === 'undefined') return

  const w = window as unknown as { daum?: { Postcode?: unknown } }
  // 이미 로드되어 있으면 종료
  if (w.daum?.Postcode) return

  // 이미 스크립트 태그가 있으면 로드만 기다림
  if (document.getElementById(DAUM_POSTCODE_SCRIPT_ID)) return

  const script = document.createElement('script')
  script.id = DAUM_POSTCODE_SCRIPT_ID
  script.src = '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js'
  script.async = true
  document.body.appendChild(script)
}

export function PersonalInfoForm({ embedded = false, onSuccess }: { embedded?: boolean; onSuccess?: () => void }) {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [isPending, setIsPending] = useState(false)
  const [isCheckingNickname, setIsCheckingNickname] = useState(false)
  const [addressError, setAddressError] = useState<string>('')

  const { setAddress, address } = useSignupStore()
  const { setNickname } = useAuthStore()
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
    formState: { errors },
    register,
  } = methods

  const onCheckNickname = async () => {
    try {
      const nickname = (methods.getValues('nickname') || '').trim()
      if (!nickname) {
        toast.error('닉네임을 입력해주세요.')
        return
      }
      setIsCheckingNickname(true)
      const res = await api.get('/members/nickname/check', { params: { nickname } })
      const data = res?.data as unknown as { available?: boolean; exists?: boolean }
      const available =
        typeof data?.available === 'boolean' ? data.available : typeof data?.exists === 'boolean' ? !data.exists : true // 명확한 필드가 없으면 200 응답 기준으로 사용 가능 처리

      if (available) {
        toast.success('사용 가능한 닉네임입니다.')
      } else {
        toast.error('이미 사용 중인 닉네임입니다.')
      }
    } catch {
      toast.error('닉네임 확인에 실패했습니다.')
    } finally {
      setIsCheckingNickname(false)
    }
  }

  useEffect(() => {
    let mounted = true

    const load = async () => {
      loadDaumPostcodeScript()
      setIsLoading(true)
      try {
        const res = await api.get<MyProfileResponse>('/mypage/profile')
        if (!mounted) return

        const data = res.data
        setProfileEmail(data.email)
        setProfileName(data.name)

        // react-hook-form 값 세팅 (휴대폰 번호는 하이픈 제거)
        methods.reset({
          nickname: data.nickname ?? '',
          phone: (data.phone ?? '').replace(/-/g, ''),
          location: '',
        })

        // 주소는 백엔드 값으로 초기 세팅
        const loc = (data.location ?? '').trim()
        setAddress(loc)
      } catch {
        toast.error('내 정보 조회에 실패했습니다.')
      } finally {
        if (mounted) setIsLoading(false)
      }
    }

    load()

    return () => {
      mounted = false
    }
  }, [methods, setAddress])

  // 주소 입력 시 에러 초기화
  useEffect(() => {
    if (address && addressError) {
      setAddressError('')
    }
  }, [address, addressError])

  const handleSave = async () => {
    // react-hook-form 검증
    const isValid = await methods.trigger()
    if (!isValid) {
      const firstError = Object.values(methods.formState.errors)[0]
      if (firstError?.message) {
        toast.error(firstError.message as string)
      }
      return
    }

    // 주소 검증
    const location = (address ?? '').trim()
    if (!location) {
      setAddressError('주소를 입력해주세요.')
      toast.error('주소를 입력해주세요.')
      return
    }
    setAddressError('')

    const values = methods.getValues()
    setIsPending(true)
    try {
      await api.patch('/mypage/profile', {
        nickname: values.nickname,
        phone: values.phone,
        location,
      })
      setNickname(values.nickname)
      toast.success('저장되었습니다.')
      if (onSuccess) {
        // 모달(intercept route) 닫기: router.back() 이후 어떤 상태 업데이트도
        // 동기적으로 실행하면 Next.js 네비게이션 트랜지션을 방해하므로,
        // onSuccess() 호출 후 모든 후속 작업을 비동기로 지연시킨다.
        onSuccess()
        setTimeout(() => {
          setIsPending(false)
          queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEY })
        }, 100)
        return
      }
      queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEY })
      router.back()
    } catch {
      toast.error('저장에 실패했습니다.')
      setIsPending(false)
    }
  }

  const formContent = (
    <FormProvider {...methods}>
      <form onSubmit={e => e.preventDefault()} className="space-y-6">
        <FieldSet>
          <FieldGroup className="grid grid-cols-1 gap-6">
            <div>
              <label className="text-foreground mb-1 block text-sm font-medium">이름</label>
              <div className={`${INPUT_CLASS} bg-muted flex items-center`}>
                <span className="truncate">{profileName || '-'}</span>
              </div>
            </div>

            <div>
              <label className="text-foreground mb-1 block text-sm font-medium">이메일</label>
              <div className={`${INPUT_CLASS} bg-muted flex items-center`}>
                <span className="truncate">{profileEmail || '-'}</span>
              </div>
            </div>

            <div>
              <label htmlFor="nickname" className="text-foreground mb-1 block text-sm font-medium">
                닉네임 <span className="text-destructive">*</span>
              </label>
              <div className="flex items-center gap-2">
                <input
                  id="nickname"
                  type="text"
                  placeholder="예) dev master"
                  maxLength={12}
                  {...register('nickname')}
                  className={INPUT_CLASS}
                />
                <button
                  type="button"
                  onClick={onCheckNickname}
                  disabled={isCheckingNickname || isLoading}
                  className="bg-foreground text-background hover:bg-foreground/90 disabled:bg-muted disabled:text-muted-foreground h-10 shrink-0 rounded-md px-4 text-sm font-semibold disabled:cursor-not-allowed"
                >
                  {isCheckingNickname ? '확인 중...' : '중복확인'}
                </button>
              </div>
              {errors.nickname && <p className="text-destructive mt-1 text-xs">{errors.nickname.message}</p>}
            </div>

            <div>
              <label htmlFor="phone" className="text-foreground mb-1 block text-sm font-medium">
                휴대폰 번호 <span className="text-destructive">*</span>
              </label>
              <input
                id="phone"
                type="text"
                placeholder="예) 01012345678"
                maxLength={11}
                {...register('phone')}
                className={INPUT_CLASS}
              />
              {errors.phone && <p className="text-destructive mt-1 text-xs">{errors.phone.message}</p>}
            </div>

            <AddressInput variant="light" required error={addressError} />
          </FieldGroup>

          {/* Footer */}
          <div className="pt-2">
            <Button
              type="button"
              onClick={handleSave}
              disabled={isPending || isLoading}
              className="bg-foreground text-background hover:bg-foreground/90 disabled:bg-muted disabled:text-muted-foreground h-11 w-full rounded-md px-6 text-sm font-semibold disabled:cursor-not-allowed"
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
    <div className="mx-auto w-full max-w-2xl">
      <div className="bg-card border-border rounded-2xl border shadow-sm">
        {/* Header */}
        <div className="border-border flex items-center justify-between border-b px-4 py-4 sm:px-8 sm:py-6">
          <h2 className="text-foreground text-xl font-semibold">개인 정보 수정</h2>

          <button
            type="button"
            onClick={() => router.back()}
            className="text-muted-foreground hover:bg-muted hover:text-foreground inline-flex h-10 w-10 items-center justify-center rounded-md"
            aria-label="닫기"
          >
            <FiX className="h-5 w-5" aria-hidden />
          </button>
        </div>

        {/* Body */}
        <div className="px-4 py-4 md:px-8 md:py-6">{formContent}</div>
      </div>
    </div>
  )
}
