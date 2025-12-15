'use client'

import type { RefObject } from 'react'

import { Controller, useFormContext, useWatch } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import { Field, FieldContent, FieldDescription, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import type { LectureFormValues } from '@/features/lecture/validation/lectureFormSchema'

type Props = {
  imageInputRef: RefObject<HTMLInputElement | null>
}

export function LectureCreateBasicInfoFields({ imageInputRef }: Props) {
  const {
    control,
    formState: { errors },
  } = useFormContext<LectureFormValues>()

  const lectureImageFile = useWatch({ control, name: 'lectureImageFile' })

  return (
    <>
      <Field>
        <FieldLabel>강의명</FieldLabel>
        <FieldContent>
          <Controller
            control={control}
            name="lectureName"
            render={({ field }) => <Input placeholder="강의명을 입력하세요." {...field} />}
          />
          {errors.lectureName && (
            <FieldDescription className="text-red-600">{errors.lectureName.message}</FieldDescription>
          )}
        </FieldContent>
      </Field>

      <Field>
        <FieldLabel>총 교육시간</FieldLabel>
        <FieldContent>
          <Controller
            control={control}
            name="totalTimes"
            render={({ field }) => (
              <Input
                type="number"
                inputMode="numeric"
                min={1}
                step={1}
                placeholder="예) 960"
                {...field}
                value={String(field.value ?? 1)}
                onChange={e => field.onChange(e.target.value === '' ? 1 : Number(e.target.value))}
              />
            )}
          />
          {errors.totalTimes && (
            <FieldDescription className="text-red-600">{errors.totalTimes.message}</FieldDescription>
          )}
        </FieldContent>
      </Field>

      <Field>
        <FieldLabel>대표 이미지</FieldLabel>
        <FieldContent>
          <Controller
            control={control}
            name="lectureImageFile"
            render={({ field }) => (
              <div className="flex items-center gap-3">
                <input
                  ref={imageInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={e => {
                    const file = e.target.files?.[0] ?? null
                    field.onChange(file)
                  }}
                />
                <Button type="button" onClick={() => imageInputRef.current?.click()}>
                  업로드
                </Button>
                <span className="text-muted-foreground text-sm">{lectureImageFile?.name ?? '선택된 파일 없음'}</span>
              </div>
            )}
          />
        </FieldContent>
      </Field>
    </>
  )
}
