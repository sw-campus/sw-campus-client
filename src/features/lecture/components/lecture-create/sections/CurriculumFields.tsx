'use client'

import { useEffect } from 'react'

import { Controller, useFieldArray, useFormContext, useWatch } from 'react-hook-form'

import { useCurriculumsByCategoryId } from '@/features/category'
import type { CurriculumLevel } from '@/features/category/types/category.type'
import { Checkbox } from '@/components/ui/checkbox'
import { Field, FieldContent, FieldDescription, FieldLabel } from '@/components/ui/field'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { LectureFormValues } from '@/features/lecture/validation/lectureFormSchema'

type Props = {
    selectTriggerClassName?: string
}

const LEVEL_OPTIONS: { value: CurriculumLevel; label: string }[] = [
    { value: 'BASIC', label: '기초' },
    { value: 'ADVANCED', label: '심화' },
]

export function LectureCreateCurriculumFields({ selectTriggerClassName = 'h-10' }: Props) {
    const {
        control,
        formState: { errors },
    } = useFormContext<LectureFormValues>()

    const categoryId = useWatch({ control, name: 'categoryId' })
    const { data: curriculums, isLoading } = useCurriculumsByCategoryId(categoryId ?? null)

    const { fields, update, replace } = useFieldArray({
        control,
        name: 'curriculums',
    })

    // 카테고리가 변경되거나 커리큘럼이 로드되면 모든 커리큘럼을 NONE으로 초기화
    useEffect(() => {
        if (curriculums && curriculums.length > 0) {
            const initialized = curriculums.map(c => ({
                curriculumId: c.curriculumId,
                level: 'NONE' as const,
            }))
            replace(initialized)
        }
    }, [curriculums, replace])
    // 체크 여부는 level이 NONE이 아닌 경우
    const getIsSelected = (curriculumId: number) => {
        const field = fields.find(f => f.curriculumId === curriculumId)
        return field ? field.level !== 'NONE' : false
    }

    const handleToggleCurriculum = (curriculumId: number, checked: boolean) => {
        const fieldIndex = fields.findIndex(f => f.curriculumId === curriculumId)
        if (fieldIndex === -1) return

        // 체크 시 BASIC, 체크 해제 시 NONE
        update(fieldIndex, { curriculumId, level: checked ? 'BASIC' : 'NONE' })
    }

    if (!categoryId) {
        return (
            <Field>
                <FieldLabel>커리큘럼</FieldLabel>
                <FieldContent>
                    <div className="text-muted-foreground text-sm">카테고리를 먼저 선택해 주세요.</div>
                </FieldContent>
            </Field>
        )
    }

    if (isLoading) {
        return (
            <Field>
                <FieldLabel>커리큘럼</FieldLabel>
                <FieldContent>
                    <div className="text-muted-foreground text-sm">커리큘럼 로딩 중...</div>
                </FieldContent>
            </Field>
        )
    }

    if (!curriculums || curriculums.length === 0) {
        return (
            <Field>
                <FieldLabel>커리큘럼</FieldLabel>
                <FieldContent>
                    <div className="text-muted-foreground text-sm">해당 카테고리에 등록된 커리큘럼이 없습니다.</div>
                </FieldContent>
            </Field>
        )
    }

    return (
        <Field>
            <FieldLabel>커리큘럼 및 난이도</FieldLabel>
            <FieldDescription>강의에 포함될 커리큘럼을 선택하고 난이도를 지정해 주세요.</FieldDescription>
            <FieldContent>
                <div className="space-y-3">
                    {curriculums.map(curriculum => {
                        const isSelected = getIsSelected(curriculum.curriculumId)
                        const fieldIndex = fields.findIndex(f => f.curriculumId === curriculum.curriculumId)

                        return (
                            <div key={curriculum.curriculumId} className="border-input flex items-center gap-4 rounded-md border p-3">
                                <Checkbox
                                    id={`curriculum-${curriculum.curriculumId}`}
                                    checked={isSelected}
                                    onCheckedChange={checked => handleToggleCurriculum(curriculum.curriculumId, !!checked)}
                                />
                                <Label htmlFor={`curriculum-${curriculum.curriculumId}`} className="flex-1">
                                    {curriculum.curriculumName}
                                </Label>

                                {isSelected && fieldIndex !== -1 && (
                                    <Controller
                                        control={control}
                                        name={`curriculums.${fieldIndex}.level`}
                                        render={({ field }) => (
                                            <Select value={field.value} onValueChange={field.onChange}>
                                                <SelectTrigger className={`${selectTriggerClassName} w-32`}>
                                                    <SelectValue placeholder="난이도" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        {LEVEL_OPTIONS.map(opt => (
                                                            <SelectItem key={opt.value} value={opt.value}>
                                                                {opt.label}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                        )}
                                    />
                                )}
                            </div>
                        )
                    })}
                </div>

                {errors.curriculums && (
                    <FieldDescription className="text-red-600">{String(errors.curriculums.message)}</FieldDescription>
                )}
            </FieldContent>
        </Field>
    )
}
