'use client'

import { Controller, useFieldArray, useFormContext } from 'react-hook-form'
import { FiChevronDown, FiChevronUp, FiTrash2 } from 'react-icons/fi'

import { Button } from '@/components/ui/button'
import { Field, FieldContent, FieldDescription, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import type { LectureFormValues } from '@/features/lecture/validation/lectureFormSchema'

export function LectureCreateAddsFields() {
  const {
    control,
    formState: { errors },
  } = useFormContext<LectureFormValues>()

  const { fields, append, move, remove } = useFieldArray({
    control,
    name: 'adds',
  })

  return (
    <Field>
      <FieldLabel>추가 제공 항목</FieldLabel>
      <FieldDescription>예) 취업 연계 프로그램</FieldDescription>
      <FieldContent>
        <div className="space-y-3">
          <Button type="button" onClick={() => append({ addName: '' })}>
            항목 추가
          </Button>

          <div className="space-y-2">
            {fields.map((f, idx) => (
              <div key={f.id} className="border-input flex items-center gap-2 rounded-md border p-3">
                <div className="text-sm font-medium">{idx + 1}.</div>
                <div className="flex-1">
                  <Controller
                    control={control}
                    name={`adds.${idx}.addName`}
                    render={({ field }) => <Input placeholder="추가 제공 항목" {...field} />}
                  />
                </div>
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
            ))}
          </div>

          {errors.adds && (
            <FieldDescription className="text-red-600">{String(errors.adds.message ?? '')}</FieldDescription>
          )}
          <Controller control={control} name="adds" render={() => <></>} />
        </div>
      </FieldContent>
    </Field>
  )
}
