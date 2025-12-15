'use client'

import { Controller, useFormContext } from 'react-hook-form'

import { Field, FieldContent, FieldDescription, FieldLabel } from '@/components/ui/field'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import type { LectureFormValues } from '@/features/lecture/validation/lectureFormSchema'

type Props = {
  selectTriggerClassName: string
}

export function LectureCreateEquipmentFields({ selectTriggerClassName }: Props) {
  const {
    control,
    formState: { errors },
  } = useFormContext<LectureFormValues>()

  return (
    <>
      <Field>
        <FieldLabel>훈련시설/장비 특징</FieldLabel>
        <FieldContent>
          <Controller
            control={control}
            name="equipMerit"
            render={({ field }) => (
              <Textarea placeholder="예) 최신 GPU PC 제공, 실습실 24시간 개방" {...field} value={field.value ?? ''} />
            )}
          />
        </FieldContent>
      </Field>

      <Field>
        <FieldLabel>훈련 시설(PC)</FieldLabel>
        <FieldContent>
          <div className="space-y-1">
            <Label>장비</Label>
            <Controller
              control={control}
              name="equipPc"
              render={({ field }) => (
                <Select value={field.value ?? ''} onValueChange={v => field.onChange(v || null)}>
                  <SelectTrigger className={`${selectTriggerClassName} w-full`}>
                    <SelectValue placeholder="선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="NONE">없음</SelectItem>
                      <SelectItem value="PC">PC</SelectItem>
                      <SelectItem value="LAPTOP">노트북</SelectItem>
                      <SelectItem value="PERSONAL">개인장비</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.equipPc && <FieldDescription className="text-red-600">{errors.equipPc.message}</FieldDescription>}
          </div>
        </FieldContent>
      </Field>
    </>
  )
}

