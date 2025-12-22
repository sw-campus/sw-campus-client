'use client'

import { useEffect, useRef, useState } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { FormProvider, useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { FieldGroup, FieldSet } from '@/components/ui/field'
import { useCategoryTree } from '@/features/category/hooks/useCategoryTree'
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
import { useUpdateLectureMutation } from '@/features/lecture/hooks/useUpdateLectureMutation'
import type { LectureResponseDto } from '@/features/lecture/types/lecture-response.type'
import { mapLectureDetailToFormValues } from '@/features/lecture/utils/mapLectureDetailToFormValues'
import { mapLectureFormToCreateRequest } from '@/features/lecture/utils/mapLectureFormToCreateRequest'
import { lectureFormSchema, type LectureFormValues } from '@/features/lecture/validation/lectureFormSchema'
import { api } from '@/lib/axios'

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

  const methods = useForm<LectureFormValues>({
    resolver: zodResolver(lectureFormSchema),
    mode: 'onChange',
    defaultValues: lectureCreateFormDefaultValues,
  })

  const {
    reset,
    handleSubmit,
    control,
    formState: { isSubmitting },
  } = methods
  const formCategoryId = methods.watch('categoryId')

  // 강의 상세 데이터 로드 및 폼 채우기
  useEffect(() => {
    if (!open || !lectureId) return
    // categoryTree가 로드될 때까지 대기
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
        // 폼이 리셋된 후 약간의 지연을 주어 CategoryFields가 올바르게 초기화되도록 함
        setTimeout(() => setIsLoading(false), 50)
      }
    }

    fetchLecture()
  }, [open, lectureId, reset, categoryTree])

  // 모달 닫힐 때 폼 리셋
  useEffect(() => {
    if (!open) {
      reset(lectureCreateFormDefaultValues)
      setIsLoading(true)
    }
  }, [open, reset])

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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
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
          <form className={`space-y-6 ${isLoading ? 'hidden' : ''}`} onSubmit={handleSubmit(onSubmit, onInvalid)}>
            <FieldSet>
              <FieldGroup>
                <LectureCreateBasicInfoFields imageInputRef={imageInputRef} />
                <LectureCreateCategoryFields
                  key={`category-${lectureId}`}
                  selectTriggerClassName={selectTriggerClassName}
                  categoryTree={categoryTree}
                  categoryId={formCategoryId}
                />
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

                <div className="flex justify-end gap-3 pt-4">
                  <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                    취소
                  </Button>
                  <Button type="submit" disabled={isSubmitting || isPending}>
                    {isSubmitting || isPending ? '수정 중...' : '수정'}
                  </Button>
                </div>
              </FieldGroup>
            </FieldSet>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  )
}
