'use client'

import { useRef } from 'react'

import { Controller, useFieldArray, useFormContext, useWatch } from 'react-hook-form'
import { FiChevronDown, FiChevronUp, FiTrash2, FiUpload } from 'react-icons/fi'

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
          <Button
            type="button"
            onClick={() => append({ teacherName: '', teacherDescription: null, teacherImageFile: null })}
          >
            강사 추가
          </Button>

          <div className="space-y-2">
            {fields.map((f, idx) => (
              <TeacherItem
                key={f.id}
                control={control}
                index={idx}
                totalCount={fields.length}
                onMove={move}
                onRemove={remove}
              />
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

type TeacherItemProps = {
  control: ReturnType<typeof useFormContext<LectureFormValues>>['control']
  index: number
  totalCount: number
  onMove: (from: number, to: number) => void
  onRemove: (index: number) => void
}

function TeacherItem({ control, index, totalCount, onMove, onRemove }: TeacherItemProps) {
  const imageInputRef = useRef<HTMLInputElement | null>(null)
  const imageFile = useWatch({ control, name: `teachers.${index}.teacherImageFile` })

  return (
    <div className="border-input space-y-3 rounded-md border p-3">
      <div className="flex items-center justify-between gap-2">
        <div className="text-sm font-medium">{index + 1}.</div>
        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={() => onMove(index, index - 1)}
            disabled={index === 0}
            aria-label="위로 이동"
          >
            <FiChevronUp className="size-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={() => onMove(index, index + 1)}
            disabled={index === totalCount - 1}
            aria-label="아래로 이동"
          >
            <FiChevronDown className="size-4" />
          </Button>
          <Button type="button" variant="ghost" size="icon-sm" onClick={() => onRemove(index)} aria-label="삭제">
            <FiTrash2 className="size-4" />
          </Button>
        </div>
      </div>

      <Controller
        control={control}
        name={`teachers.${index}.teacherName`}
        render={({ field }) => <Input placeholder="강사명" {...field} />}
      />

      <Controller
        control={control}
        name={`teachers.${index}.teacherDescription`}
        render={({ field }) => <Textarea placeholder="강사 소개" {...field} value={field.value ?? ''} />}
      />

      {/* 강사 이미지 업로드 */}
      <Controller
        control={control}
        name={`teachers.${index}.teacherImageFile`}
        render={({ field: { onChange }, fieldState }) => (
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <input
                ref={imageInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={e => {
                  const file = e.target.files?.[0] ?? null
                  console.log(`Teacher ${index + 1} image changed:`, file)
                  onChange(file)
                }}
              />
              <Button type="button" variant="outline" size="sm" onClick={() => imageInputRef.current?.click()}>
                <FiUpload className="mr-1 size-4" />
                이미지
              </Button>
              {imageFile && (
                <div className="flex items-center gap-2">
                  <img
                    src={URL.createObjectURL(imageFile)}
                    alt="강사 이미지 미리보기"
                    className="size-10 rounded-full object-cover"
                  />
                  <span className="text-muted-foreground max-w-32 truncate text-sm">{imageFile.name}</span>
                </div>
              )}
              {!imageFile && <span className="text-muted-foreground text-sm">이미지 없음</span>}
            </div>
            {fieldState.error && <FieldDescription className="text-red-600">{fieldState.error.message}</FieldDescription>}
          </div>
        )}
      />
    </div>
  )
}
