'use client'

import { useState } from 'react'

import { Controller, useFormContext } from 'react-hook-form'

import { Field, FieldContent, FieldDescription, FieldLabel } from '@/components/ui/field'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useCategoryTree } from '@/features/category'
import type { CategoryTreeNode } from '@/features/category/types/category.type'
import type { LectureFormValues } from '@/features/lecture/validation/lectureFormSchema'

type Props = {
  selectTriggerClassName?: string
  categoryTree?: CategoryTreeNode[]
  categoryId?: number | null // prop으로 받음
}

/**
 * 카테고리 트리에서 특정 categoryId의 경로(대/중/소)를 찾는 함수
 */
function findCategoryPath(categoryId: number, tree: CategoryTreeNode[], path: number[] = []): number[] | null {
  for (const node of tree) {
    if (node.categoryId === categoryId) {
      return [...path, node.categoryId]
    }
    if (node.children?.length) {
      const found = findCategoryPath(categoryId, node.children, [...path, node.categoryId])
      if (found) return found
    }
  }
  return null
}

export function LectureCreateCategoryFields({
  selectTriggerClassName = 'h-10',
  categoryTree: externalCategoryTree,
  categoryId: propCategoryId, // prop 받기
}: Props) {
  const {
    control,
    setValue,
    formState: { errors },
  } = useFormContext<LectureFormValues>()

  const { data: fetchedCategoryTree, isLoading: isTreeLoading } = useCategoryTree()
  const categoryTree = externalCategoryTree ?? fetchedCategoryTree
  const isLoading = !externalCategoryTree && isTreeLoading

  // 대분류, 중분류, 소분류 선택 상태
  const [level1Id, setLevel1Id] = useState<number | null>(null)
  const [level2Id, setLevel2Id] = useState<number | null>(null)
  const [level3Id, setLevel3Id] = useState<number | null>(null)

  // prop으로 받은 categoryId 사용
  const categoryId = propCategoryId

  // categoryId가 변경되면 대/중/소 분류 복원 (외부에서 변경된 경우에만)
  // Render-phase state update to avoid flash/race conditions
  const currentSelectedId = (() => {
    if (level3Id) return level3Id
    if (level2Id) {
      // 자식이 없는 중분류의 경우
      const parent = categoryTree?.flatMap(c => c.children ?? []).find(c => c.categoryId === level2Id)
      if (parent && (!parent.children || parent.children.length === 0)) {
        return level2Id
      }
    }
    return null
  })()

  if (categoryTree && categoryId && currentSelectedId !== categoryId) {
    const path = findCategoryPath(categoryId, categoryTree)
    if (path) {
      if (path[0] !== level1Id || path[1] !== level2Id || path[2] !== level3Id) {
        setLevel1Id(path[0] ?? null)
        setLevel2Id(path[1] ?? null)
        setLevel3Id(path[2] ?? null)
      }
    }
  }

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

  // 대분류 선택 핸들러
  const handleLevel1Change = (val: string) => {
    if (!val) return
    const id = Number(val)
    if (isNaN(id) || id === 0) return

    setLevel1Id(id)
    setLevel2Id(null)
    setLevel3Id(null)
    setValue('categoryId', null, { shouldDirty: true })
  }

  // 중분류 선택 핸들러
  const handleLevel2Change = (val: string) => {
    if (!val) return
    const id = Number(val)
    if (isNaN(id) || id === 0) return

    setLevel2Id(id)
    setLevel3Id(null)

    // 자식 카테고리가 없는지 확인
    const category = level2Categories.find(c => c.categoryId === id)
    const hasChildren = category?.children && category.children.length > 0

    if (!hasChildren) {
      setValue('categoryId', id, { shouldDirty: true })
    } else {
      setValue('categoryId', null, { shouldDirty: true })
    }
  }

  // 소분류 선택 핸들러
  const handleLevel3Change = (val: string) => {
    if (!val) return
    const id = Number(val)
    if (isNaN(id) || id === 0) return

    setLevel3Id(id)
    setValue('categoryId', id, { shouldDirty: true })
  }

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
        카테고리<span className="ml-1 text-xl font-bold text-red-600">*</span>
      </FieldLabel>
      <FieldDescription>대분류 → 중분류 → 소분류 순서로 선택해 주세요.</FieldDescription>
      <FieldContent>
        <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
          {/* 대분류 */}
          <Select value={level1Id?.toString() ?? ''} onValueChange={handleLevel1Change}>
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
            onValueChange={handleLevel2Change}
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
            onValueChange={handleLevel3Change}
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
