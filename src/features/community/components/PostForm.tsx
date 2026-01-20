'use client'

import { useState, useEffect } from 'react'

import { useForm, Controller } from 'react-hook-form'
import { FiFolder, FiType, FiFileText, FiTag } from 'react-icons/fi'

import { Button } from '@/components/ui/button'
import { TiptapEditor } from '@/components/ui/editor/TiptapEditor'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

import type { BoardCategory } from '../api/boardCategoryApi.types'
import type { CreatePostRequest, PostDetail } from '../api/postApi.types'
import { BOOTCAMP_DIARY_CATEGORY_NAME } from '../constants'
import {
  DiaryTemplateForm,
  validateDiaryForm,
  buildDiaryBody,
  initialDiaryFormData,
  parseDiaryBody,
  parseDiaryTitle,
  parseWeekTag,
  type DiaryFormData,
} from './DiaryTemplateForm'
import { DiaryTitleInput, buildDiaryTitle, buildWeekTag } from './DiaryTitleInput'
import { LectureSearchModal, type SelectedLecture } from './LectureSearchModal'
import { LectureSelector } from './LectureSelector'

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
      // 제목 파싱 (기존 형식: "X월 Y주차 성장일기 - 한줄소감")
      const parsedTitle = parseDiaryTitle(initialData.title)
      if (parsedTitle) {
        setDiaryMonth(parsedTitle.month)
        setDiaryWeek(parsedTitle.week)
        setDiarySummary(parsedTitle.summary)
      } else {
        // 새 형식: 제목이 한줄소감만, 주차 정보는 태그에서 파싱
        const weekInfo = parseWeekTag(initialData.tags || [])
        if (weekInfo) {
          setDiaryMonth(weekInfo.month)
          setDiaryWeek(weekInfo.week)
        }
        setDiarySummary(initialData.title)
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

    // 부트캠프 성장일기: 주차 정보를 태그 맨 앞에 추가
    if (isBootcampDiaryCategory) {
      const weekTag = buildWeekTag(diaryMonth, diaryWeek)
      tags = [weekTag, ...tags.filter(tag => tag !== weekTag)]
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

  useEffect(() => {
    if (categories.length > 0 && initialData?.categoryId) {
      // findPath를 useEffect 내부로 이동하여 exhaustive-deps 경고 해결
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
            <SelectTrigger className="bg-background w-full">
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
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5 sm:space-y-6">
        {/* 카테고리 선택 */}
        <div className="rounded-2xl border border-gray-200/80 bg-white p-4 shadow-sm transition-shadow hover:shadow-md sm:p-5">
          <label className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-800">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-orange-100 to-amber-100">
              <FiFolder className="h-3.5 w-3.5 text-orange-600" />
            </div>
            카테고리 선택 <span className="text-orange-500">*</span>
          </label>
          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">{renderCategorySelects()}</div>
          <input
            type="hidden"
            {...register('boardCategoryId', {
              required: '카테고리를 최하위 단계까지 선택해주세요',
              validate: value => value > 0 || '카테고리를 선택해주세요',
            })}
          />
          {errors.boardCategoryId && (
            <p className="mt-2 text-sm font-medium text-red-500">{errors.boardCategoryId.message}</p>
          )}
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
          <div className="rounded-2xl border border-gray-200/80 bg-white p-4 shadow-sm transition-shadow hover:shadow-md sm:p-5">
            <label htmlFor="title" className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-800">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-blue-100 to-indigo-100">
                <FiType className="h-3.5 w-3.5 text-blue-600" />
              </div>
              제목 <span className="text-orange-500">*</span>
            </label>
            <Input
              id="title"
              type="text"
              {...register('title', {
                required: '제목을 입력해주세요',
                maxLength: { value: 100, message: '제목은 100자 이내로 입력해주세요' },
              })}
              placeholder="제목을 입력해주세요"
              className="h-11 rounded-xl border-gray-200 bg-gray-50/50 transition-all focus:border-orange-300 focus:bg-white focus:ring-2 focus:ring-orange-100"
            />
            {errors.title && <p className="mt-2 text-sm font-medium text-red-500">{errors.title.message}</p>}
          </div>
        )}

        {/* 본문 */}
        {isBootcampDiaryCategory ? (
          <DiaryTemplateForm formData={diaryForm} errors={diaryErrors} onChange={handleDiaryChange} />
        ) : (
          <div className="rounded-2xl border border-gray-200/80 bg-white p-4 shadow-sm transition-shadow hover:shadow-md sm:p-5">
            <label htmlFor="body" className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-800">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-green-100 to-emerald-100">
                <FiFileText className="h-3.5 w-3.5 text-green-600" />
              </div>
              내용 <span className="text-orange-500">*</span>
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
                  className={errors.body ? 'rounded-xl border-red-500 ring-1 ring-red-500' : 'rounded-xl'}
                />
              )}
            />
            {errors.body && <p className="mt-2 text-sm font-medium text-red-500">{errors.body.message}</p>}
          </div>
        )}

        {/* 태그 */}
        <div className="rounded-2xl border border-gray-200/80 bg-white p-4 shadow-sm transition-shadow hover:shadow-md sm:p-5">
          <label htmlFor="tags" className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-800">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-purple-100 to-violet-100">
              <FiTag className="h-3.5 w-3.5 text-purple-600" />
            </div>
            <span>태그</span>
            <span className="text-xs font-normal text-gray-500">(쉼표로 구분)</span>
            {selectedLecture && (
              <span className="ml-1 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                + 강의 정보 자동 추가
              </span>
            )}
          </label>
          <Input
            id="tags"
            type="text"
            {...register('tags')}
            placeholder="React, TypeScript, Next.js"
            className="h-11 rounded-xl border-gray-200 bg-gray-50/50 transition-all focus:border-orange-300 focus:bg-white focus:ring-2 focus:ring-orange-100"
          />
          {selectedLecture && (
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-orange-100 to-amber-100 px-3 py-1 text-sm font-medium text-orange-700 ring-1 ring-orange-200/50">
                <FiTag className="h-3 w-3" />
                {selectedLecture.name}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-orange-100 to-amber-100 px-3 py-1 text-sm font-medium text-orange-700 ring-1 ring-orange-200/50">
                <FiTag className="h-3 w-3" />
                {selectedLecture.orgName}
              </span>
            </div>
          )}
        </div>

        {/* 제출 버튼 */}
        <div className="flex justify-end pt-2">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="h-12 w-full rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-base font-semibold shadow-md shadow-orange-200/50 transition-all hover:shadow-lg hover:shadow-orange-300/50 active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-none disabled:bg-gray-300 disabled:text-gray-500 disabled:shadow-none sm:h-11 sm:w-auto sm:px-10 sm:text-sm"
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
          // 강의 선택 후 제목 입력 부분으로 스크롤
          setTimeout(() => {
            document.getElementById('diary-summary-input')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
            document.getElementById('diary-summary-input')?.focus()
          }, 100)
        }}
      />
    </>
  )
}
