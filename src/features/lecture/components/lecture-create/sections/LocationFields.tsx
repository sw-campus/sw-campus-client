'use client'

import { Controller, useFormContext, useWatch } from 'react-hook-form'

import { Field, FieldContent, FieldDescription, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { LectureFormValues } from '@/features/lecture/validation/lectureFormSchema'

type Props = {
  selectTriggerClassName: string
}

export function LectureCreateLocationFields({ selectTriggerClassName }: Props) {
  const {
    control,
    formState: { errors },
  } = useFormContext<LectureFormValues>()

  const lectureLoc = useWatch({ control, name: 'lectureLoc' })

  return (
    <Field>
      <FieldLabel>강의 장소</FieldLabel>
      <FieldDescription>오프라인/병행 강의인 경우 오프라인 장소를 입력해 주세요.</FieldDescription>
      <FieldContent>
        <div className="grid grid-cols-3 gap-2">
          <div className="col-span-1 space-y-1">
            <Label>강의 유형</Label>
            <Controller
              control={control}
              name="lectureLoc"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className={`${selectTriggerClassName} w-full`}>
                    <SelectValue placeholder="장소 유형 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="ONLINE">온라인</SelectItem>
                      <SelectItem value="OFFLINE">오프라인</SelectItem>
                      <SelectItem value="HYBRID">온/오프라인 병행</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.lectureLoc && (
              <FieldDescription className="text-red-600">{errors.lectureLoc.message}</FieldDescription>
            )}
          </div>

          <div className="col-span-2 space-y-1">
            <Label>오프라인 장소</Label>
            <Controller
              control={control}
              name="location"
              render={({ field }) => (
                <Input
                  placeholder={lectureLoc === 'ONLINE' ? '온라인 강의는 비워도 됩니다.' : '예) 서울 강남구 ...'}
                  {...field}
                  value={field.value ?? ''}
                  disabled={lectureLoc === 'ONLINE'}
                />
              )}
            />
            {errors.location && <FieldDescription className="text-red-600">{errors.location.message}</FieldDescription>}
          </div>
        </div>
      </FieldContent>
    </Field>
  )
}
