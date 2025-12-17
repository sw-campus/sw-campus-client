'use client'

import { useEffect, useState } from 'react'

import { Controller, useFormContext } from 'react-hook-form'

import { Field, FieldContent, FieldDescription, FieldLabel } from '@/components/ui/field'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useCategoryTree } from '@/features/category'
import type { CategoryTreeNode } from '@/features/category/types/category.type'
import type { LectureFormValues } from '@/features/lecture/validation/lectureFormSchema'

type Props = {
  selectTriggerClassName?: string
}

export function LectureCreateCategoryFields({ selectTriggerClassName = 'h-10' }: Props) {
  const {
    control,
    setValue,
    formState: { errors },
  } = useFormContext<LectureFormValues>()

  const { data: categoryTree, isLoading } = useCategoryTree()

  // 대분류, 중분류, 소분류 선택 상태
  const [level1Id, setLevel1Id] = useState<number | null>(null)
  const [level2Id, setLevel2Id] = useState<number | null>(null)
  const [level3Id, setLevel3Id] = useState<number | null>(null)

  // 대분류 목록
  const level1Categories = categoryTree ?? []

  // 중분류 목록 (대분류 선택 시)
  const level2Categories = (() => {
    if (!level1Id || !categoryTree) return []
    const parent = categoryTree.find((c: CategoryTreeNode) => c.categoryId === level1Id)
    return parent?.children ?? []
  })()

  // 소분류 목록 (중분류 선택 시)
  const level3Categories = (() => {
    if (!level2Id || !level2Categories.length) return []
    const parent = level2Categories.find((c: CategoryTreeNode) => c.categoryId === level2Id)
    return parent?.children ?? []
  })()

  // 대분류 변경 시 중분류/소분류 초기화
  useEffect(() => {
    if (level1Id !== null) {
      setLevel2Id(null)
      setLevel3Id(null)
      setValue('categoryId', null)
    }
  }, [level1Id, setValue])

  // 중분류 변경 시 소분류 초기화
  useEffect(() => {
    if (level2Id !== null) {
      setLevel3Id(null)
      // 중분류에 자식이 없으면 중분류 ID를 categoryId로 설정
      const hasChildren = level2Categories.find(c => c.categoryId === level2Id)?.children?.length ?? 0
      if (hasChildren === 0) {
        setValue('categoryId', level2Id)
      } else {
        setValue('categoryId', null)
      }
    }
  }, [level2Id, level2Categories, setValue])

  // 소분류 변경 시 categoryId 설정
  useEffect(() => {
    if (level3Id !== null) {
      setValue('categoryId', level3Id)
    }
  }, [level3Id, setValue])

  if (isLoading) {
    return (
      <Field>
        <FieldLabel>카테고리</FieldLabel>
        <FieldContent>
          <div className="text-muted-foreground text-sm">카테고리 로딩 중...</div>
        </FieldContent>
      </Field>
    )
  }

  return (
    <Field>
      <FieldLabel>
        카테고리<span className="text-red-600">*</span>
      </FieldLabel>
      <FieldDescription>대분류 → 중분류 → 소분류 순서로 선택해 주세요.</FieldDescription>
      <FieldContent>
        <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
          {/* 대분류 */}
          <Select value={level1Id?.toString() ?? ''} onValueChange={v => setLevel1Id(v ? Number(v) : null)}>
            <SelectTrigger className={`${selectTriggerClassName} w-full`}>
              <SelectValue placeholder="대분류 선택" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {level1Categories.map(cat => (
                  <SelectItem key={cat.categoryId} value={cat.categoryId.toString()}>
                    {cat.categoryName}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          {/* 중분류 */}
          <Select
            value={level2Id?.toString() ?? ''}
            onValueChange={v => setLevel2Id(v ? Number(v) : null)}
            disabled={!level1Id || level2Categories.length === 0}
          >
            <SelectTrigger className={`${selectTriggerClassName} w-full`}>
              <SelectValue placeholder="중분류 선택" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {level2Categories.map(cat => (
                  <SelectItem key={cat.categoryId} value={cat.categoryId.toString()}>
                    {cat.categoryName}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          {/* 소분류 */}
          <Select
            value={level3Id?.toString() ?? ''}
            onValueChange={v => setLevel3Id(v ? Number(v) : null)}
            disabled={!level2Id || level3Categories.length === 0}
          >
            <SelectTrigger className={`${selectTriggerClassName} w-full`}>
              <SelectValue placeholder="소분류 선택" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {level3Categories.map(cat => (
                  <SelectItem key={cat.categoryId} value={cat.categoryId.toString()}>
                    {cat.categoryName}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        {/* Hidden controller for form validation */}
        <Controller control={control} name="categoryId" render={() => <></>} />

        {errors.categoryId && (
          <FieldDescription className="text-red-600">{String(errors.categoryId.message)}</FieldDescription>
        )}
      </FieldContent>
    </Field>
  )
}
