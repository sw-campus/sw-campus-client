'use client'

import { useEffect } from 'react'

import { Controller, useFormContext, useWatch } from 'react-hook-form'

import { Checkbox } from '@/components/ui/checkbox'
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
    setValue,
    formState: { errors },
  } = useFormContext<LectureFormValues>()

  const equipPc = useWatch({ control, name: 'equipPc' })
  const isPcProvided = equipPc === 'PC' || equipPc === 'LAPTOP'

  useEffect(() => {
    if (!isPcProvided) setValue('equipOs', [])
  }, [isPcProvided, setValue])

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
          <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
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

            <div className="space-y-1">
              <Label className={!isPcProvided ? 'text-muted-foreground' : undefined}>운영체제</Label>
              <Controller
                control={control}
                name="equipOs"
                render={({ field }) => {
                  const value = field.value ?? []
                  const toggle = (os: 'WINDOWS' | 'MACOS' | 'LINUX') => {
                    const next = value.includes(os) ? value.filter(v => v !== os) : [...value, os]
                    field.onChange(next)
                  }

                  return (
                    <div className="grid grid-cols-3 gap-2">
                      <div className="flex items-center gap-2">
                        <Checkbox
                          id="os-windows"
                          checked={value.includes('WINDOWS')}
                          onCheckedChange={() => toggle('WINDOWS')}
                          disabled={!isPcProvided}
                        />
                        <Label htmlFor="os-windows" className={!isPcProvided ? 'text-muted-foreground' : undefined}>
                          Windows
                        </Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <Checkbox
                          id="os-macos"
                          checked={value.includes('MACOS')}
                          onCheckedChange={() => toggle('MACOS')}
                          disabled={!isPcProvided}
                        />
                        <Label htmlFor="os-macos" className={!isPcProvided ? 'text-muted-foreground' : undefined}>
                          macOS
                        </Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <Checkbox
                          id="os-linux"
                          checked={value.includes('LINUX')}
                          onCheckedChange={() => toggle('LINUX')}
                          disabled={!isPcProvided}
                        />
                        <Label htmlFor="os-linux" className={!isPcProvided ? 'text-muted-foreground' : undefined}>
                          Linux
                        </Label>
                      </div>
                    </div>
                  )
                }}
              />
            </div>
          </div>
        </FieldContent>
      </Field>
    </>
  )
}
