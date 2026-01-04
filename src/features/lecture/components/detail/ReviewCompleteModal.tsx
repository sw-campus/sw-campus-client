'use client'

import Modal from '@/components/ui/Modal'
import { Button } from '@/components/ui/button'

interface ReviewCompleteModalProps {
  isOpen: boolean
  onClose: () => void
}

export function ReviewCompleteModal({ isOpen, onClose }: ReviewCompleteModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="리뷰 등록 완료" maxWidthClass="max-w-lg">
      <div className="flex items-center justify-center rounded-2xl border border-gray-200 bg-white p-8 text-center">
        <div className="space-y-3">
          <div className="mx-auto h-16 w-16 rounded-full border border-gray-200 p-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              className="h-full w-full text-green-600"
            >
              <path d="M20 6L9 17l-5-5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <p className="text-lg font-semibold">리뷰가 정상적으로 등록되었습니다.</p>
          <p className="text-muted-foreground text-sm">관리자 확인 후 게시될 예정입니다.</p>
          <div className="pt-2">
            <Button className="rounded-full" onClick={onClose}>
              닫기
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  )
}
