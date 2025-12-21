'use client'

import { useEffect, useRef, useState } from 'react'

import { useQuery } from '@tanstack/react-query'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { getLectureSearch } from '@/features/lecture/api/lecture.api'
import { useDebounce } from '@/hooks/useDebounce'

import { useUpdateBannerMutation } from '../../hooks/useBanners'
import type { Banner, BannerType, CreateBannerRequest } from '../../types/banner.type'
import { BANNER_TYPE_LABEL } from '../../types/banner.type'

interface BannerEditModalProps {
  banner: Banner | null
  isOpen: boolean
  onClose: () => void
}

export function BannerEditModal({ banner, isOpen, onClose }: BannerEditModalProps) {
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [searchKeyword, setSearchKeyword] = useState('')
  const [selectedLecture, setSelectedLecture] = useState<{ id: number; name: string } | null>(null)
  const [showDropdown, setShowDropdown] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const [formData, setFormData] = useState<Omit<CreateBannerRequest, 'lectureId'>>({
    type: 'BIG',
    url: '',
    startDate: '',
    endDate: '',
  })

  const debouncedKeyword = useDebounce(searchKeyword, 300)

  // 배너 데이터로 폼 초기화
  useEffect(() => {
    if (banner && isOpen) {
      setSelectedLecture({ id: banner.lectureId, name: banner.lectureName })
      setSearchKeyword(banner.lectureName)
      setFormData({
        type: banner.type,
        url: banner.url || '',
        startDate: banner.startDate.split('T')[0],
        endDate: banner.endDate.split('T')[0],
      })
      setImageFile(null)
    }
  }, [banner, isOpen])

  // 강의 검색 쿼리
  const { data: lectureData, isLoading: isSearching } = useQuery({
    queryKey: ['lectures', 'search', debouncedKeyword],
    queryFn: () => getLectureSearch(`text=${encodeURIComponent(debouncedKeyword)}&size=10`),
    enabled: debouncedKeyword.length >= 2 && showDropdown,
  })

  const updateMutation = useUpdateBannerMutation()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!banner || !selectedLecture || !formData.startDate || !formData.endDate) {
      return
    }

    // 날짜를 OffsetDateTime 형식으로 변환
    const startDateISO = `${formData.startDate}T00:00:00+09:00`
    const endDateISO = `${formData.endDate}T23:59:59+09:00`

    updateMutation.mutate(
      {
        id: banner.id,
        request: {
          ...formData,
          lectureId: selectedLecture.id,
          startDate: startDateISO,
          endDate: endDateISO,
        },
        imageFile: imageFile ?? undefined,
      },
      {
        onSuccess: () => {
          onClose()
        },
      },
    )
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
    }
  }

  const handleSelectLecture = (lecture: { id: number; name: string }) => {
    setSelectedLecture(lecture)
    setSearchKeyword(lecture.name)
    setShowDropdown(false)
  }

  if (!banner) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>배너 수정</DialogTitle>
          <DialogDescription>배너 ID: {banner.id}</DialogDescription>
        </DialogHeader>
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
                onChange={e => {
                  setSearchKeyword(e.target.value)
                  setSelectedLecture(null)
                  setShowDropdown(true)
                }}
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
            <Select
              value={formData.type}
              onValueChange={(value: BannerType) => setFormData({ ...formData, type: value })}
            >
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
            <Label htmlFor="image">이미지 (변경 시에만 선택)</Label>
            <Input id="image" type="file" accept="image/*" onChange={handleFileChange} />
            {imageFile ? (
              <div className="text-muted-foreground truncate text-xs">새 이미지: {imageFile.name}</div>
            ) : banner.imageUrl ? (
              <div className="text-muted-foreground truncate text-xs">현재 이미지 유지</div>
            ) : null}
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
            <Button type="button" variant="outline" onClick={onClose}>
              취소
            </Button>
            <Button type="submit" disabled={updateMutation.isPending || !selectedLecture}>
              {updateMutation.isPending ? '수정 중...' : '수정'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
