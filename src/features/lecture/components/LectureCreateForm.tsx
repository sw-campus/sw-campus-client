'use client'

import { useRef } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { FormProvider, useForm } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import { FieldGroup, FieldSet } from '@/components/ui/field'
import { LectureCreateBasicInfoFields } from '@/features/lecture/components/lecture-create/LectureCreateBasicInfoFields'
import { LectureCreateCostFields } from '@/features/lecture/components/lecture-create/LectureCreateCostFields'
import { LectureCreateEquipmentFields } from '@/features/lecture/components/lecture-create/LectureCreateEquipmentFields'
import { LectureCreateLocationFields } from '@/features/lecture/components/lecture-create/LectureCreateLocationFields'
import { LectureCreateOptionsFields } from '@/features/lecture/components/lecture-create/LectureCreateOptionsFields'
import { LectureCreateProjectFields } from '@/features/lecture/components/lecture-create/LectureCreateProjectFields'
import { LectureCreateRecruitProcedureFields } from '@/features/lecture/components/lecture-create/LectureCreateRecruitProcedureFields'
import { LectureCreateScheduleFields } from '@/features/lecture/components/lecture-create/LectureCreateScheduleFields'
import { lectureCreateFormDefaultValues } from '@/features/lecture/components/lecture-create/defaultValues'
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
    formState: { isValid },
  } = methods

  const onSubmit = async (values: LectureFormValues) => {
    const payload = mapLectureFormToCreateRequest(values)
    await mutateAsync(payload)
    router.back()
  }

  return (
    <FormProvider {...methods}>
      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <FieldSet>
          <FieldGroup>
            <LectureCreateBasicInfoFields imageInputRef={imageInputRef} />
            <LectureCreateLocationFields selectTriggerClassName={selectTriggerClassName} />
            <LectureCreateScheduleFields />
            <LectureCreateRecruitProcedureFields selectTriggerClassName={selectTriggerClassName} />
            <LectureCreateCostFields selectTriggerClassName={selectTriggerClassName} />
            <LectureCreateOptionsFields />
            <LectureCreateEquipmentFields selectTriggerClassName={selectTriggerClassName} />
            <LectureCreateProjectFields />

            <div className="pt-4">
              <Button type="submit" disabled={!isValid || isPending}>
                등록
              </Button>
            </div>
          </FieldGroup>
        </FieldSet>
      </form>
    </FormProvider>
  )
}
