'use client'

import { useEffect, useState } from 'react'

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

/**
 * ✅ Swagger: GET /api/v1/mypage/organization (기관 정보 조회)
 * - axios baseURL이 /api/v1 이면 프론트에서는 `/mypage/organization` 으로 호출
 */
type MyOrganizationResponse = {
  organizationId: number
  organizationName: string
  description: string
  representativeName: string
  phone: string
  location: string
  approvalStatus: 'PENDING' | 'APPROVED' | 'REJECTED' | string
  certificateUrl: string
  govAuth: string
  facilityImageUrl1: string
  facilityImageUrl2: string
  facilityImageUrl3: string
  facilityImageUrl4: string
  logoUrl: string
  homepage: string
}

/**
 * ✅ 수정 가능 필드만 form에 포함
 * - 수정 불가(기관ID, 승인상태)는 input이 아니라 텍스트 박스로 표시
 * - AddressInput은 store 기반이라 location은 optional 로만 유지
 */
const orgInfoSchema = z.object({
  organizationName: z.string().min(1, '기관명을 입력해주세요.'),
  representativeName: z.string().min(1, '대표자명을 입력해주세요.'),
  phone: z.string().min(1, '연락처를 입력해주세요.'),
  description: z.string().optional(),
  homepage: z.string().optional(),
  logoUrl: z.string().optional(),
  certificateUrl: z.string().optional(),
  govAuth: z.string().optional(),
  facilityImageUrl1: z.string().optional(),
  facilityImageUrl2: z.string().optional(),
  facilityImageUrl3: z.string().optional(),
  facilityImageUrl4: z.string().optional(),
  location: z.string().optional(),
})

type OrgInfoFormValues = z.infer<typeof orgInfoSchema>

// ✅ PersonalForm과 동일한 인풋 톤
const INPUT_CLASS =
  'h-10 w-full rounded-md border border-gray-200 bg-white px-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-amber-300 focus:ring-2 focus:ring-amber-200 focus:outline-none'

const TEXTAREA_CLASS =
  'w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-amber-300 focus:ring-2 focus:ring-amber-200 focus:outline-none'

// ✅ AddressInput(daum.Postcode)이 동작하려면 postcode 스크립트가 필요합니다.
const DAUM_POSTCODE_SCRIPT_ID = 'daum-postcode-script'

const loadDaumPostcodeScript = () => {
  if (typeof window === 'undefined') return

  const w = window as any
  // 이미 로드되어 있으면 종료
  if (w.daum?.Postcode) return

  // 이미 스크립트 태그가 있으면 종료
  if (document.getElementById(DAUM_POSTCODE_SCRIPT_ID)) return

  const script = document.createElement('script')
  script.id = DAUM_POSTCODE_SCRIPT_ID
  script.src = '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js'
  script.async = true
  document.body.appendChild(script)
}

export function OrgInfoForm({ embedded = false }: { embedded?: boolean }) {
  const router = useRouter()

  const [isPending, setIsPending] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // ✅ 수정 불가 정보는 텍스트로 노출
  const [organizationId, setOrganizationId] = useState<number | null>(null)
  const [approvalStatus, setApprovalStatus] = useState<string>('')

  // ✅ AddressInput(store)
  const { address, detailAddress, setAddress, setDetailAddress } = useSignupStore()

  const methods = useForm<OrgInfoFormValues>({
    resolver: zodResolver(orgInfoSchema),
    mode: 'onChange',
    defaultValues: {
      organizationName: '',
      representativeName: '',
      phone: '',
      description: '',
      homepage: '',
      logoUrl: '',
      certificateUrl: '',
      govAuth: '',
      facilityImageUrl1: '',
      facilityImageUrl2: '',
      facilityImageUrl3: '',
      facilityImageUrl4: '',
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
      // ✅ AddressInput 검색 버튼 동작을 위해 스크립트 로드
      loadDaumPostcodeScript()

      setIsLoading(true)
      try {
        const res = await api.get<MyOrganizationResponse>('/mypage/organization')
        if (!mounted) return

        const data = res.data

        setOrganizationId(data.organizationId ?? null)
        setApprovalStatus(data.approvalStatus ?? '')

        methods.reset({
          organizationName: data.organizationName ?? '',
          representativeName: data.representativeName ?? '',
          phone: data.phone ?? '',
          description: data.description ?? '',
          homepage: data.homepage ?? '',
          logoUrl: data.logoUrl ?? '',
          certificateUrl: data.certificateUrl ?? '',
          govAuth: data.govAuth ?? '',
          facilityImageUrl1: data.facilityImageUrl1 ?? '',
          facilityImageUrl2: data.facilityImageUrl2 ?? '',
          facilityImageUrl3: data.facilityImageUrl3 ?? '',
          facilityImageUrl4: data.facilityImageUrl4 ?? '',
          location: data.location ?? '',
        })

        // AddressInput(store) 값 세팅
        setAddress(data.location ?? '')
        setDetailAddress('')
      } catch (e) {
        toast.error('기관 정보 조회에 실패했습니다.')
      } finally {
        if (mounted) setIsLoading(false)
      }
    }

    load()

    return () => {
      mounted = false
    }
  }, [methods, setAddress, setDetailAddress])

  const onSubmit = async (values: OrgInfoFormValues) => {
    setIsPending(true)
    try {
      // AddressInput은 store 기반이므로 여기서 location 조합
      const nextLocation = detailAddress?.trim() ? `${address ?? ''} ${detailAddress}`.trim() : (address ?? '').trim()

      // NOTE: 현재 제공된 Swagger 이미지에는 수정(POST/PUT) 스펙이 없어서 임의로 호출하지 않습니다.
      // 수정 API 스펙이 확정되면 아래를 실제 호출로 교체하세요.
      // await api.put('/mypage/organization', {
      //   ...values,
      //   location: nextLocation,
      // })

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
            {/* 수정 불가: 기관 ID */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-800">기관 ID</label>
              <div className={`${INPUT_CLASS} flex items-center bg-gray-50`}>
                <span className="truncate">{organizationId ?? '-'}</span>
              </div>
            </div>

            {/* 수정 불가: 승인 상태 */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-800">승인 상태</label>
              <div className={`${INPUT_CLASS} flex items-center bg-gray-50`}>
                <span className="truncate">{approvalStatus || '-'}</span>
              </div>
            </div>

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

            <div>
              <label htmlFor="representativeName" className="mb-1 block text-sm font-medium text-gray-800">
                대표자명
              </label>
              <input
                id="representativeName"
                type="text"
                placeholder="예) 홍길동"
                {...register('representativeName')}
                className={INPUT_CLASS}
              />
              {errors.representativeName && (
                <p className="mt-1 text-xs text-red-600">{errors.representativeName.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="phone" className="mb-1 block text-sm font-medium text-gray-800">
                연락처
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
              <label htmlFor="description" className="mb-1 block text-sm font-medium text-gray-800">
                기관 소개
              </label>
              <textarea
                id="description"
                rows={4}
                placeholder="기관 소개를 입력해주세요."
                {...register('description')}
                className={TEXTAREA_CLASS}
              />
            </div>

            {/* 주소(검색 버튼 포함) */}
            <div>
              <AddressInput />
            </div>

            <div>
              <label htmlFor="homepage" className="mb-1 block text-sm font-medium text-gray-800">
                홈페이지
              </label>
              <input
                id="homepage"
                type="text"
                placeholder="예) https://example.com"
                {...register('homepage')}
                className={INPUT_CLASS}
              />
            </div>

            {/* 첨부/링크 */}
            <div className="pt-2">
              <p className="mb-3 text-sm font-semibold text-gray-900">첨부/링크</p>

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label htmlFor="logoUrl" className="mb-1 block text-sm font-medium text-gray-800">
                    logoUrl
                  </label>
                  <input
                    id="logoUrl"
                    type="text"
                    placeholder="예) https://..."
                    {...register('logoUrl')}
                    className={INPUT_CLASS}
                  />
                </div>

                <div>
                  <label htmlFor="certificateUrl" className="mb-1 block text-sm font-medium text-gray-800">
                    certificateUrl
                  </label>
                  <input
                    id="certificateUrl"
                    type="text"
                    placeholder="예) https://..."
                    {...register('certificateUrl')}
                    className={INPUT_CLASS}
                  />
                </div>

                <div>
                  <label htmlFor="govAuth" className="mb-1 block text-sm font-medium text-gray-800">
                    govAuth
                  </label>
                  <input
                    id="govAuth"
                    type="text"
                    placeholder="예) 인증코드/값"
                    {...register('govAuth')}
                    className={INPUT_CLASS}
                  />
                </div>

                <div>
                  <label htmlFor="facilityImageUrl1" className="mb-1 block text-sm font-medium text-gray-800">
                    facilityImageUrl1
                  </label>
                  <input
                    id="facilityImageUrl1"
                    type="text"
                    placeholder="예) https://..."
                    {...register('facilityImageUrl1')}
                    className={INPUT_CLASS}
                  />
                </div>

                <div>
                  <label htmlFor="facilityImageUrl2" className="mb-1 block text-sm font-medium text-gray-800">
                    facilityImageUrl2
                  </label>
                  <input
                    id="facilityImageUrl2"
                    type="text"
                    placeholder="예) https://..."
                    {...register('facilityImageUrl2')}
                    className={INPUT_CLASS}
                  />
                </div>

                <div>
                  <label htmlFor="facilityImageUrl3" className="mb-1 block text-sm font-medium text-gray-800">
                    facilityImageUrl3
                  </label>
                  <input
                    id="facilityImageUrl3"
                    type="text"
                    placeholder="예) https://..."
                    {...register('facilityImageUrl3')}
                    className={INPUT_CLASS}
                  />
                </div>

                <div>
                  <label htmlFor="facilityImageUrl4" className="mb-1 block text-sm font-medium text-gray-800">
                    facilityImageUrl4
                  </label>
                  <input
                    id="facilityImageUrl4"
                    type="text"
                    placeholder="예) https://..."
                    {...register('facilityImageUrl4')}
                    className={INPUT_CLASS}
                  />
                </div>
              </div>
            </div>
          </FieldGroup>

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

  // ✅ 모달(DialogContent) 안에 들어갈 때: 카드/헤더를 한 번만 보이게
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
          <h2 className="text-xl font-semibold text-gray-900">기관 정보 수정</h2>

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
