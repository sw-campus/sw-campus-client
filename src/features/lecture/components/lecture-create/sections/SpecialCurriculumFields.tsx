'use client'

import { Controller, useFieldArray, useFormContext } from 'react-hook-form'
import { FiChevronDown, FiChevronUp, FiPlus, FiTrash2 } from 'react-icons/fi'

import { Button } from '@/components/ui/Button'
import { CharacterCounter } from '@/components/ui/CharacterCounter'
import { Field, FieldContent, FieldDescription, FieldLabel } from '@/components/ui/Field'
import { Input } from '@/components/ui/Input'
import type { LectureFormValues } from '@/features/lecture/validation/lectureFormSchema'

const TITLE_MAX_LENGTH = 20

const MAX_SPECIAL_CURRICULUMS = 5

export function LectureCreateSpecialCurriculumFields() {
  const {
    control,
    formState: { errors },
  } = useFormContext<LectureFormValues>()

  const { fields, append, move, remove } = useFieldArray({
    control,
    name: 'specialCurriculums',
  })

  const canAddMore = fields.length < MAX_SPECIAL_CURRICULUMS

  const handleAppend = () => {
    if (canAddMore) {
      append({ title: '', sortOrder: fields.length + 1 })
    }
  }

  return (
    <Field>
      <FieldLabel>특화 커리큘럼</FieldLabel>
      <FieldDescription>
        해당 강의만의 차별화된 특화 커리큘럼을 최대 {MAX_SPECIAL_CURRICULUMS}개까지 등록할 수 있습니다. 없으면 다음
        단계로 넘어가세요.
      </FieldDescription>
      <FieldContent>
        <div className="space-y-3">
          {fields.length === 0 ? (
            <button
              type="button"
              onClick={handleAppend}
              className="border-input hover:border-primary hover:bg-muted/50 flex w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed py-8 transition-colors"
            >
              <div className="bg-muted rounded-full p-2">
                <FiPlus className="text-muted-foreground size-5" />
              </div>
              <span className="text-muted-foreground text-sm">특화 커리큘럼 추가하기</span>
            </button>
          ) : (
            <div className="space-y-4">
              {fields.map((f, idx) => (
              <div key={f.id} className="border-input space-y-3 rounded-md border p-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium">{idx + 1}. 특화 커리큘럼</div>
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

                <div className="space-y-2">
                  <Controller
                    control={control}
                    name={`specialCurriculums.${idx}.title`}
                    render={({ field }) => {
                      const isOverLimit = (field.value?.length ?? 0) > TITLE_MAX_LENGTH
                      return (
                        <>
                          <div className="flex items-center justify-between">
                            <label className="text-sm font-medium">제목 *</label>
                            <CharacterCounter current={field.value?.length ?? 0} max={TITLE_MAX_LENGTH} />
                          </div>
                          <Input
                            placeholder="예) AI 프로젝트"
                            aria-invalid={isOverLimit}
                            {...field}
                          />
                        </>
                      )
                    }}
                  />
                  {errors.specialCurriculums?.[idx]?.title && (
                    <p className="text-destructive text-sm">{errors.specialCurriculums[idx]?.title?.message}</p>
                  )}
                </div>

                {/*
                  sortOrder는 현재 배열 인덱스(idx + 1)로 자동 동기화됨.
                  move() 호출 시 fields 배열 순서가 변경되고, 재렌더링 시 value={idx + 1}이
                  새로운 인덱스를 반영하므로 별도 업데이트 불필요.
                */}
                <Controller
                  control={control}
                  name={`specialCurriculums.${idx}.sortOrder`}
                  render={({ field }) => <input type="hidden" {...field} value={idx + 1} />}
                />
              </div>
              ))}

              {canAddMore && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleAppend}
                  className="w-full"
                >
                  <FiPlus className="mr-2 size-4" />
                  특화 커리큘럼 추가 ({fields.length}/{MAX_SPECIAL_CURRICULUMS})
                </Button>
              )}
            </div>
          )}

          {errors.specialCurriculums && typeof errors.specialCurriculums.message === 'string' && (
            <FieldDescription className="text-destructive">{errors.specialCurriculums.message}</FieldDescription>
          )}
          <Controller control={control} name="specialCurriculums" render={() => <></>} />
        </div>
      </FieldContent>
    </Field>
  )
}
