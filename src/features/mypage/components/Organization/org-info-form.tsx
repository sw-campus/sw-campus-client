'use client'

import { useEffect, useState } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { Controller, FormProvider, useForm } from 'react-hook-form'
import { FiX } from 'react-icons/fi'
import { toast } from 'sonner'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { CharacterCounter } from '@/components/ui/character-counter'
import { FieldGroup, FieldSet } from '@/components/ui/field'
import { ImageUploadInput } from '@/components/ui/image-upload-input'
import { APPROVAL_STATUS, type ApprovalStatus } from '@/features/admin/types/approval.type'
import { api } from '@/lib/axios'

type MyOrganizationResponse = {
  organizationId: number
  organizationName: string
  description: string
  representativeName: string
  phone: string
  location: string
  approvalStatus: ApprovalStatus | string
  certificateKey: string
  govAuth: string
  facilityImageUrl: string
  facilityImageUrl2: string
  facilityImageUrl3: string
  facilityImageUrl4: string
  logoUrl: string
  homepage: string
}

const MAX_DESCRIPTION_LENGTH = 500

const orgInfoSchema = z.object({
  organizationName: z.string().min(1, '기관명을 입력해주세요.'),
  representativeName: z.string().min(1, '대표자명을 입력해주세요.'),
  description: z.string().max(MAX_DESCRIPTION_LENGTH, `기관 소개는 ${MAX_DESCRIPTION_LENGTH}자 이내로 입력해주세요.`).optional(),
  homepage: z.string().optional(),
  logoUrl: z.string().optional(),
  certificateKey: z.string().optional(),
  govAuth: z.string().optional(),
  facilityImageUrl: z.string().optional(),
  facilityImageUrl2: z.string().optional(),
  facilityImageUrl3: z.string().optional(),
  facilityImageUrl4: z.string().optional(),
  location: z.string().optional(),
})

type OrgInfoFormValues = z.infer<typeof orgInfoSchema>
const INPUT_CLASS =
  'h-10 w-full rounded-md border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/20 focus:outline-none'

const TEXTAREA_CLASS =
  'w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/20 focus:outline-none'

export function OrgInfoForm({ embedded = false }: { embedded?: boolean }) {
  const router = useRouter()

  const [isPending, setIsPending] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [approvalStatus, setApprovalStatus] = useState<string>('')

  const methods = useForm<OrgInfoFormValues>({
    resolver: zodResolver(orgInfoSchema),
    mode: 'onChange',
    defaultValues: {
      organizationName: '',
      representativeName: '',
      description: '',
      homepage: '',
      logoUrl: '',
      certificateKey: '',
      govAuth: '',
      facilityImageUrl: '',
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
    watch,
  } = methods

  const description = watch('description') ?? ''
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [certificateFile, setCertificateFile] = useState<File | null>(null)
  const [facilityFile1, setFacilityFile1] = useState<File | null>(null)
  const [facilityFile2, setFacilityFile2] = useState<File | null>(null)
  const [facilityFile3, setFacilityFile3] = useState<File | null>(null)
  const [facilityFile4, setFacilityFile4] = useState<File | null>(null)

  useEffect(() => {
    let mounted = true

    const load = async () => {
      setIsLoading(true)
      try {
        const res = await api.get<MyOrganizationResponse>('/mypage/organization')
        if (!mounted) return

        const data = res.data

        setApprovalStatus(data.approvalStatus ?? '')

        methods.reset({
          organizationName: data.organizationName ?? '',
          representativeName: data.representativeName ?? '',
          description: data.description ?? '',
          homepage: data.homepage ?? '',
          logoUrl: data.logoUrl ?? '',
          certificateKey: data.certificateKey ?? '',
          govAuth: data.govAuth ?? '',
          facilityImageUrl: data.facilityImageUrl ?? '',
          facilityImageUrl2: data.facilityImageUrl2 ?? '',
          facilityImageUrl3: data.facilityImageUrl3 ?? '',
          facilityImageUrl4: data.facilityImageUrl4 ?? '',
          location: '',
        })
      } catch {
        // API 에러 toast는 axios 인터셉터에서 처리
      } finally {
        if (mounted) setIsLoading(false)
      }
    }

    load()

    return () => {
      mounted = false
    }
  }, [methods])

  const onSubmit = async (_values: OrgInfoFormValues) => {
    setIsPending(true)
    try {
      const fd = new FormData()
      // 텍스트 필드 (Swagger 스펙 기반)
      fd.append('organizationName', methods.getValues('organizationName') ?? '')
      fd.append('description', methods.getValues('description') ?? '')

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
      router.push('/')
    } finally {
      setIsPending(false)
    }
  }

  const getApprovalStatusUI = (status: string) => {
    const s = (status || '').toUpperCase()
    if (s === APPROVAL_STATUS.APPROVED) return { label: '승인됨', dot: 'bg-success', text: 'text-success' }
    if (s === APPROVAL_STATUS.REJECTED) return { label: '반려됨', dot: 'bg-destructive', text: 'text-destructive' }
    return { label: '대기중', dot: 'bg-warning', text: 'text-warning' }
  }

  const formContent = (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <FieldSet>
          <FieldGroup className="grid grid-cols-1 gap-6">
            {/* 수정 불가: 승인 상태 */}
            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">승인 상태</label>
              <div className={`${INPUT_CLASS} flex items-center bg-muted`}>
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
              <label htmlFor="organizationName" className="mb-1 block text-sm font-medium text-foreground">
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
              <div className="mb-1 flex items-center justify-between">
                <label htmlFor="description" className="text-sm font-medium text-foreground">
                  기관 소개
                </label>
                <CharacterCounter current={description.length} max={MAX_DESCRIPTION_LENGTH} />
              </div>
              <textarea
                id="description"
                rows={4}
                maxLength={MAX_DESCRIPTION_LENGTH}
                placeholder="기관 소개를 입력해주세요."
                {...register('description')}
                className={TEXTAREA_CLASS}
              />
            </div>

            <div>
              <label htmlFor="homepage" className="mb-1 block text-sm font-medium text-foreground">
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
              <p className="mb-3 text-sm font-semibold text-foreground">첨부/링크</p>

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-foreground">로고</label>
                  <Controller
                    control={methods.control}
                    name="logoUrl"
                    render={({ field }) => (
                      <ImageUploadInput currentUrl={field.value} file={logoFile} onFileChange={setLogoFile} />
                    )}
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-foreground">재직증명서</label>
                  <Controller
                    control={methods.control}
                    name="certificateKey"
                    render={({ field }) => (
                      <div className="space-y-2">
                        {/* 기존 재직증명서 등록 여부 표시 */}
                        {field.value && !certificateFile && (
                          <div className="flex items-center gap-2 rounded-md border border-success/30 bg-success/10 px-3 py-2">
                            <span className="text-success">✅</span>
                            <span className="text-sm font-medium text-success">재직증명서 등록됨</span>
                          </div>
                        )}
                        {/* 새 파일 업로드 */}
                        <ImageUploadInput
                          currentUrl={undefined}
                          file={certificateFile}
                          onFileChange={setCertificateFile}
                        />
                        {field.value && !certificateFile && (
                          <p className="text-xs text-muted-foreground">새 파일을 업로드하면 기존 파일이 대체됩니다.</p>
                        )}
                      </div>
                    )}
                  />
                </div>

                <div>
                  <label htmlFor="govAuth" className="mb-1 block text-sm font-medium text-foreground">
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

                {/* 시설 이미지 안내 */}
                <div className="rounded-lg border border-warning/30 bg-warning/10 p-3">
                  <p className="text-sm font-medium text-warning">📷 시설 사진 권장 비율</p>
                  <p className="mt-1 text-xs text-warning/80">16:9 비율 권장 (예: 1920x1080px, 1280x720px)</p>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-foreground">업체시설1</label>
                  <Controller
                    control={methods.control}
                    name="facilityImageUrl"
                    render={({ field }) => (
                      <ImageUploadInput currentUrl={field.value} file={facilityFile1} onFileChange={setFacilityFile1} />
                    )}
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-foreground">업체시설2</label>
                  <Controller
                    control={methods.control}
                    name="facilityImageUrl2"
                    render={({ field }) => (
                      <ImageUploadInput currentUrl={field.value} file={facilityFile2} onFileChange={setFacilityFile2} />
                    )}
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-foreground">업체시설3</label>
                  <Controller
                    control={methods.control}
                    name="facilityImageUrl3"
                    render={({ field }) => (
                      <ImageUploadInput currentUrl={field.value} file={facilityFile3} onFileChange={setFacilityFile3} />
                    )}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-foreground">업체시설4</label>
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
              className="h-11 w-full"
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
      <div className="rounded-2xl border border-border bg-card shadow-sm">
        <div className="flex items-center justify-between border-b border-border px-8 py-6">
          <h2 className="text-xl font-semibold text-foreground">기관 정보 수정</h2>

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
