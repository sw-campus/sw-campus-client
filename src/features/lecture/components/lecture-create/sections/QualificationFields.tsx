'use client'

import { useState } from 'react'

import { Controller, useFieldArray, useFormContext, useWatch } from 'react-hook-form'
import { FiChevronDown, FiChevronUp, FiTrash2 } from 'react-icons/fi'

import { Button } from '@/components/ui/button'
import { Field, FieldContent, FieldDescription, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { LectureFormValues } from '@/features/lecture/validation/lectureFormSchema'

type QualType = 'REQUIRED' | 'PREFERRED'

type Props = {
  selectTriggerClassName: string
}

export function LectureCreateQualificationFields({ selectTriggerClassName }: Props) {
  const {
    control,
    formState: { errors },
  } = useFormContext<LectureFormValues>()

  const quals = useWatch({ control, name: 'quals' })
  const [selectedType, setSelectedType] = useState<QualType>('REQUIRED')

  const { fields, append, move, remove } = useFieldArray({
    control,
    name: 'quals',
  })

  const hasAny = (quals ?? []).length > 0

  return (
    <Field>
      <FieldLabel>자격 요건</FieldLabel>
      <FieldDescription>필요 시 추가해 주세요.</FieldDescription>
      <FieldContent>
        <div className="space-y-3">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <Select value={selectedType} onValueChange={v => setSelectedType(v as QualType)}>
              <SelectTrigger className={`w-full sm:w-[180px] ${selectTriggerClassName}`}>
                <SelectValue placeholder="유형 선택" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="REQUIRED">필수</SelectItem>
                  <SelectItem value="PREFERRED">우대</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>

            <Button type="button" onClick={() => append({ type: selectedType, text: '' })}>
              추가
            </Button>
          </div>

          {hasAny && (
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
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => remove(idx)}
                        aria-label="삭제"
                      >
                        <FiTrash2 className="size-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                    <Controller
                      control={control}
                      name={`quals.${idx}.type`}
                      render={({ field }) => (
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger className={`${selectTriggerClassName} w-full`}>
                            <SelectValue placeholder="유형" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectItem value="REQUIRED">필수</SelectItem>
                              <SelectItem value="PREFERRED">우대</SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      )}
                    />

                    <div className="sm:col-span-2">
                      <Controller
                        control={control}
                        name={`quals.${idx}.text`}
                        render={({ field }) => <Input placeholder="예) 프로그래밍 기초 지식 보유자" {...field} />}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {errors.quals && (
            <FieldDescription className="text-red-600">{String(errors.quals.message ?? '')}</FieldDescription>
          )}
          <Controller control={control} name="quals" render={() => <></>} />
        </div>
      </FieldContent>
    </Field>
  )
}
