'use client'

import { FiSearch, FiCheck, FiX } from 'react-icons/fi'

import type { SelectedLecture } from './lecture-search-modal'

interface LectureSelectorProps {
  selectedLecture: SelectedLecture | null
  onOpenModal: () => void
  onRemove: () => void
  error?: string | null
}

/**
 * 강의 선택 컴포넌트
 * 부트캠프 성장일기에서 수강 강의를 선택/표시합니다.
 */
export function LectureSelector({ selectedLecture, onOpenModal, onRemove, error }: LectureSelectorProps) {
  return (
    <div id="lecture-selector">
      <label className="mb-2 block text-sm font-medium text-gray-700">
        수강 강의 * <span className="text-xs font-normal text-gray-500">(부트캠프 성장일기 전용)</span>
      </label>

      {selectedLecture ? (
        <div className="rounded-lg border border-green-200 bg-green-50 p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 rounded-full bg-green-500 p-1">
                <FiCheck className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="font-medium text-gray-900">{selectedLecture.name}</p>
                <p className="mt-1 text-sm text-gray-600">훈련기관: {selectedLecture.orgName}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={onRemove}
              className="rounded-full p-1 text-gray-400 hover:bg-gray-200 hover:text-gray-600"
            >
              <FiX className="h-4 w-4" />
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={onOpenModal}
          className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-300 py-4 text-gray-500 transition-colors hover:border-primary hover:text-primary"
        >
          <FiSearch className="h-5 w-5" />
          <span>강의 검색하기</span>
        </button>
      )}

      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}

      <p className="mt-2 text-xs text-gray-500">선택한 강의의 강의명과 훈련기관이 태그에 자동으로 추가됩니다.</p>
    </div>
  )
}
