'use client'

import { useEffect, useState } from 'react'

import { useRouter } from 'next/navigation'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { LectureCreateForm } from '@/features/lecture/components/lecture-create/LectureCreateForm'

export default function LectureCreatePage() {
  const router = useRouter()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    setOpen(true)
  }, [])

  const handleOpenChange = (next: boolean) => {
    if (!next) router.back()
    setOpen(next)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[calc(100%-2rem)] md:max-w-175">
        <DialogHeader className="px-6 pt-6">
          <DialogTitle>교육과정 등록</DialogTitle>
        </DialogHeader>

        <div className="max-h-[75vh] overflow-y-auto px-6 pb-6">
          <LectureCreateForm />
        </div>
      </DialogContent>
    </Dialog>
  )
}
