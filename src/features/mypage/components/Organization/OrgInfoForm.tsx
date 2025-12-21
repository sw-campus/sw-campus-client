'use client'

import { useEffect, useState } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { Controller, FormProvider, useForm } from 'react-hook-form'
import { FiX } from 'react-icons/fi'
import { toast } from 'sonner'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { FieldGroup, FieldSet } from '@/components/ui/field'
import { ImageUploadInput } from '@/components/ui/image-upload-input'
import AddressInput from '@/features/auth/components/AddressInput'
import { api } from '@/lib/axios'
import { useSignupStore } from '@/store/signupStore'

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

  const w = window as unknown as { daum?: { Postcode?: unknown } }
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
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [certificateFile, setCertificateFile] = useState<File | null>(null)
  const [facilityFile1, setFacilityFile1] = useState<File | null>(null)
  const [facilityFile2, setFacilityFile2] = useState<File | null>(null)
  const [facilityFile3, setFacilityFile3] = useState<File | null>(null)
  const [facilityFile4, setFacilityFile4] = useState<File | null>(null)

  useEffect(() => {
    let mounted = true

    const load = async () => {
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
          location: '',
        })

        // 주소는 사용자에게 다시 입력받도록 비워둠
        setAddress('')
        setDetailAddress('')
      } catch {
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

  const onSubmit = async (_values: OrgInfoFormValues) => {
    setIsPending(true)
    try {
      // AddressInput은 store 기반이므로 여기서 location 조합
      const _nextLocation = detailAddress?.trim() ? `${address ?? ''} ${detailAddress}`.trim() : (address ?? '').trim()
      if (!_nextLocation) {
        toast.error('주소를 입력해주세요.')
        return
      }
      const fd = new FormData()
      // 텍스트 필드 (Swagger 스펙 기반)
      fd.append('organizationName', methods.getValues('organizationName') ?? '')
      fd.append('description', methods.getValues('description') ?? '')
      fd.append('phone', methods.getValues('phone') ?? '')
      fd.append('location', _nextLocation)
      fd.append('homepage', methods.getValues('homepage') ?? '')
      fd.append('govAuth', methods.getValues('govAuth') ?? '')

      // 파일 필드 (백엔드가 파일 업로드 포함임)
      if (logoFile) fd.append('logo', logoFile)
      if (certificateFile) fd.append('certificate', certificateFile)
      if (facilityFile1) fd.append('facilityImage1', facilityFile1)
      if (facilityFile2) fd.append('facilityImage2', facilityFile2)
      if (facilityFile3) fd.append('facilityImage3', facilityFile3)
      if (facilityFile4) fd.append('facilityImage4', facilityFile4)

      await api.patch('/mypage/organization', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      toast.success('저장되었습니다.')
      router.back()
    } finally {
      setIsPending(false)
    }
  }

  // 상태 표시용 UI 설정 (색상/라벨)
  const getApprovalStatusUI = (status: string) => {
    const s = (status || '').toLowerCase()
    if (s === 'approved') return { label: '승인됨', dot: 'bg-green-500', text: 'text-green-700' }
    if (s === 'rejected') return { label: '반려됨', dot: 'bg-red-500', text: 'text-red-700' }
    // pending 또는 기타 상태는 보류로 표시
    return { label: '승인 대기', dot: 'bg-amber-500', text: 'text-amber-700' }
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
                {(() => {
                  const ui = getApprovalStatusUI(approvalStatus)
                  return (
                    <span className="inline-flex items-center gap-2">
                      <span className={`h-2.5 w-2.5 rounded-full ${ui.dot}`} />
                      <span className={`truncate text-sm font-medium ${ui.text}`}>{ui.label}</span>
                    </span>
                  )
                })()}
              </div>
            </div>

            <div>
              <label htmlFor="organizationName" className="mb-1 block text-sm font-medium text-gray-800">
                기관명
              </label>
              <input
                id="organizationName"
                type="text"
                placeholder="예) (주)SWCampus"
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
                  <label className="mb-1 block text-sm font-medium text-gray-800">로고</label>
                  <Controller
                    control={methods.control}
                    name="logoUrl"
                    render={({ field }) => (
                      <ImageUploadInput currentUrl={field.value} file={logoFile} onFileChange={setLogoFile} />
                    )}
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-800">재직증명서</label>
                  <Controller
                    control={methods.control}
                    name="certificateUrl"
                    render={({ field }) => (
                      <ImageUploadInput
                        currentUrl={field.value}
                        file={certificateFile}
                        onFileChange={setCertificateFile}
                      />
                    )}
                  />
                </div>

                <div>
                  <label htmlFor="govAuth" className="mb-1 block text-sm font-medium text-gray-800">
                    정부 인증
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
                  <label className="mb-1 block text-sm font-medium text-gray-800">업체시설1</label>
                  <Controller
                    control={methods.control}
                    name="facilityImageUrl1"
                    render={({ field }) => (
                      <ImageUploadInput currentUrl={field.value} file={facilityFile1} onFileChange={setFacilityFile1} />
                    )}
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-800">업체시설2</label>
                  <Controller
                    control={methods.control}
                    name="facilityImageUrl2"
                    render={({ field }) => (
                      <ImageUploadInput currentUrl={field.value} file={facilityFile2} onFileChange={setFacilityFile2} />
                    )}
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-800">업체시설3</label>
                  <Controller
                    control={methods.control}
                    name="facilityImageUrl3"
                    render={({ field }) => (
                      <ImageUploadInput currentUrl={field.value} file={facilityFile3} onFileChange={setFacilityFile3} />
                    )}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-800">업체시설4</label>
                  <Controller
                    control={methods.control}
                    name="facilityImageUrl4"
                    render={({ field }) => (
                      <ImageUploadInput currentUrl={field.value} file={facilityFile4} onFileChange={setFacilityFile4} />
                    )}
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
