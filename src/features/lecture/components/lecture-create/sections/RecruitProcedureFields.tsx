'use client'

import { useState } from 'react'

import { Controller, useFieldArray, useFormContext, useWatch } from 'react-hook-form'
import { FiChevronDown, FiChevronUp, FiTrash2 } from 'react-icons/fi'

import { Button } from '@/components/ui/button'
import { Field, FieldContent, FieldDescription, FieldLabel } from '@/components/ui/field'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { LectureFormValues } from '@/features/lecture/validation/lectureFormSchema'

type Props = {
  selectTriggerClassName: string
}

export function LectureCreateRecruitProcedureFields({ selectTriggerClassName }: Props) {
  const {
    control,
    formState: { errors },
  } = useFormContext<LectureFormValues>()

  const recruitProcedures = useWatch({ control, name: 'recruitProcedures' })
  const [selectedRecruit, setSelectedRecruit] = useState<'DOCUMENT' | 'CODING_TEST' | 'INTERVIEW' | 'PRE_TASK'>(
    'DOCUMENT',
  )
  const [showRecruitDuplicateError, setShowRecruitDuplicateError] = useState(false)

  const {
    fields: recruitFields,
    append: appendRecruit,
    move: moveRecruit,
    remove: removeRecruit,
  } = useFieldArray({
    control,
    name: 'recruitProcedures',
  })

  const selectedRecruitTypes = new Set((recruitProcedures ?? []).map(p => p.type))
  const isSelectedRecruitAlreadyAdded = selectedRecruitTypes.has(selectedRecruit)

  return (
    <Field>
      <FieldLabel>선발 절차</FieldLabel>
      <FieldContent>
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Select
              value={selectedRecruit}
              onValueChange={v => {
                setSelectedRecruit(v as typeof selectedRecruit)
                setShowRecruitDuplicateError(false)
              }}
            >
              <SelectTrigger className={`w-[180px] ${selectTriggerClassName}`}>
                <SelectValue placeholder="절차 선택" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="DOCUMENT" disabled={selectedRecruitTypes.has('DOCUMENT')}>
                    서류
                  </SelectItem>
                  <SelectItem value="CODING_TEST" disabled={selectedRecruitTypes.has('CODING_TEST')}>
                    코딩테스트
                  </SelectItem>
                  <SelectItem value="INTERVIEW" disabled={selectedRecruitTypes.has('INTERVIEW')}>
                    면접
                  </SelectItem>
                  <SelectItem value="PRE_TASK" disabled={selectedRecruitTypes.has('PRE_TASK')}>
                    사전 과제
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>

            <Button
              type="button"
              onClick={() => {
                if (selectedRecruitTypes.has(selectedRecruit)) {
                  setShowRecruitDuplicateError(true)
                  return
                }
                appendRecruit({ type: selectedRecruit })
                setShowRecruitDuplicateError(false)
              }}
            >
              추가
            </Button>
          </div>

          {showRecruitDuplicateError && isSelectedRecruitAlreadyAdded && (
            <FieldDescription className="text-red-600">이미 추가된 절차입니다.</FieldDescription>
          )}

          <div className="space-y-2">
            {recruitFields.map((f, idx) => {
              const value = f.type
              const label =
                value === 'DOCUMENT'
                  ? '서류'
                  : value === 'CODING_TEST'
                    ? '코딩테스트'
                    : value === 'INTERVIEW'
                      ? '면접'
                      : value === 'PRE_TASK'
                        ? '사전 과제'
                        : value

              return (
                <div
                  key={f.id}
                  className="border-input flex items-center justify-between gap-2 rounded-md border px-3 py-2"
                >
                  <div className="text-sm">
                    {idx + 1}. {label}
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => moveRecruit(idx, idx - 1)}
                      disabled={idx === 0}
                      aria-label="위로 이동"
                    >
                      <FiChevronUp className="size-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => moveRecruit(idx, idx + 1)}
                      disabled={idx === recruitFields.length - 1}
                      aria-label="아래로 이동"
                    >
                      <FiChevronDown className="size-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => removeRecruit(idx)}
                      aria-label="삭제"
                    >
                      <FiTrash2 className="size-4" />
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>

          {errors.recruitProcedures && (
            <FieldDescription className="text-red-600">
              {String(errors.recruitProcedures.message ?? '')}
            </FieldDescription>
          )}

          <Controller control={control} name="recruitProcedures" render={() => <></>} />
        </div>
      </FieldContent>
    </Field>
  )
}
