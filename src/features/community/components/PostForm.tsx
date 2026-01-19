'use client'

import { useState, useEffect } from 'react'

import { useForm, Controller } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import { TiptapEditor } from '@/components/ui/editor/TiptapEditor'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

import type { BoardCategory } from '../api/boardCategoryApi.types'
import type { CreatePostRequest, PostDetail } from '../api/postApi.types'
import {
  DiaryTemplateForm,
  validateDiaryForm,
  buildDiaryBody,
  initialDiaryFormData,
  parseDiaryBody,
  parseDiaryTitle,
  type DiaryFormData,
} from './DiaryTemplateForm'
import { DiaryTitleInput, buildDiaryTitle } from './DiaryTitleInput'
import { LectureSearchModal, type SelectedLecture } from './LectureSearchModal'
import { LectureSelector } from './LectureSelector'

// 부트캠프 성장일기 카테고리 이름
const BOOTCAMP_DIARY_CATEGORY_NAME = '부트캠프 성장일기'

interface PostFormData {
  title: string
  body: string
  boardCategoryId: number
  tags: string
}

interface PostFormProps {
  categories: BoardCategory[]
  initialData?: PostDetail
  onSubmit: (data: CreatePostRequest) => void
  isSubmitting?: boolean
  submitLabel?: string
}

/**
 * 게시글 작성/수정 폼 컴포넌트
 */
export function PostForm({
  categories,
  initialData,
  onSubmit,
  isSubmitting = false,
  submitLabel = '작성하기',
}: PostFormProps) {
  // 강의 선택 상태
  const [selectedLecture, setSelectedLecture] = useState<SelectedLecture | null>(null)
  const [isLectureModalOpen, setIsLectureModalOpen] = useState(false)
  const [lectureError, setLectureError] = useState<string | null>(null)

  // 부트캠프 성장일기 제목 상태
  const currentDate = new Date()
  const [diaryMonth, setDiaryMonth] = useState(currentDate.getMonth() + 1)
  const [diaryWeek, setDiaryWeek] = useState(Math.ceil(currentDate.getDate() / 7))
  const [diarySummary, setDiarySummary] = useState('')
  const [diarySummaryError, setDiarySummaryError] = useState<string | null>(null)

  // 부트캠프 성장일기 템플릿 상태
  const [diaryForm, setDiaryForm] = useState<DiaryFormData>(initialDiaryFormData)
  const [diaryErrors, setDiaryErrors] = useState<Partial<Record<keyof DiaryFormData, string>>>({})

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<PostFormData>({
    defaultValues: {
      title: initialData?.title || '',
      body: initialData?.body || '',
      boardCategoryId: initialData?.categoryId || categories[0]?.id || 0,
      tags: initialData?.tags?.join(', ') || '',
    },
  })

  // initialData가 비동기로 로드된 후 폼 값 업데이트
  useEffect(() => {
    if (initialData) {
      reset({
        title: initialData.title || '',
        body: initialData.body || '',
        boardCategoryId: initialData.categoryId || categories[0]?.id || 0,
        tags: initialData.tags?.join(', ') || '',
      })
    }
  }, [initialData, categories, reset])

  const watchedCategoryId = watch('boardCategoryId')

  // 부트캠프 성장일기 카테고리 ID를 찾는 헬퍼 함수
  const findBootcampDiaryCategoryId = (cats: BoardCategory[]): number | null => {
    for (const cat of cats) {
      if (cat.name === BOOTCAMP_DIARY_CATEGORY_NAME) return cat.id
      if (cat.children.length > 0) {
        const found = findBootcampDiaryCategoryId(cat.children)
        if (found !== null) return found
      }
    }
    return null
  }

  const bootcampDiaryCategoryId = findBootcampDiaryCategoryId(categories)
  // 수정/작성 모드 모두에서 부트캠프 성장일기 템플릿 사용
  const isBootcampDiaryCategory = bootcampDiaryCategoryId !== null && watchedCategoryId === bootcampDiaryCategoryId

  // 수정 모드에서 부트캠프 성장일기 기존 데이터 파싱
  useEffect(() => {
    if (initialData && isBootcampDiaryCategory) {
      // 제목 파싱
      const parsedTitle = parseDiaryTitle(initialData.title)
      if (parsedTitle) {
        setDiaryMonth(parsedTitle.month)
        setDiaryWeek(parsedTitle.week)
        setDiarySummary(parsedTitle.summary)
      }

      // 본문 파싱
      const parsedBody = parseDiaryBody(initialData.body)
      if (parsedBody) {
        setDiaryForm(parsedBody)
      }
    }
  }, [initialData, isBootcampDiaryCategory])

  // 카테고리 변경 시 상태 초기화
  useEffect(() => {
    if (!isBootcampDiaryCategory) {
      setSelectedLecture(null)
      setLectureError(null)
      setDiaryErrors({})
      setDiarySummaryError(null)
    }
  }, [isBootcampDiaryCategory])

  useEffect(() => {
    if (categories.length > 0 && !initialData?.categoryId) {
      setValue('boardCategoryId', categories[0].id)
    }
  }, [categories, initialData?.categoryId, setValue])

  // 폼 제출 핸들러
  const handleFormSubmit = (data: PostFormData) => {
    // 부트캠프 성장일기 유효성 검사
    if (isBootcampDiaryCategory) {
      if (!selectedLecture) {
        setLectureError('부트캠프 성장일기 작성 시 수강 강의를 선택해주세요.')
        document.getElementById('lecture-selector')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
        return
      }
      if (diarySummary.trim().length < 5) {
        setDiarySummaryError('한 줄 소감을 5자 이상 입력해주세요.')
        document.getElementById('diary-summary-input')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
        return
      }
      const templateErrors = validateDiaryForm(diaryForm)
      if (Object.keys(templateErrors).length > 0) {
        setDiaryErrors(templateErrors)
        // 첫 번째 에러 필드로 스크롤
        const firstErrorKey = Object.keys(templateErrors)[0]
        if (firstErrorKey) {
          document
            .getElementById(`diary-field-${firstErrorKey}`)
            ?.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }
        return
      }
    }

    // 에러 초기화
    setLectureError(null)
    setDiarySummaryError(null)
    setDiaryErrors({})

    // 태그 처리
    let tags = data.tags
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0)

    if (selectedLecture) {
      const lectureTags = [selectedLecture.name, selectedLecture.orgName].filter(Boolean)
      tags = [...lectureTags, ...tags.filter(tag => !lectureTags.includes(tag))]
    }

    // 제목/본문 생성
    const title = isBootcampDiaryCategory ? buildDiaryTitle(diaryMonth, diaryWeek, diarySummary) : data.title
    const body = isBootcampDiaryCategory ? buildDiaryBody(diaryForm) : data.body

    // 본문에서 이미지 URL 추출 (썸네일용)
    const extractedImages: string[] = []
    const imgRegex = /<img[^>]+src="([^"]+)"/g
    let match
    while ((match = imgRegex.exec(body)) !== null) {
      extractedImages.push(match[1])
    }

    onSubmit({
      boardCategoryId: Number(data.boardCategoryId),
      title,
      body,
      images: extractedImages.length > 0 ? extractedImages : undefined,
      tags: tags.length > 0 ? tags : undefined,
    })
  }

  // 템플릿 폼 변경 핸들러
  const handleDiaryChange = (field: keyof DiaryFormData, value: string) => {
    setDiaryForm(prev => ({ ...prev, [field]: value }))
    if (diaryErrors[field]) {
      setDiaryErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  // 카테고리 선택 로직
  const [selectedPath, setSelectedPath] = useState<number[]>([])

  const findPath = (cats: BoardCategory[], targetId: number): number[] | null => {
    for (const cat of cats) {
      if (cat.id === targetId) return [cat.id]
      if (cat.children.length > 0) {
        const path = findPath(cat.children, targetId)
        if (path) return [cat.id, ...path]
      }
    }
    return null
  }

  useEffect(() => {
    if (categories.length > 0 && initialData?.categoryId) {
      const path = findPath(categories, initialData.categoryId)
      if (path) {
        setSelectedPath(path)
        setValue('boardCategoryId', initialData.categoryId)
      }
    }
  }, [categories, initialData?.categoryId, setValue])

  const handleCategoryChange = (level: number, value: string) => {
    const newId = Number(value)
    if (!newId) return

    const nextPath = [...selectedPath.slice(0, level), newId]
    setSelectedPath(nextPath)

    let currentCats = categories
    let selectedCat: BoardCategory | undefined

    for (const id of nextPath) {
      selectedCat = currentCats.find(c => c.id === id)
      if (selectedCat?.children) currentCats = selectedCat.children
    }

    setValue('boardCategoryId', selectedCat?.children.length === 0 ? newId : 0, { shouldValidate: true })
  }

  const renderCategorySelects = () => {
    const selects = []
    let currentCats = categories

    for (let i = 0; i <= selectedPath.length; i++) {
      if (!currentCats?.length) break
      const selectedId = selectedPath[i] || ''

      selects.push(
        <div key={i} className="min-w-[150px] flex-1">
          <Select value={selectedId ? String(selectedId) : ''} onValueChange={value => handleCategoryChange(i, value)}>
            <SelectTrigger className="w-full border-gray-300 bg-white hover:border-orange-300 focus:border-orange-500 focus:ring-orange-200">
              <SelectValue placeholder={i === 0 ? '대분류 선택' : i === 1 ? '중분류 선택' : '소분류 선택'} />
            </SelectTrigger>
            <SelectContent>
              {currentCats.map(cat => (
                <SelectItem key={cat.id} value={String(cat.id)}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>,
      )

      if (selectedId) {
        const selectedCat = currentCats.find(c => c.id === Number(selectedId))
        if (selectedCat) currentCats = selectedCat.children
        else break
      } else break
    }
    return selects
  }

  return (
    <>
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        {/* 카테고리 선택 */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">카테고리 *</label>
          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">{renderCategorySelects()}</div>
          <input
            type="hidden"
            {...register('boardCategoryId', {
              required: '카테고리를 최하위 단계까지 선택해주세요',
              validate: value => value > 0 || '카테고리를 선택해주세요',
            })}
          />
          {errors.boardCategoryId && <p className="mt-1 text-sm text-red-500">{errors.boardCategoryId.message}</p>}
        </div>

        {/* 부트캠프 성장일기 - 강의 선택 */}
        {isBootcampDiaryCategory && (
          <LectureSelector
            selectedLecture={selectedLecture}
            onOpenModal={() => setIsLectureModalOpen(true)}
            onRemove={() => setSelectedLecture(null)}
            error={lectureError}
          />
        )}

        {/* 제목 */}
        {isBootcampDiaryCategory ? (
          <DiaryTitleInput
            month={diaryMonth}
            week={diaryWeek}
            summary={diarySummary}
            onMonthChange={setDiaryMonth}
            onWeekChange={setDiaryWeek}
            onSummaryChange={value => {
              setDiarySummary(value)
              if (diarySummaryError) setDiarySummaryError(null)
            }}
            error={diarySummaryError}
          />
        ) : (
          <div>
            <label htmlFor="title" className="mb-2 block text-sm font-medium text-gray-700">
              제목 *
            </label>
            <Input
              id="title"
              type="text"
              {...register('title', {
                required: '제목을 입력해주세요',
                maxLength: { value: 100, message: '제목은 100자 이내로 입력해주세요' },
              })}
              placeholder="제목을 입력해주세요"
              className="border-gray-300 focus:border-orange-500 focus:ring-orange-200"
            />
            {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title.message}</p>}
          </div>
        )}

        {/* 본문 */}
        {isBootcampDiaryCategory ? (
          <DiaryTemplateForm formData={diaryForm} errors={diaryErrors} onChange={handleDiaryChange} />
        ) : (
          <div>
            <label htmlFor="body" className="mb-2 block text-sm font-medium text-gray-700">
              내용 *
            </label>
            <Controller
              name="body"
              control={control}
              rules={{
                required: '내용을 입력해주세요',
                minLength: { value: 10, message: '내용은 10자 이상 입력해주세요' },
              }}
              render={({ field }) => (
                <TiptapEditor
                  content={field.value}
                  onChange={field.onChange}
                  placeholder="내용을 자유롭게 작성해주세요..."
                  minHeight="400px"
                  className={errors.body ? 'border-red-500 ring-1 ring-red-500' : ''}
                />
              )}
            />
            {errors.body && <p className="mt-1 text-sm text-red-500">{errors.body.message}</p>}
          </div>
        )}

        {/* 태그 */}
        <div>
          <label htmlFor="tags" className="mb-2 block text-sm font-medium text-gray-700">
            태그 (쉼표로 구분)
            {selectedLecture && (
              <span className="ml-2 text-xs font-normal text-green-600">+ 강의명, 훈련기관 자동 추가</span>
            )}
          </label>
          <Input
            id="tags"
            type="text"
            {...register('tags')}
            placeholder="React, TypeScript, Next.js"
            className="border-gray-300 focus:border-orange-500 focus:ring-orange-200"
          />
          {selectedLecture && (
            <div className="mt-2 flex flex-wrap gap-2">
              <span className="rounded-full bg-orange-100 px-3 py-1 text-sm text-orange-700">
                {selectedLecture.name}
              </span>
              <span className="rounded-full bg-orange-100 px-3 py-1 text-sm text-orange-700">
                {selectedLecture.orgName}
              </span>
            </div>
          )}
        </div>

        {/* 제출 버튼 */}
        <div className="flex justify-end gap-3">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="h-12 w-full bg-orange-500 text-base hover:bg-orange-600 active:scale-[0.98] sm:h-10 sm:w-auto sm:px-8 sm:text-sm"
          >
            {isSubmitting ? '처리 중...' : submitLabel}
          </Button>
        </div>
      </form>

      {/* 강의 검색 모달 */}
      <LectureSearchModal
        isOpen={isLectureModalOpen}
        onClose={() => setIsLectureModalOpen(false)}
        onSelect={lecture => {
          setSelectedLecture(lecture)
          setLectureError(null)
        }}
      />
    </>
  )
}
