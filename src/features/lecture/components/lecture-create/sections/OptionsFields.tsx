'use client'

import { Controller, useFormContext } from 'react-hook-form'

import { Checkbox } from '@/components/ui/checkbox'
import { Field, FieldContent, FieldDescription, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
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
              <Textarea
                placeholder="1. ...&#10;2. ...&#10;형식으로 강의 목표를 작성해 주세요."
                {...field}
                value={field.value ?? ''}
              />
            )}
          />
        </FieldContent>
      </Field>

      <Field>
        <FieldLabel>수료 후 지원</FieldLabel>
        <FieldDescription>수료 후 지원 제공 여부를 선택해 주세요.</FieldDescription>
        <FieldContent>
          <Controller
            control={control}
            name="afterCompletion"
            render={({ field }) => (
              <div className="border-input flex items-center justify-between gap-4 rounded-md border px-3 py-2">
                <div className="space-y-0.5">
                  <div className="text-sm font-medium">수료 후 지원 제공</div>
                  <div className="text-muted-foreground text-xs">수료 후 지원 프로그램/혜택 제공 여부</div>
                </div>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </div>
            )}
          />
          {errors.afterCompletion && (
            <FieldDescription className="text-red-600">{errors.afterCompletion.message}</FieldDescription>
          )}
        </FieldContent>
      </Field>

      <Field>
        <FieldLabel>신청 페이지 URL</FieldLabel>
        <FieldDescription>선택 항목입니다. (예: https://example.com/lecture/1)</FieldDescription>
        <FieldContent>
          <Controller
            control={control}
            name="url"
            render={({ field }) => <Input placeholder="https://..." {...field} value={field.value ?? ''} />}
          />
          {errors.url && <FieldDescription className="text-red-600">{errors.url.message}</FieldDescription>}
        </FieldContent>
      </Field>
    </>
  )
}
