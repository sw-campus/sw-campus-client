'use client'

import { Controller, useFieldArray, useFormContext } from 'react-hook-form'
import { FiChevronDown, FiChevronUp, FiTrash2 } from 'react-icons/fi'

import { Button } from '@/components/ui/button'
import { Field, FieldContent, FieldDescription, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import type { LectureFormValues } from '@/features/lecture/validation/lectureFormSchema'

export function LectureCreateTeachersFields() {
  const {
    control,
    formState: { errors },
  } = useFormContext<LectureFormValues>()

  const { fields, append, move, remove } = useFieldArray({
    control,
    name: 'teachers',
  })

  return (
    <Field>
      <FieldLabel>강사</FieldLabel>
      <FieldDescription>필요 시 강사 정보를 추가해 주세요.</FieldDescription>
      <FieldContent>
        <div className="space-y-3">
          <Button type="button" onClick={() => append({ teacherName: '', teacherDescription: null })}>
            강사 추가
          </Button>

          <div className="space-y-2">
            {fields.map((f, idx) => (
              <div key={f.id} className="border-input space-y-2 rounded-md border p-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="text-sm font-medium">{idx + 1}.</div>
                  <div className="flex items-center gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => move(idx, idx - 1)}
                      disabled={idx === 0}
                      aria-label="위로 이동"
                    >
                      <FiChevronUp className="size-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => move(idx, idx + 1)}
                      disabled={idx === fields.length - 1}
                      aria-label="아래로 이동"
                    >
                      <FiChevronDown className="size-4" />
                    </Button>
                    <Button type="button" variant="ghost" size="icon-sm" onClick={() => remove(idx)} aria-label="삭제">
                      <FiTrash2 className="size-4" />
                    </Button>
                  </div>
                </div>

                <Controller
                  control={control}
                  name={`teachers.${idx}.teacherName`}
                  render={({ field }) => <Input placeholder="강사명" {...field} />}
                />

                <Controller
                  control={control}
                  name={`teachers.${idx}.teacherDescription`}
                  render={({ field }) => <Textarea placeholder="강사 소개" {...field} value={field.value ?? ''} />}
                />
              </div>
            ))}
          </div>

          {errors.teachers && (
            <FieldDescription className="text-red-600">{String(errors.teachers.message ?? '')}</FieldDescription>
          )}
          <Controller control={control} name="teachers" render={() => <></>} />
        </div>
      </FieldContent>
    </Field>
  )
}
