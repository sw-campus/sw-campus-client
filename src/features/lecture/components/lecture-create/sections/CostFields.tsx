'use client'

import { Controller, useFormContext } from 'react-hook-form'

import { Field, FieldContent, FieldDescription, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { LectureFormValues } from '@/features/lecture/validation/lectureFormSchema'

type Props = {
  selectTriggerClassName: string
}

export function LectureCreateCostFields({ selectTriggerClassName }: Props) {
  const {
    control,
    formState: { errors },
  } = useFormContext<LectureFormValues>()

  return (
    <>
      <Field>
        <FieldLabel>
          내일배움카드<span className="text-red-600">*</span>
        </FieldLabel>
        <FieldDescription>내일배움카드 필요 여부를 선택해 주세요.</FieldDescription>
        <FieldContent>
          <Controller
            control={control}
            name="recruitType"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className={`${selectTriggerClassName} w-full`}>
                  <SelectValue placeholder="선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="GENERAL">내일배움카드 불필요</SelectItem>
                    <SelectItem value="CARD_REQUIRED">내일배움카드 필요</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          />
          {errors.recruitType && (
            <FieldDescription className="text-red-600">{String(errors.recruitType.message)}</FieldDescription>
          )}
        </FieldContent>
      </Field>

      <Field>
        <FieldLabel>정부 지원금 / 자기부담금 / 교육지원금</FieldLabel>
        <FieldDescription>금액은 원 단위로 입력합니다. (예: 1500000 = 150만원)</FieldDescription>
        <FieldContent>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
            <Controller
              control={control}
              name="subsidy"
              render={({ field }) => (
                <div className="space-y-1">
                  <div className="space-y-0.5">
                    <Label>정부 지원금</Label>
                    <p className="text-muted-foreground text-xs">정부에서 지원하는 훈련비</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input
                      className="min-w-0 flex-1"
                      type="number"
                      inputMode="numeric"
                      min={0}
                      step={1}
                      {...field}
                      value={String(field.value ?? 0)}
                      onChange={e => field.onChange(e.target.value === '' ? 0 : Number(e.target.value))}
                    />
                    <span className="text-muted-foreground shrink-0 text-sm whitespace-nowrap">원</span>
                  </div>
                </div>
              )}
            />

            <Controller
              control={control}
              name="lectureFee"
              render={({ field }) => (
                <div className="space-y-1">
                  <div className="space-y-0.5">
                    <Label>자기부담금</Label>
                    <p className="text-muted-foreground text-xs">훈련생 본인이 부담하는 비용</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input
                      className="min-w-0 flex-1"
                      type="number"
                      inputMode="numeric"
                      min={0}
                      step={1}
                      {...field}
                      value={String(field.value ?? 0)}
                      onChange={e => field.onChange(e.target.value === '' ? 0 : Number(e.target.value))}
                    />
                    <span className="text-muted-foreground shrink-0 text-sm whitespace-nowrap">원</span>
                  </div>
                </div>
              )}
            />

            <Controller
              control={control}
              name="eduSubsidy"
              render={({ field }) => (
                <div className="space-y-1">
                  <div className="space-y-0.5">
                    <Label>교육지원금 (월)</Label>
                    <p className="text-muted-foreground text-xs">훈련생에게 월 단위로 지급되는 지원금</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input
                      className="min-w-0 flex-1"
                      type="number"
                      inputMode="numeric"
                      min={0}
                      step={1}
                      {...field}
                      value={String(field.value ?? 0)}
                      onChange={e => field.onChange(e.target.value === '' ? 0 : Number(e.target.value))}
                      placeholder="월 금액 입력"
                    />
                    <span className="text-muted-foreground shrink-0 text-sm whitespace-nowrap">원</span>
                  </div>
                </div>
              )}
            />
          </div>

          {(errors.subsidy || errors.lectureFee || errors.eduSubsidy) && (
            <FieldDescription className="text-red-600">
              {errors.subsidy?.message ?? errors.lectureFee?.message ?? errors.eduSubsidy?.message}
            </FieldDescription>
          )}
        </FieldContent>
      </Field>
    </>
  )
}
