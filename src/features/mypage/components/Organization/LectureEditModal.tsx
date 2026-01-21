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
import { useUpdateLectureMutation } from '@/features/lecture/hooks/useUpdateLectureMutation'
import type { LectureResponseDto } from '@/features/lecture/types/lecture-response.type'
import { mapLectureDetailToFormValues } from '@/features/lecture/utils/mapLectureDetailToFormValues'
import { mapLectureFormToCreateRequest } from '@/features/lecture/utils/mapLectureFormToCreateRequest'
import { lectureFormSchema, type LectureFormValues } from '@/features/lecture/validation/lectureFormSchema'
import { stepFields } from '@/features/lecture/validation/lectureFormStepSchemas'
import { api } from '@/lib/axios'

const TOTAL_STEPS = LECTURE_FORM_STEPS.length

type LectureEditModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  lectureId: number | null
  onSuccess?: () => void
}

export default function LectureEditModal({ open, onOpenChange, lectureId, onSuccess }: LectureEditModalProps) {
  const { mutateAsync, isPending } = useUpdateLectureMutation()
  const { data: categoryTree } = useCategoryTree()
  const imageInputRef = useRef<HTMLInputElement | null>(null)
  const selectTriggerClassName = 'h-10'
  const [isLoading, setIsLoading] = useState(true)
  const [currentStep, setCurrentStep] = useState(0)

  const methods = useForm<LectureFormValues>({
    resolver: zodResolver(lectureFormSchema),
    mode: 'onChange',
    defaultValues: lectureCreateFormDefaultValues,
  })

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
    trigger,
  } = methods
  const formCategoryId = methods.watch('categoryId')

  useEffect(() => {
    if (!open || !lectureId) return
    if (!categoryTree) return

    const fetchLecture = async () => {
      setIsLoading(true)
      try {
        const { data } = await api.get<LectureResponseDto>(`/mypage/lectures/${lectureId}`)
        const formValues = mapLectureDetailToFormValues(data, categoryTree)
        reset(formValues)
      } catch (error) {
        console.error('Failed to fetch lecture:', error)
        toast.error('강의 정보를 불러오는데 실패했습니다.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchLecture()
  }, [open, lectureId, reset, categoryTree])

  useEffect(() => {
    if (!open) {
      reset(lectureCreateFormDefaultValues)
      setIsLoading(true)
      setCurrentStep(0)
    }
  }, [open, reset])

  // 단계 이동 시 스크롤 최상단으로 이동
  useEffect(() => {
    document.getElementById('lecture-edit-scroll-area')?.scrollTo(0, 0)
  }, [currentStep])

  const validateCurrentStep = async () => {
    const fields = stepFields[currentStep as keyof typeof stepFields]
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
    if (!lectureId) return

    const payload = mapLectureFormToCreateRequest(values)
    const teacherImageFiles = (values.teachers ?? [])
      .filter(t => !t.teacherId)
      .map(t => t.teacherImageFile)
      .filter((f): f is File => !!f)

    await mutateAsync({
      lectureId,
      payload,
      lectureImageFile: (values.lectureImageFile as File) ?? null,
      teacherImageFiles: teacherImageFiles.length > 0 ? (teacherImageFiles as File[]) : undefined,
    })

    toast.success('강의가 성공적으로 수정되었습니다.')
    onOpenChange(false)
    onSuccess?.()
  }

  const isLastStep = currentStep === TOTAL_STEPS - 1
  const isFirstStep = currentStep === 0

  const checkFormSubmission = (e: React.FormEvent) => {
    e.preventDefault()
    if (isLastStep) {
      // 마지막 단계에서는 버튼 클릭으로만 제출 가능 (엔터 키 제출 방지)
      return
    } else {
      handleNext()
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent id="lecture-edit-scroll-area" className="max-h-[90vh] max-w-4xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>강의 수정</DialogTitle>
          <DialogDescription>강의 정보를 수정할 수 있습니다. 필수 항목을 모두 입력해 주세요.</DialogDescription>
        </DialogHeader>

        <FormProvider {...methods}>
          {isLoading && (
            <div className="flex h-64 items-center justify-center">
              <div className="text-muted-foreground">강의 정보 로딩 중...</div>
            </div>
          )}
          <form className={`space-y-6 ${isLoading ? 'hidden' : ''}`} onSubmit={checkFormSubmission}>
            {/* Stepper Navigation */}
            <div className="pb-4">
              <FormStepper
                steps={LECTURE_FORM_STEPS}
                currentStep={currentStep}
                onStepClick={handleStepClick}
                allowStepClick={true}
              />
            </div>

            {/* Step Content */}
            <FieldSet>
              <FieldGroup>
                <div className="min-h-[400px]">
                  <LectureFormSteps
                    currentStep={currentStep}
                    imageInputRef={imageInputRef}
                    selectTriggerClassName={selectTriggerClassName}
                    categoryTree={categoryTree}
                    categoryId={formCategoryId}
                    lectureId={lectureId}
                  />
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
                    <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                      취소
                    </Button>
                    {isLastStep ? (
                      <Button
                        type="button"
                        onClick={handleSubmit(onSubmit, onInvalid)}
                        disabled={isSubmitting || isPending}
                      >
                        {isSubmitting || isPending ? '수정 중...' : '수정'}
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
