/* eslint-disable @next/next/no-img-element -- 파일 업로드 미리보기에 blob URL 사용 */
'use client'

import { useRef, useState, useEffect } from 'react'

import { useQuery } from '@tanstack/react-query'
import ColorThief from 'colorthief'

import { Button } from '@/components/ui/Button'
import { DialogFooter } from '@/components/ui/Dialog'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select'
import { getLectureSearch } from '@/features/lecture/api/lecture.api'
import { useDebounce } from '@/hooks/useDebounce'
import { toStartOfDayISO, toEndOfDayISO } from '@/lib/date'

import type { Banner, BannerType, CreateBannerRequest } from '../../types/banner.type'
import { BANNER_TYPE_LABEL } from '../../types/banner.type'

export interface BannerFormData extends Omit<CreateBannerRequest, 'lectureId'> {
  lectureId: number | null
  lectureName: string
}

export interface BannerFormProps {
  /** 수정 모드일 때 기존 배너 데이터 */
  initialBanner?: Banner | null
  /** 폼 제출 중 여부 */
  isSubmitting: boolean
  /** 제출 버튼 텍스트 */
  submitText: string
  /** 제출 중 버튼 텍스트 */
  submittingText: string
  /** 취소 버튼 클릭 핸들러 */
  onCancel: () => void
  /** 폼 제출 핸들러 */
  onSubmit: (data: BannerFormData, imageFile: File | null) => void
  /** 생성 모드에서 이미지 필수 여부 (기본값: true) */
  imageRequired?: boolean
}

/**
 * RGB 배열을 HEX 문자열로 변환
 */
function rgbToHex(rgb: [number, number, number]): string {
  return '#' + rgb.map(x => x.toString(16).padStart(2, '0')).join('')
}

export function BannerForm({
  initialBanner,
  isSubmitting,
  submitText,
  submittingText,
  onCancel,
  onSubmit,
  imageRequired = true,
}: BannerFormProps) {
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [searchKeyword, setSearchKeyword] = useState('')
  const [selectedLecture, setSelectedLecture] = useState<{ id: number; name: string } | null>(null)
  const [showDropdown, setShowDropdown] = useState(false)
  const [extractedColors, setExtractedColors] = useState<string[]>([])
  const [selectedColor, setSelectedColor] = useState<string>('')
  const [isExtractingColors, setIsExtractingColors] = useState(false)
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const [formData, setFormData] = useState<Omit<CreateBannerRequest, 'lectureId'>>({
    type: 'BIG',
    url: '',
    startDate: '',
    endDate: '',
  })

  const debouncedKeyword = useDebounce(searchKeyword, 300)

  // 이미지 URL에서 색상 추출
  const extractColors = async (imageUrl: string) => {
    setIsExtractingColors(true)
    try {
      const img = new Image()
      img.crossOrigin = 'Anonymous'

      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve()
        img.onerror = () => reject(new Error('Failed to load image'))
        img.src = imageUrl
      })

      const colorThief = new ColorThief()
      const palette = colorThief.getPalette(img, 5) as [number, number, number][]
      const hexColors = palette.map(rgbToHex)
      setExtractedColors(hexColors)

      // 첫 번째 색상 자동 선택
      if (hexColors.length > 0 && !selectedColor) {
        setSelectedColor(hexColors[0])
      }
    } catch (error) {
      console.error('Failed to extract colors:', error)
      setExtractedColors([])
    } finally {
      setIsExtractingColors(false)
    }
  }

  // 컴포넌트 언마운트 시 생성된 이미지 미리보기 URL을 해제하여 메모리 누수를 방지합니다.
  useEffect(() => {
    return () => {
      if (imagePreviewUrl) {
        URL.revokeObjectURL(imagePreviewUrl)
      }
    }
  }, [imagePreviewUrl])

  // 초기 배너 데이터로 폼 초기화 (수정 모드)
  useEffect(() => {
    if (initialBanner) {
      setSelectedLecture({ id: initialBanner.lectureId, name: initialBanner.lectureName })
      setSearchKeyword(initialBanner.lectureName)
      setFormData({
        type: initialBanner.type,
        url: initialBanner.url || '',
        startDate: initialBanner.startDate.split('T')[0],
        endDate: initialBanner.endDate.split('T')[0],
      })
      setImageFile(null)
      if (initialBanner.backgroundColor) {
        setSelectedColor(initialBanner.backgroundColor)
      }
    }
  }, [initialBanner])

  // 강의 검색 쿼리
  const { data: lectureData, isLoading: isSearching } = useQuery({
    queryKey: ['lectures', 'search', debouncedKeyword],
    queryFn: () => getLectureSearch(`text=${encodeURIComponent(debouncedKeyword)}&size=10`),
    enabled: debouncedKeyword.length >= 2 && showDropdown,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedLecture || !formData.startDate || !formData.endDate) {
      return
    }

    onSubmit(
      {
        ...formData,
        lectureId: selectedLecture.id,
        lectureName: selectedLecture.name,
        backgroundColor: selectedColor || undefined,
      },
      imageFile,
    )
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      // 이미지 미리보기 URL 생성
      const previewUrl = URL.createObjectURL(file)
      setImagePreviewUrl(previewUrl)
      extractColors(previewUrl)
    }
  }

  const handleSelectLecture = (lecture: { id: number; name: string }) => {
    setSelectedLecture(lecture)
    setSearchKeyword(lecture.name)
    setShowDropdown(false)
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchKeyword(e.target.value)
    setSelectedLecture(null)
    setShowDropdown(true)
  }

  const isEditMode = !!initialBanner

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* 강의 검색 */}
      <div className="space-y-2">
        <Label htmlFor="lecture">강의 *</Label>
        <div className="relative">
          <Input
            ref={inputRef}
            id="lecture"
            type="text"
            placeholder="강의명을 검색하세요..."
            value={searchKeyword}
            onChange={handleSearchChange}
            onFocus={() => setShowDropdown(true)}
            required={!selectedLecture}
          />
          {showDropdown && debouncedKeyword.length >= 2 && (
            <div className="bg-popover border-border absolute z-50 mt-1 max-h-48 w-full overflow-auto rounded-md border shadow-lg">
              {isSearching ? (
                <div className="text-muted-foreground p-3 text-sm">검색 중...</div>
              ) : lectureData?.content && lectureData.content.length > 0 ? (
                lectureData.content.map(lecture => (
                  <div
                    key={lecture.lectureId}
                    className="hover:bg-accent cursor-pointer p-3 text-sm"
                    onClick={() => handleSelectLecture({ id: lecture.lectureId, name: lecture.lectureName })}
                  >
                    <div className="text-foreground font-medium">{lecture.lectureName}</div>
                    <div className="text-muted-foreground text-xs">{lecture.orgName}</div>
                  </div>
                ))
              ) : (
                <div className="text-muted-foreground p-3 text-sm">검색 결과가 없습니다</div>
              )}
            </div>
          )}
          {selectedLecture && (
            <div className="text-muted-foreground mt-1 text-xs">선택된 강의 ID: {selectedLecture.id}</div>
          )}
        </div>
      </div>

      {/* 배너 타입 */}
      <div className="space-y-2">
        <Label htmlFor="type">배너 타입 *</Label>
        <Select value={formData.type} onValueChange={(value: BannerType) => setFormData({ ...formData, type: value })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {(Object.keys(BANNER_TYPE_LABEL) as BannerType[]).map(type => (
              <SelectItem key={type} value={type}>
                {BANNER_TYPE_LABEL[type]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* 이미지 */}
      <div className="space-y-2">
        <Label htmlFor="image">{isEditMode ? '이미지 (변경 시에만 선택)' : '이미지 *'}</Label>
        <Input
          id="image"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          required={imageRequired && !isEditMode}
        />
        {imageFile ? (
          <div className="space-y-2">
            <div className="text-muted-foreground truncate text-xs">
              {isEditMode ? '새 이미지: ' : '선택: '}
              {imageFile.name}
            </div>
            {/* 이미지 미리보기 */}
            {imagePreviewUrl && (
              <div
                className="relative h-40 w-full overflow-hidden rounded-lg border"
                style={{ backgroundColor: selectedColor || '#f3f4f6' }}
              >
                <img src={imagePreviewUrl} alt="미리보기" className="h-full w-full object-contain" />
              </div>
            )}
          </div>
        ) : isEditMode && initialBanner?.imageUrl ? (
          <div className="space-y-2">
            <div className="text-muted-foreground truncate text-xs">현재 이미지 유지</div>
            {/* 기존 이미지 미리보기 */}
            <div
              className="relative h-40 w-full overflow-hidden rounded-lg border"
              style={{ backgroundColor: initialBanner.backgroundColor || '#f3f4f6' }}
            >
              <img src={initialBanner.imageUrl} alt="현재 이미지" className="h-full w-full object-contain" />
            </div>
          </div>
        ) : null}
      </div>

      {/* 배경색 선택 */}
      <div className="space-y-2">
        <Label>배경색 (이미지 여백 채우기)</Label>
        {isExtractingColors ? (
          <div className="text-muted-foreground text-sm">색상 추출 중...</div>
        ) : extractedColors.length > 0 ? (
          <div className="space-y-2">
            <div className="text-muted-foreground text-xs">추출된 색상에서 선택하세요:</div>
            <div className="flex flex-wrap gap-2">
              {extractedColors.map((color, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setSelectedColor(color)}
                  className={`h-10 w-10 rounded-md border-2 transition-all ${
                    selectedColor === color
                      ? 'scale-110 border-blue-500 ring-2 ring-blue-300'
                      : 'border-gray-300 hover:scale-105'
                  }`}
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>
          </div>
        ) : selectedColor || (isEditMode && initialBanner?.backgroundColor) ? null : (
          <div className="text-muted-foreground text-sm">이미지를 선택하면 주요 색상이 자동 추출됩니다.</div>
        )}
        <div className="flex items-center gap-2">
          <Input
            type="text"
            placeholder="#FFFFFF"
            value={selectedColor}
            onChange={e => setSelectedColor(e.target.value)}
            className="w-32"
          />
          {selectedColor && (
            <div className="h-8 w-8 rounded border border-gray-300" style={{ backgroundColor: selectedColor }} />
          )}
        </div>
      </div>

      {/* 링크 URL */}
      <div className="space-y-2">
        <Label htmlFor="url">링크 URL</Label>
        <Input
          id="url"
          type="url"
          placeholder="https://..."
          value={formData.url}
          onChange={e => setFormData({ ...formData, url: e.target.value })}
        />
      </div>

      {/* 기간 */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="startDate">시작일 *</Label>
          <Input
            id="startDate"
            type="date"
            value={formData.startDate}
            onChange={e => setFormData({ ...formData, startDate: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="endDate">종료일 *</Label>
          <Input
            id="endDate"
            type="date"
            value={formData.endDate}
            onChange={e => setFormData({ ...formData, endDate: e.target.value })}
            required
          />
        </div>
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          취소
        </Button>
        <Button type="submit" disabled={isSubmitting || !selectedLecture}>
          {isSubmitting ? submittingText : submitText}
        </Button>
      </DialogFooter>
    </form>
  )
}

/**
 * 폼 데이터를 API 요청용 형식으로 변환하는 유틸리티 함수
 * 날짜를 OffsetDateTime 형식으로 변환합니다.
 */
export function toApiRequest(formData: BannerFormData): CreateBannerRequest {
  return {
    type: formData.type,
    url: formData.url,
    lectureId: formData.lectureId!,
    backgroundColor: formData.backgroundColor,
    startDate: toStartOfDayISO(formData.startDate),
    endDate: toEndOfDayISO(formData.endDate),
  }
}
