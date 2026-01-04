'use client'

import { useEffect, useState } from 'react'

import { useRouter } from 'next/navigation'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { PersonalInfoForm } from '@/features/mypage/components/Personal/PersonalForm'

export default function AdminInfoModal() {
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
          <DialogTitle>관리자 정보 수정</DialogTitle>
        </DialogHeader>
        <div className="max-h-[75vh] overflow-y-auto px-6 pt-4 pb-6">
          <PersonalInfoForm embedded />
        </div>
      </DialogContent>
    </Dialog>
  )
}
