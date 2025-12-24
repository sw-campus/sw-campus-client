'use client'

import { useEffect, useRef, useState } from 'react'

import { Controller, useFieldArray, useFormContext, useWatch } from 'react-hook-form'
import { FiChevronDown, FiChevronUp, FiSearch, FiTrash2, FiUpload, FiX } from 'react-icons/fi'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Field, FieldContent, FieldDescription, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import type { TeacherResponse } from '@/features/lecture/api/teacherApi'
import { useSearchTeachersQuery } from '@/features/lecture/hooks/useSearchTeachersQuery'
import type { LectureFormValues } from '@/features/lecture/validation/lectureFormSchema'
import { useDebounce } from '@/hooks/useDebounce'
import { cn } from '@/lib/utils'

export function LectureCreateTeachersFields() {
  const {
    control,
    clearErrors,
    formState: { errors },
  } = useFormContext<LectureFormValues>()

  const { fields, append, move, remove } = useFieldArray({
    control,
    name: 'teachers',
  })

  const [showSearchModal, setShowSearchModal] = useState(false)

  // 현재 선택된 강사 ID 목록
  const existingTeacherIds = fields
    .map(field => field.teacherId)
    .filter((id): id is number => id !== null && id !== undefined)

  const handleSelectExistingTeacher = (teacher: TeacherResponse) => {
    // 중복 체크
    if (existingTeacherIds.includes(teacher.teacherId)) {
      toast.error('이미 추가된 강사입니다.')
      return
    }

    append({
      teacherId: teacher.teacherId,
      teacherName: teacher.teacherName,
      teacherDescription: teacher.teacherDescription,
      teacherImageFile: null,
      teacherImageUrl: teacher.teacherImageUrl,
    })
    setShowSearchModal(false)
  }

  return (
    <Field>
      <FieldLabel>
        강사<span className="ml-1 text-xl font-bold text-red-600">*</span>
      </FieldLabel>
      <FieldDescription>
        강사를 최소 1명 이상 등록해 주세요. 기존 강사를 검색하거나 새로 등록할 수 있습니다.
      </FieldDescription>
      <FieldContent>
        <div className="space-y-3">
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={() => setShowSearchModal(true)}>
              <FiSearch className="mr-1 size-4" />
              기존 강사 검색
            </Button>
            <Button
              type="button"
              onClick={() =>
                append({
                  teacherId: null,
                  teacherName: '',
                  teacherDescription: null,
                  teacherImageFile: null,
                  teacherImageUrl: null,
                })
              }
            >
              신규 강사 추가
            </Button>
          </div>

          <div className="space-y-2">
            {fields.map((f, idx) => (
              <TeacherItem
                key={f.id}
                control={control}
                index={idx}
                totalCount={fields.length}
                onMove={move}
                onRemove={remove}
              />
            ))}
          </div>

          {errors.teachers && (
            <FieldDescription className="text-red-600">{String(errors.teachers.message ?? '')}</FieldDescription>
          )}
          <Controller control={control} name="teachers" render={() => <></>} />
        </div>
      </FieldContent>

      {/* 강사 검색 모달 */}
      {showSearchModal && (
        <TeacherSearchModal
          onSelect={handleSelectExistingTeacher}
          onClose={() => setShowSearchModal(false)}
          existingTeacherIds={existingTeacherIds}
        />
      )}
    </Field>
  )
}

type TeacherItemProps = {
  control: ReturnType<typeof useFormContext<LectureFormValues>>['control']
  index: number
  totalCount: number
  onMove: (from: number, to: number) => void
  onRemove: (index: number) => void
}

function TeacherItem({ control, index, totalCount, onMove, onRemove }: TeacherItemProps) {
  const imageInputRef = useRef<HTMLInputElement | null>(null)
  const imageFile = useWatch({ control, name: `teachers.${index}.teacherImageFile` })
  const teacherId = useWatch({ control, name: `teachers.${index}.teacherId` })
  const teacherImageUrl = useWatch({ control, name: `teachers.${index}.teacherImageUrl` })

  const isExistingTeacher = teacherId !== null && teacherId !== undefined

  return (
    <div className="border-input space-y-3 rounded-md border p-3">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="text-sm font-medium">{index + 1}.</div>
          {isExistingTeacher && (
            <span className="rounded bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">기존 강사</span>
          )}
        </div>
        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={() => onMove(index, index - 1)}
            disabled={index === 0}
            aria-label="위로 이동"
          >
            <FiChevronUp className="size-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={() => onMove(index, index + 1)}
            disabled={index === totalCount - 1}
            aria-label="아래로 이동"
          >
            <FiChevronDown className="size-4" />
          </Button>
          <Button type="button" variant="ghost" size="icon-sm" onClick={() => onRemove(index)} aria-label="삭제">
            <FiTrash2 className="size-4" />
          </Button>
        </div>
      </div>

      <Controller
        control={control}
        name={`teachers.${index}.teacherName`}
        render={({ field }) => (
          <Input
            placeholder="강사명"
            {...field}
            disabled={isExistingTeacher}
            className={isExistingTeacher ? 'bg-muted' : ''}
          />
        )}
      />

      <Controller
        control={control}
        name={`teachers.${index}.teacherDescription`}
        render={({ field }) => (
          <Textarea
            placeholder="강사 소개"
            {...field}
            value={field.value ?? ''}
            disabled={isExistingTeacher}
            className={isExistingTeacher ? 'bg-muted' : ''}
          />
        )}
      />

      {/* 기존 강사: 이미지 URL 표시, 신규 강사: 이미지 업로드 */}
      {isExistingTeacher ? (
        <div className="flex items-center gap-3">
          {teacherImageUrl ? (
            <>
              <img src={teacherImageUrl} alt="강사 이미지" className="size-10 rounded-full object-cover" />
              <span className="text-muted-foreground text-sm">기존 이미지 사용</span>
            </>
          ) : (
            <span className="text-muted-foreground text-sm">이미지 없음</span>
          )}
        </div>
      ) : (
        <Controller
          control={control}
          name={`teachers.${index}.teacherImageFile`}
          render={({ field: { onChange }, fieldState }) => (
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-3">
                <input
                  ref={imageInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={e => {
                    const file = e.target.files?.[0] ?? null
                    onChange(file)
                  }}
                />
                <Button type="button" variant="outline" size="sm" onClick={() => imageInputRef.current?.click()}>
                  <FiUpload className="mr-1 size-4" />
                  이미지
                </Button>
                {imageFile && (
                  <div className="flex items-center gap-2">
                    <img
                      src={URL.createObjectURL(imageFile)}
                      alt="강사 이미지 미리보기"
                      className="size-10 rounded-full object-cover"
                    />
                    <span className="text-muted-foreground max-w-32 truncate text-sm">{imageFile.name}</span>
                  </div>
                )}
                {!imageFile && <span className="text-muted-foreground text-sm">이미지 없음</span>}
              </div>
              {fieldState.error && (
                <FieldDescription className="text-red-600">{fieldState.error.message}</FieldDescription>
              )}
            </div>
          )}
        />
      )}
    </div>
  )
}

// 강사 검색 모달 컴포넌트
type TeacherSearchModalProps = {
  onSelect: (teacher: TeacherResponse) => void
  onClose: () => void
  existingTeacherIds: number[]
}

function TeacherSearchModal({ onSelect, onClose, existingTeacherIds }: TeacherSearchModalProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const debouncedQuery = useDebounce(searchQuery, 300)

  const { data: teachers, isLoading } = useSearchTeachersQuery(debouncedQuery)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-background w-full max-w-md rounded-lg p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold">기존 강사 검색</h3>
          <Button type="button" variant="ghost" size="icon-sm" onClick={onClose}>
            <FiX className="size-5" />
          </Button>
        </div>

        <div className="mb-4">
          <Input
            placeholder="강사 이름으로 검색..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            autoFocus
          />
        </div>

        <div className="max-h-64 overflow-y-auto">
          {isLoading && <div className="text-muted-foreground py-4 text-center text-sm">검색 중...</div>}

          {!isLoading && debouncedQuery && teachers?.length === 0 && (
            <div className="text-muted-foreground py-4 text-center text-sm">검색 결과가 없습니다.</div>
          )}

          {!isLoading && !debouncedQuery && (
            <div className="text-muted-foreground py-4 text-center text-sm">강사 이름을 입력해 주세요.</div>
          )}

          {teachers && teachers.length > 0 && (
            <div className="space-y-2">
              {teachers.map(teacher => {
                const isSelected = existingTeacherIds.includes(teacher.teacherId)
                return (
                  <button
                    key={teacher.teacherId}
                    type="button"
                    disabled={isSelected}
                    className={cn(
                      'hover:bg-muted flex w-full items-center gap-3 rounded-md border p-3 text-left transition-colors',
                      isSelected && 'bg-muted/50 cursor-not-allowed opacity-50',
                    )}
                    onClick={() => onSelect(teacher)}
                  >
                    {teacher.teacherImageUrl ? (
                      <img
                        src={teacher.teacherImageUrl}
                        alt={teacher.teacherName}
                        className="size-10 shrink-0 rounded-full object-cover"
                      />
                    ) : (
                      <div className="bg-muted flex size-10 shrink-0 items-center justify-center rounded-full text-sm font-medium">
                        {teacher.teacherName.charAt(0)}
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <div className="font-medium">{teacher.teacherName}</div>
                        {isSelected && <span className="text-xs font-medium text-red-500">선택됨</span>}
                      </div>
                      {teacher.teacherDescription && (
                        <div className="text-muted-foreground truncate text-sm">{teacher.teacherDescription}</div>
                      )}
                    </div>
                  </button>
                )
              })}
            </div>
          )}
        </div>

        <div className="mt-4 flex justify-end">
          <Button type="button" variant="outline" onClick={onClose}>
            닫기
          </Button>
        </div>
      </div>
    </div>
  )
}
