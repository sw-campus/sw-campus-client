'use client'

import { useEffect, useRef, useState } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { FormProvider, useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { FieldGroup, FieldSet } from '@/components/ui/field'
import { FormStepper } from '@/components/ui/form-stepper'
import { lectureCreateFormDefaultValues } from '@/features/lecture/components/lecture-create'
import { LectureFormSteps, LECTURE_FORM_STEPS } from '@/features/lecture/components/lecture-create/LectureFormSteps'
import { useCreateLectureMutation } from '@/features/lecture/hooks/useCreateLectureMutation'
import { mapLectureFormToCreateRequest } from '@/features/lecture/utils/mapLectureFormToCreateRequest'
import { lectureFormSchema, type LectureFormValues } from '@/features/lecture/validation/lectureFormSchema'
import { stepFields } from '@/features/lecture/validation/lectureFormStepSchemas'

const TOTAL_STEPS = LECTURE_FORM_STEPS.length

export function LectureCreateForm() {
  const router = useRouter()
  const { mutateAsync, isPending } = useCreateLectureMutation()
  const [currentStep, setCurrentStep] = useState(0)

  const selectTriggerClassName = 'h-10'
  const imageInputRef = useRef<HTMLInputElement | null>(null)

  const methods = useForm<LectureFormValues>({
    resolver: zodResolver(lectureFormSchema),
    mode: 'onChange',
    defaultValues: lectureCreateFormDefaultValues,
  })

  const {
    handleSubmit,
    formState: { isSubmitting },
    trigger,
  } = methods
  const categoryId = methods.watch('categoryId')

  const [isStepMoving, setIsStepMoving] = useState(false)

  const validateCurrentStep = async () => {
    const fields = stepFields[currentStep as keyof typeof stepFields]
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const isValid = await trigger(fields as any)
    return isValid
  }

  const handleNext = async () => {
    if (isStepMoving) return
    setIsStepMoving(true)
    try {
      const isValid = await validateCurrentStep()
      if (isValid && currentStep < TOTAL_STEPS - 1) {
        setCurrentStep(prev => prev + 1)
      } else if (!isValid) {
        toast.error('현재 단계의 필수 항목을 확인해주세요.')
      }
    } finally {
      setIsStepMoving(false)
    }
  }

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const handleStepClick = async (step: number) => {
    if (isStepMoving) return
    if (step < currentStep) {
      setCurrentStep(step)
    } else if (step > currentStep) {
      setIsStepMoving(true)
      try {
        // 앞으로 갈 때는 현재 단계 검증
        const isValid = await validateCurrentStep()
        if (isValid) {
          setCurrentStep(step)
        }
      } finally {
        setIsStepMoving(false)
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
    router.back()
  }

  // 단계 이동 시 스크롤 최상단으로 이동
  useEffect(() => {
    document.getElementById('lecture-create-scroll-area')?.scrollTo(0, 0)
  }, [currentStep])

  const checkFormSubmission = (e: React.FormEvent) => {
    e.preventDefault()
    if (isLastStep) {
      // 마지막 단계에서는 버튼 클릭으로만 제출 가능 (엔터 키 제출 방지)
      return
    } else {
      // 마지막 단계가 아니면 엔터 키 등으로 인한 제출 시 다음 단계로 진행 시도
      handleNext()
    }
  }

  const isLastStep = currentStep === TOTAL_STEPS - 1
  const isFirstStep = currentStep === 0

  return (
    <FormProvider {...methods}>
      <form className="space-y-6" onSubmit={checkFormSubmission}>
        {/* Stepper Navigation */}
        <div className="pb-4">
          <FormStepper
            steps={LECTURE_FORM_STEPS}
            currentStep={currentStep}
            onStepClick={handleStepClick}
            allowStepClick={!isStepMoving}
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
                categoryId={categoryId}
              />
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between border-t pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={handlePrev}
                disabled={isFirstStep || isStepMoving}
                className="gap-2"
              >
                <ChevronLeft className="h-4 w-4" />
                이전
              </Button>

              <span className="text-muted-foreground text-sm">
                {currentStep + 1} / {TOTAL_STEPS}
              </span>

              {isLastStep ? (
                <Button
                  type="button"
                  onClick={handleSubmit(onSubmit, onInvalid)}
                  disabled={isSubmitting || isPending || isStepMoving}
                >
                  {isSubmitting || isPending ? '등록 중...' : '등록'}
                </Button>
              ) : (
                <Button type="button" onClick={handleNext} disabled={isStepMoving} className="gap-2">
                  다음
                  <ChevronRight className="h-4 w-4" />
                </Button>
              )}
            </div>
          </FieldGroup>
        </FieldSet>
      </form>
    </FormProvider>
  )
}
