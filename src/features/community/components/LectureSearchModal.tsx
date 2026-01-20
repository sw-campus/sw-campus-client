'use client'

import { useState, useEffect } from 'react'

import { FiSearch, FiX, FiMapPin, FiCalendar } from 'react-icons/fi'

import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { getLectureSearch } from '@/features/lecture/api/lecture.api'
import type { LectureResponseDto } from '@/features/lecture/types/lecture-response.type'

export interface SelectedLecture {
  id: number
  name: string
  orgName: string
}

interface LectureSearchModalProps {
  isOpen: boolean
  onClose: () => void
  onSelect: (lecture: SelectedLecture) => void
}

/**
 * 강의 검색 모달 컴포넌트
 * 부트캠프 성장일기 카테고리에서 강의를 검색하고 선택할 수 있습니다.
 */
export function LectureSearchModal({ isOpen, onClose, onSelect }: LectureSearchModalProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [lectures, setLectures] = useState<LectureResponseDto[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)

  // 모달이 열릴 때마다 상태 초기화
  useEffect(() => {
    if (isOpen) {
      setSearchQuery('')
      setLectures([])
      setHasSearched(false)
    }
  }, [isOpen])

  // 검색 실행
  const handleSearch = async () => {
    if (!searchQuery.trim()) return

    setIsLoading(true)
    setHasSearched(true)

    try {
      const queryString = `text=${encodeURIComponent(searchQuery.trim())}`
      const result = await getLectureSearch(queryString)
      setLectures(result.content)
    } catch (error) {
      console.error('강의 검색 오류:', error)
      setLectures([])
    } finally {
      setIsLoading(false)
    }
  }

  // Enter 키로 검색
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSearch()
    }
  }

  // 강의 선택
  const handleSelectLecture = (lecture: LectureResponseDto) => {
    onSelect({
      id: lecture.lectureId,
      name: lecture.lectureName,
      orgName: lecture.orgName || '정보 없음',
    })
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="mx-4 max-h-[80vh] w-full max-w-2xl overflow-hidden rounded-xl bg-white shadow-2xl">
        {/* 헤더 */}
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-bold text-gray-900">강의 검색</h2>
          <button onClick={onClose} className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
            <FiX className="h-5 w-5" />
          </button>
        </div>

        {/* 검색 입력 */}
        <div className="border-b border-gray-100 px-6 py-4">
          <div className="flex gap-2">
          <div className="relative flex-1">
              <FiSearch className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400 z-10" />
              <Input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="강의명을 입력하세요"
                className="pl-10 border-gray-300 focus:border-orange-500 focus:ring-orange-200"
                autoFocus
              />
            </div>
            <Button
              onClick={handleSearch}
              disabled={isLoading || !searchQuery.trim()}
              className="bg-orange-500 hover:bg-orange-600"
            >
              {isLoading ? '검색 중...' : '검색'}
            </Button>
          </div>
        </div>

        {/* 검색 결과 */}
        <div className="max-h-[50vh] overflow-y-auto px-6 py-4">
          {isLoading ? (
            <div className="py-12 text-center text-gray-500">검색 중...</div>
          ) : lectures.length > 0 ? (
            <div className="space-y-3">
              {lectures.map(lecture => (
                <button
                  key={lecture.lectureId}
                  onClick={() => handleSelectLecture(lecture)}
                  className="w-full rounded-lg border border-gray-200 p-4 text-left transition-colors hover:border-orange-300 hover:bg-orange-50"
                >
                  <div className="mb-2 font-medium text-gray-900">{lecture.lectureName}</div>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <FiMapPin className="h-3.5 w-3.5" />
                      {lecture.orgName || '정보 없음'}
                    </span>
                    {lecture.categoryName && (
                      <span className="rounded bg-gray-100 px-2 py-0.5 text-xs">{lecture.categoryName}</span>
                    )}
                    {lecture.startAt && lecture.endAt && (
                      <span className="flex items-center gap-1">
                        <FiCalendar className="h-3.5 w-3.5" />
                        {new Date(lecture.startAt).toLocaleDateString()} ~{' '}
                        {new Date(lecture.endAt).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          ) : hasSearched ? (
            <div className="py-12 text-center text-gray-500">
              <p>검색 결과가 없습니다.</p>
              <p className="mt-1 text-sm">다른 키워드로 검색해보세요.</p>
            </div>
          ) : (
            <div className="py-12 text-center text-gray-500">
              <p>강의명을 입력하고 검색해주세요.</p>
              <p className="mt-1 text-sm">수강하신 부트캠프 강의를 선택해주세요.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
