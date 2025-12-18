'use client'

import { useRef } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { FormProvider, useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { FieldGroup, FieldSet } from '@/components/ui/field'
import {
  LectureCreateAddsFields,
  LectureCreateBasicInfoFields,
  LectureCreateCategoryFields,
  LectureCreateCostFields,
  LectureCreateCurriculumFields,
  LectureCreateEquipmentFields,
  LectureCreateLocationFields,
  LectureCreateOptionsFields,
  LectureCreateProjectFields,
  LectureCreateQualificationFields,
  LectureCreateRecruitProcedureFields,
  LectureCreateScheduleFields,
  LectureCreateTeachersFields,
  lectureCreateFormDefaultValues,
} from '@/features/lecture/components/lecture-create'
import { useCreateLectureMutation } from '@/features/lecture/hooks/useCreateLectureMutation'
import { mapLectureFormToCreateRequest } from '@/features/lecture/utils/mapLectureFormToCreateRequest'
import { lectureFormSchema, type LectureFormValues } from '@/features/lecture/validation/lectureFormSchema'

export function LectureCreateForm() {
  const router = useRouter()
  const { mutateAsync, isPending } = useCreateLectureMutation()

  const selectTriggerClassName = 'h-10'
  const imageInputRef = useRef<HTMLInputElement | null>(null)

  const methods = useForm<LectureFormValues>({
    resolver: zodResolver(lectureFormSchema),
    mode: 'onChange',
    defaultValues: lectureCreateFormDefaultValues,
  })

  const {
    handleSubmit,
    formState: { errors, isSubmitting },
    trigger,
  } = methods

  const onInvalid = (formErrors: Record<string, unknown>) => {
    // Collect all error messages
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
    console.log('Form values:', values)
    console.log('Teachers:', values.teachers)
    console.log(
      'Teacher image files:',
      values.teachers?.map(t => t.teacherImageFile),
    )
    console.log('Lecture image file:', values.lectureImageFile)

    const payload = mapLectureFormToCreateRequest(values)
    // z.any()로 변경했으므로, 값이 존재하고 Blob/File 여부를 느슨하게 체크하거나 단순히 truthy 체크
    const teacherImageFiles = (values.teachers ?? []).map(t => t.teacherImageFile).filter((f): f is File => !!f) // 단순히 값이 있는지만 체크

    console.log('Filtered teacher image files:', teacherImageFiles)

    await mutateAsync({
      payload,
      lectureImageFile: (values.lectureImageFile as File) ?? null,
      teacherImageFiles: teacherImageFiles.length > 0 ? (teacherImageFiles as File[]) : undefined,
    })
    toast.success('강의가 성공적으로 등록되었습니다.')
    router.back()
  }

  return (
    <FormProvider {...methods}>
      <form className="space-y-6" onSubmit={handleSubmit(onSubmit, onInvalid)}>
        <FieldSet>
          <FieldGroup>
            <LectureCreateBasicInfoFields imageInputRef={imageInputRef} />
            <LectureCreateCategoryFields selectTriggerClassName={selectTriggerClassName} />
            <LectureCreateCurriculumFields selectTriggerClassName={selectTriggerClassName} />
            <LectureCreateLocationFields selectTriggerClassName={selectTriggerClassName} />
            <LectureCreateScheduleFields />
            <LectureCreateRecruitProcedureFields selectTriggerClassName={selectTriggerClassName} />
            <LectureCreateQualificationFields selectTriggerClassName={selectTriggerClassName} />
            <LectureCreateCostFields selectTriggerClassName={selectTriggerClassName} />
            <LectureCreateOptionsFields />
            <LectureCreateEquipmentFields selectTriggerClassName={selectTriggerClassName} />
            <LectureCreateProjectFields />
            <LectureCreateTeachersFields />
            <LectureCreateAddsFields />

            <div className="pt-4">
              <Button type="submit" disabled={isSubmitting || isPending}>
                {isSubmitting || isPending ? '등록 중...' : '등록'}
              </Button>
            </div>
          </FieldGroup>
        </FieldSet>
      </form>
    </FormProvider>
  )
}
