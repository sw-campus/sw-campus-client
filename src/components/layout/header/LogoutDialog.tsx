'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => Promise<void> | void
  confirmDisabled?: boolean
}

export function LogoutDialog({ open, onOpenChange, onConfirm, confirmDisabled }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader className="gap-5">
          <DialogTitle>로그아웃</DialogTitle>
          <DialogDescription>장바구니에 있는 항목은 7일간 유지됩니다.</DialogDescription>
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
