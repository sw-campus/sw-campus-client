'use client'

import { Controller, useFormContext } from 'react-hook-form'

import { Field, FieldContent, FieldDescription, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { toDigitsOnly } from '@/features/lecture/utils/inputFormat'
import type { LectureFormValues } from '@/features/lecture/validation/lectureFormSchema'

export function LectureCreateProjectFields() {
  const {
    control,
    formState: { errors },
  } = useFormContext<LectureFormValues>()

  return (
    <>
      <Field>
        <FieldLabel>프로젝트</FieldLabel>
        <FieldDescription>선택 항목입니다.</FieldDescription>
        <FieldContent>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <Controller
              control={control}
              name="projectNum"
              render={({ field }) => (
                <Input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  placeholder="프로젝트 개수"
                  {...field}
                  value={field.value === null || field.value === undefined ? '' : String(field.value)}
                  onChange={e => {
                    const next = toDigitsOnly(e.target.value)
                    field.onChange(next === '' ? null : Number(next))
                  }}
                />
              )}
            />
            <Controller
              control={control}
              name="projectTime"
              render={({ field }) => (
                <Input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  placeholder="프로젝트 시간 (주)"
                  {...field}
                  value={field.value === null || field.value === undefined ? '' : String(field.value)}
                  onChange={e => {
                    const next = toDigitsOnly(e.target.value)
                    field.onChange(next === '' ? null : Number(next))
                  }}
                />
              )}
            />
            <Controller
              control={control}
              name="projectTeam"
              render={({ field }) => <Input placeholder="프로젝트 팀 구성" {...field} value={field.value ?? ''} />}
            />
            <Controller
              control={control}
              name="projectTool"
              render={({ field }) => <Input placeholder="프로젝트 툴" {...field} value={field.value ?? ''} />}
            />
          </div>

          {(errors.projectNum || errors.projectTime || errors.projectTeam || errors.projectTool) && (
            <FieldDescription className="text-red-600">
              {errors.projectNum?.message ??
                errors.projectTime?.message ??
                errors.projectTeam?.message ??
                errors.projectTool?.message}
            </FieldDescription>
          )}
        </FieldContent>
      </Field>

      <Field>
        <FieldLabel>프로젝트 멘토링</FieldLabel>
        <FieldContent>
          <Controller
            control={control}
            name="projectMentor"
            render={({ field }) => (
              <div className="border-input flex items-center justify-between gap-4 rounded-md border px-3 py-2">
                <div className="space-y-0.5">
                  <div className="text-sm font-medium">멘토링 제공</div>
                  <div className="text-muted-foreground text-xs">프로젝트 진행 중 멘토링 제공 여부</div>
                </div>
                <Switch checked={field.value ?? false} onCheckedChange={field.onChange} />
              </div>
            )}
          />
        </FieldContent>
      </Field>
    </>
  )
}
