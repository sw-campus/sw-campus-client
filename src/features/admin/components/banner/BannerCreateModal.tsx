'use client'

import { useRef, useState } from 'react'

import { useQuery } from '@tanstack/react-query'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { getLectureSearch } from '@/features/lecture/api/lecture.api'
import { useDebounce } from '@/hooks/useDebounce'

import { useCreateBannerMutation } from '../../hooks/useBanners'
import type { BannerType, CreateBannerRequest } from '../../types/banner.type'
import { BANNER_TYPE_LABEL } from '../../types/banner.type'

interface BannerCreateModalProps {
  trigger?: React.ReactNode
}

export function BannerCreateModal({ trigger }: BannerCreateModalProps) {
  const [open, setOpen] = useState(false)
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

  // 강의 검색 쿼리
  const { data: lectureData, isLoading: isSearching } = useQuery({
    queryKey: ['lectures', 'search', debouncedKeyword],
    queryFn: () => getLectureSearch(`text=${encodeURIComponent(debouncedKeyword)}&size=10`),
    enabled: debouncedKeyword.length >= 2,
  })

  const createMutation = useCreateBannerMutation()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedLecture || !formData.startDate || !formData.endDate) {
      return
    }

    // 날짜를 OffsetDateTime 형식으로 변환 (시작일은 00:00:00, 종료일은 23:59:59)
    const startDateISO = `${formData.startDate}T00:00:00+09:00`
    const endDateISO = `${formData.endDate}T23:59:59+09:00`

    createMutation.mutate(
      {
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
          setOpen(false)
          setImageFile(null)
          setSelectedLecture(null)
          setSearchKeyword('')
          setFormData({
            type: 'BIG',
            url: '',
            startDate: '',
            endDate: '',
          })
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

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger ?? <Button>배너 등록</Button>}</DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>새 배너 등록</DialogTitle>
          <DialogDescription>새로운 배너를 등록합니다.</DialogDescription>
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
            <Label htmlFor="image">이미지 *</Label>
            <Input id="image" type="file" accept="image/*" onChange={handleFileChange} required />
            {imageFile && <div className="text-muted-foreground truncate text-xs">선택: {imageFile.name}</div>}
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
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              취소
            </Button>
            <Button type="submit" disabled={createMutation.isPending || !selectedLecture}>
              {createMutation.isPending ? '등록 중...' : '등록'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
