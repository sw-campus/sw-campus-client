'use client'

import { Controller, useFormContext } from 'react-hook-form'

import { Checkbox } from '@/components/ui/checkbox'
import { Field, FieldContent, FieldDescription, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { toDigitsOnly } from '@/features/lecture/utils/inputFormat'
import type { LectureFormValues } from '@/features/lecture/validation/lectureFormSchema'

export function LectureCreateOptionsFields() {
  const {
    control,
    formState: { errors },
  } = useFormContext<LectureFormValues>()

  return (
    <>
      <Field>
        <FieldLabel>제공 항목</FieldLabel>
        <FieldContent>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Controller
              control={control}
              name="books"
              render={({ field }) => (
                <div className="flex items-center gap-2">
                  <Checkbox id="books" checked={field.value} onCheckedChange={v => field.onChange(v === true)} />
                  <Label htmlFor="books">교재 제공</Label>
                </div>
              )}
            />

            <Controller
              control={control}
              name="resume"
              render={({ field }) => (
                <div className="flex items-center gap-2">
                  <Checkbox id="resume" checked={field.value} onCheckedChange={v => field.onChange(v === true)} />
                  <Label htmlFor="resume">이력서 지원</Label>
                </div>
              )}
            />

            <Controller
              control={control}
              name="mockInterview"
              render={({ field }) => (
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="mockInterview"
                    checked={field.value}
                    onCheckedChange={v => field.onChange(v === true)}
                  />
                  <Label htmlFor="mockInterview">모의면접 제공</Label>
                </div>
              )}
            />

            <Controller
              control={control}
              name="employmentHelp"
              render={({ field }) => (
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="employmentHelp"
                    checked={field.value}
                    onCheckedChange={v => field.onChange(v === true)}
                  />
                  <Label htmlFor="employmentHelp">취업지원 제공</Label>
                </div>
              )}
            />
          </div>
        </FieldContent>
      </Field>

      <Field>
        <FieldLabel>목표</FieldLabel>
        <FieldContent>
          <Controller
            control={control}
            name="goal"
            render={({ field }) => (
              <Textarea placeholder="강의 목표를 입력해 주세요." {...field} value={field.value ?? ''} />
            )}
          />
        </FieldContent>
      </Field>

      <Field>
        <FieldLabel>수료 후 지원 기간(개월)</FieldLabel>
        <FieldDescription>선택 항목입니다.</FieldDescription>
        <FieldContent>
          <Controller
            control={control}
            name="afterCompletion"
            render={({ field }) => (
              <Input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder="예) 6"
                {...field}
                value={field.value === null || field.value === undefined ? '' : String(field.value)}
                onChange={e => {
                  const next = toDigitsOnly(e.target.value)
                  field.onChange(next === '' ? null : Number(next))
                }}
              />
            )}
          />
          {errors.afterCompletion && (
            <FieldDescription className="text-red-600">{errors.afterCompletion.message}</FieldDescription>
          )}
        </FieldContent>
      </Field>
    </>
  )
}
