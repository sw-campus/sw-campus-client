'use client'

import { CheckCircle2, Clock, Sparkles, Target } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface AptitudeContinueModalProps {
  open: boolean
  onContinue: () => void
  onLater: () => void
}

export function AptitudeContinueModal({
  open,
  onContinue,
  onLater,
}: AptitudeContinueModalProps) {
  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onLater()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <CheckCircle2 className="h-8 w-8 text-green-600" />
          </div>
          <DialogTitle className="text-xl">기초 설문이 완료되었습니다!</DialogTitle>
          <DialogDescription className="text-base">
            성향 테스트를 통해 더 정확한 맞춤 추천을 받아보세요
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 space-y-3">
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
            <h4 className="mb-3 font-medium text-amber-800">
              성향 테스트 완료 시 혜택
            </h4>
            <ul className="space-y-2 text-sm text-amber-700">
              <li className="flex items-center gap-2">
                <Target className="h-4 w-4 flex-shrink-0" />
                <span>나에게 맞는 직무 추천 (프론트엔드/백엔드/데이터)</span>
              </li>
              <li className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 flex-shrink-0" />
                <span>AI 정밀 추천 기능 활성화</span>
              </li>
              <li className="flex items-center gap-2">
                <Clock className="h-4 w-4 flex-shrink-0" />
                <span>소요 시간: 약 1분</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <Button
            variant="outline"
            className="flex-1"
            onClick={onLater}
          >
            나중에 하기
          </Button>
          <Button
            className="flex-1 bg-amber-500 hover:bg-amber-600"
            onClick={onContinue}
          >
            성향 테스트 시작
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
