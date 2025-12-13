'use client'

import { Controller, useFormContext } from 'react-hook-form'

import { DatePicker } from '@/components/common/DatePicker'
import { Checkbox } from '@/components/ui/checkbox'
import { Field, FieldContent, FieldDescription, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toDigitsOnly } from '@/features/lecture/utils/inputFormat'
import type { LectureFormValues } from '@/features/lecture/validation/lectureFormSchema'

export function LectureCreateScheduleFields() {
  const {
    control,
    formState: { errors },
  } = useFormContext<LectureFormValues>()

  return (
    <>
      <Field>
        <FieldLabel>
          운영 요일<span className="text-red-600">*</span>
        </FieldLabel>
        <FieldContent>
          <Controller
            control={control}
            name="days"
            render={({ field }) => {
              const value = field.value ?? []

              const toggle = (
                day: 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY',
              ) => {
                const next = value.includes(day) ? value.filter(v => v !== day) : [...value, day]
                field.onChange(next)
              }

              return (
                <div className="grid grid-cols-4 gap-2 sm:grid-cols-7">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="day-mon"
                      checked={value.includes('MONDAY')}
                      onCheckedChange={() => toggle('MONDAY')}
                    />
                    <Label htmlFor="day-mon">월</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="day-tue"
                      checked={value.includes('TUESDAY')}
                      onCheckedChange={() => toggle('TUESDAY')}
                    />
                    <Label htmlFor="day-tue">화</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="day-wed"
                      checked={value.includes('WEDNESDAY')}
                      onCheckedChange={() => toggle('WEDNESDAY')}
                    />
                    <Label htmlFor="day-wed">수</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="day-thu"
                      checked={value.includes('THURSDAY')}
                      onCheckedChange={() => toggle('THURSDAY')}
                    />
                    <Label htmlFor="day-thu">목</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="day-fri"
                      checked={value.includes('FRIDAY')}
                      onCheckedChange={() => toggle('FRIDAY')}
                    />
                    <Label htmlFor="day-fri">금</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="day-sat"
                      checked={value.includes('SATURDAY')}
                      onCheckedChange={() => toggle('SATURDAY')}
                    />
                    <Label htmlFor="day-sat">토</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="day-sun"
                      checked={value.includes('SUNDAY')}
                      onCheckedChange={() => toggle('SUNDAY')}
                    />
                    <Label htmlFor="day-sun">일</Label>
                  </div>
                </div>
              )
            }}
          />
          {errors.days && <FieldDescription className="text-red-600">{String(errors.days.message)}</FieldDescription>}
        </FieldContent>
      </Field>

      <Field>
        <FieldLabel>
          정원<span className="text-red-600">*</span>
        </FieldLabel>
        <FieldDescription>모집 정원을 입력해 주세요.</FieldDescription>
        <FieldContent>
          <Controller
            control={control}
            name="maxCapacity"
            render={({ field }) => (
              <Input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder="예) 30"
                {...field}
                value={field.value === null || field.value === undefined ? '' : String(field.value)}
                onChange={e => {
                  const next = toDigitsOnly(e.target.value)
                  field.onChange(next === '' ? null : Number(next))
                }}
              />
            )}
          />
          {errors.maxCapacity && (
            <FieldDescription className="text-red-600">{errors.maxCapacity.message}</FieldDescription>
          )}
        </FieldContent>
      </Field>

      <Field>
        <FieldLabel>모집 기간</FieldLabel>
        <FieldContent>
          <Controller
            control={control}
            name="deadlineDate"
            render={({ field }) => (
              <DatePicker label="모집 마감일" value={field.value ?? undefined} onSelect={field.onChange} />
            )}
          />
          {errors.deadlineDate && (
            <FieldDescription className="text-red-600">{errors.deadlineDate.message}</FieldDescription>
          )}
        </FieldContent>
      </Field>

      <Field>
        <FieldLabel>
          강의 기간<span className="text-red-600">*</span>
        </FieldLabel>
        <FieldContent>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <Controller
              control={control}
              name="startAtDate"
              render={({ field }) => <DatePicker label="시작일" value={field.value} onSelect={field.onChange} />}
            />
            <Controller
              control={control}
              name="endAtDate"
              render={({ field }) => <DatePicker label="종료일" value={field.value} onSelect={field.onChange} />}
            />
          </div>
          {(errors.startAtDate || errors.endAtDate) && (
            <FieldDescription className="text-red-600">
              {errors.startAtDate?.message ?? errors.endAtDate?.message}
            </FieldDescription>
          )}
        </FieldContent>
      </Field>

      <Field>
        <FieldLabel>수업 시간</FieldLabel>
        <FieldContent>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <Controller
              control={control}
              name="startTime"
              render={({ field }) => <Input type="time" aria-label="수업 시작" {...field} />}
            />
            <Controller
              control={control}
              name="endTime"
              render={({ field }) => <Input type="time" aria-label="수업 종료" {...field} />}
            />
          </div>
          {(errors.startTime || errors.endTime) && (
            <FieldDescription className="text-red-600">
              {errors.startTime?.message ?? errors.endTime?.message}
            </FieldDescription>
          )}
        </FieldContent>
      </Field>

      <Field>
        <FieldLabel>총 교육일수</FieldLabel>
        <FieldContent>
          <Controller
            control={control}
            name="totalDays"
            render={({ field }) => (
              <Input
                type="number"
                inputMode="numeric"
                min={1}
                step={1}
                placeholder="예) 12"
                {...field}
                value={String(field.value ?? 1)}
                onChange={e => field.onChange(e.target.value === '' ? 1 : Number(e.target.value))}
              />
            )}
          />
          {errors.totalDays && <FieldDescription className="text-red-600">{errors.totalDays.message}</FieldDescription>}
        </FieldContent>
      </Field>
    </>
  )
}
