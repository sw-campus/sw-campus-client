'use client'

import { useEffect, useRef, useState } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { FormProvider, useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { FieldGroup, FieldSet } from '@/components/ui/field'
import { FormStepper } from '@/components/ui/form-stepper'
import { useCategoryTree } from '@/features/category/hooks/useCategoryTree'
import { lectureCreateFormDefaultValues } from '@/features/lecture/components/lecture-create'
import { LectureFormSteps, LECTURE_FORM_STEPS } from '@/features/lecture/components/lecture-create/LectureFormSteps'
import { useCreateLectureMutation } from '@/features/lecture/hooks/useCreateLectureMutation'
import { mapLectureFormToCreateRequest } from '@/features/lecture/utils/mapLectureFormToCreateRequest'
import { lectureFormSchema, type LectureFormValues } from '@/features/lecture/validation/lectureFormSchema'
import { stepFields } from '@/features/lecture/validation/lectureFormStepSchemas'

import { OrganizationSearchInput } from './OrganizationSearchInput'

const ADMIN_LECTURE_FORM_STEPS = [{ title: '기관 선택', description: '강의를 등록할 기관 선택' }, ...LECTURE_FORM_STEPS]

const TOTAL_STEPS = ADMIN_LECTURE_FORM_STEPS.length

type AdminLectureRegisterModalProps = {
  isOpen: boolean
  onClose: () => void
}

export function AdminLectureRegisterModal({ isOpen, onClose }: AdminLectureRegisterModalProps) {
  const { mutateAsync, isPending } = useCreateLectureMutation()
  const imageInputRef = useRef<HTMLInputElement | null>(null)
  const [currentStep, setCurrentStep] = useState(0)
  const { data: categoryTree } = useCategoryTree()

  const selectTriggerClassName = 'h-10'

  const methods = useForm<LectureFormValues>({
    resolver: zodResolver(lectureFormSchema),
    mode: 'onChange',
    defaultValues: lectureCreateFormDefaultValues,
  })

  const {
    handleSubmit,
    formState: { isSubmitting },
    trigger,
    reset,
    watch,
  } = methods
  const categoryId = watch('categoryId')

  useEffect(() => {
    if (isOpen) {
      reset(lectureCreateFormDefaultValues)
      setCurrentStep(0)
    }
  }, [isOpen, reset])

  // 단계 이동 시 스크롤 최상단으로 이동
  useEffect(() => {
    document.getElementById('admin-lecture-create-scroll-area')?.scrollTo(0, 0)
  }, [currentStep])

  const validateCurrentStep = async () => {
    if (currentStep === 0) {
      return await trigger('orgId')
    }
    // 기존 스텝 인덱스는 1부터 시작하므로 -1 해줌
    const originalStepIndex = currentStep - 1
    const fields = stepFields[originalStepIndex as keyof typeof stepFields]
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const isValid = await trigger(fields as any)
    return isValid
  }

  const handleNext = async () => {
    const isValid = await validateCurrentStep()
    if (isValid && currentStep < TOTAL_STEPS - 1) {
      setCurrentStep(prev => prev + 1)
    } else if (!isValid) {
      toast.error('현재 단계의 필수 항목을 확인해주세요.')
    }
  }

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const handleStepClick = async (step: number) => {
    if (step < currentStep) {
      setCurrentStep(step)
    } else if (step > currentStep) {
      const isValid = await validateCurrentStep()
      if (isValid) {
        setCurrentStep(step)
      }
    }
  }

  const onInvalid = (formErrors: Record<string, unknown>) => {
    const errorMessages: string[] = []
    const flattenErrors = (obj: Record<string, unknown>): void => {
      for (const key in obj) {
        const value = obj[key] as Record<string, unknown>
        if (value?.message && typeof value.message === 'string') {
          errorMessages.push(value.message)
        } else if (typeof value === 'object' && value !== null) {
          flattenErrors(value)
        }
      }
    }
    flattenErrors(formErrors)

    if (errorMessages.length > 0) {
      toast.error(
        <div className="space-y-1">
          <div className="font-bold">필수 항목을 확인해주세요</div>
          <ul className="list-inside list-disc text-sm">
            {errorMessages.slice(0, 5).map((msg, i) => (
              <li key={i}>{msg}</li>
            ))}
            {errorMessages.length > 5 && <li>...외 {errorMessages.length - 5}개</li>}
          </ul>
        </div>,
      )
    }
  }

  const onSubmit = async (values: LectureFormValues) => {
    const payload = mapLectureFormToCreateRequest(values)
    const teacherImageFiles = (values.teachers ?? [])
      .filter(t => !t.teacherId)
      .map(t => t.teacherImageFile)
      .filter((f): f is File => !!f)

    await mutateAsync({
      payload,
      lectureImageFile: (values.lectureImageFile as File) ?? null,
      teacherImageFiles: teacherImageFiles.length > 0 ? (teacherImageFiles as File[]) : undefined,
    })
    toast.success('강의가 성공적으로 등록되었습니다.')
    onClose()
  }

  const isLastStep = currentStep === TOTAL_STEPS - 1
  const isFirstStep = currentStep === 0

  const checkFormSubmission = (e: React.FormEvent) => {
    e.preventDefault()
    if (isLastStep) {
      return
    } else {
      handleNext()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent id="admin-lecture-create-scroll-area" className="max-h-[90vh] max-w-4xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>강의 등록 (관리자)</DialogTitle>
          <DialogDescription>관리자 권한으로 강의를 등록합니다. 먼저 등록할 기관을 선택해주세요.</DialogDescription>
        </DialogHeader>

        <FormProvider {...methods}>
          <form className="space-y-6" onSubmit={checkFormSubmission}>
            {/* Stepper Navigation */}
            <div className="pb-4">
              <FormStepper
                steps={ADMIN_LECTURE_FORM_STEPS}
                currentStep={currentStep}
                onStepClick={handleStepClick}
                allowStepClick={true}
              />
            </div>

            {/* Step Content */}
            <FieldSet>
              <FieldGroup>
                <div className="min-h-[400px]">
                  {currentStep === 0 && <OrganizationSearchInput />}
                  {currentStep > 0 && (
                    <LectureFormSteps
                      currentStep={currentStep - 1}
                      imageInputRef={imageInputRef}
                      selectTriggerClassName={selectTriggerClassName}
                      categoryId={categoryId}
                      categoryTree={categoryTree}
                    />
                  )}
                </div>

                {/* Navigation Buttons */}
                <div className="flex items-center justify-between border-t pt-6">
                  <Button type="button" variant="outline" onClick={handlePrev} disabled={isFirstStep} className="gap-2">
                    <ChevronLeft className="h-4 w-4" />
                    이전
                  </Button>

                  <span className="text-muted-foreground text-sm">
                    {currentStep + 1} / {TOTAL_STEPS}
                  </span>

                  <div className="flex gap-2">
                    <Button type="button" variant="outline" onClick={onClose}>
                      취소
                    </Button>
                    {isLastStep ? (
                      <Button
                        type="button"
                        onClick={handleSubmit(onSubmit, onInvalid)}
                        disabled={isSubmitting || isPending}
                      >
                        {isSubmitting || isPending ? '등록 중...' : '등록'}
                      </Button>
                    ) : (
                      <Button type="button" onClick={handleNext} className="gap-2">
                        다음
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </FieldGroup>
            </FieldSet>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  )
}
