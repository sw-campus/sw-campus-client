'use client'

import { Button } from '@/components/ui/Button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/Dialog'

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => Promise<void> | void
  confirmDisabled?: boolean
  hasCartItems?: boolean
}

export function LogoutDialog({ open, onOpenChange, onConfirm, confirmDisabled, hasCartItems }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader className="gap-5">
          <DialogTitle>로그아웃</DialogTitle>
          <DialogDescription>
            {hasCartItems ? 'AI 심층 비교에 있는 항목은 7일간 유지됩니다.' : '로그아웃 하시겠습니까?'}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            취소
          </Button>
          <Button
            type="button"
            onClick={async () => {
              await onConfirm()
              onOpenChange(false)
            }}
            disabled={confirmDisabled}
          >
            확인
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
