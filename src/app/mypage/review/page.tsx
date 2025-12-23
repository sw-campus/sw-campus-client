'use client'

import { useState } from 'react'

import { useRouter } from 'next/navigation'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { ReviewForm } from '@/features/mypage/components/review/ReviewForm'

export default function ReviewCreatePage() {
  const router = useRouter()
  const [open, setOpen] = useState(true)

  const handleOpenChange = (next: boolean) => {
    if (!next) router.back()
    setOpen(next)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader className="px-6 pt-3">
          <DialogTitle>후기 작성</DialogTitle>
        </DialogHeader>

        <div className="max-h-[34vh] overflow-y-auto overscroll-contain px-6 pb-4 md:max-h-[30vh]">
          <ReviewForm embedded />
        </div>
      </DialogContent>
    </Dialog>
  )
}
