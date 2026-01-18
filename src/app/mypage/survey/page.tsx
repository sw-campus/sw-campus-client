'use client'

import { useState } from 'react'

import { useRouter } from 'next/navigation'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { SurveyContainer } from '@/features/mypage/components/survey/SurveyContainer'

export default function SurveyCreatePage() {
  const router = useRouter()
  const [open, setOpen] = useState(true)

  const handleOpenChange = (next: boolean) => {
    if (!next) router.back()
    setOpen(next)
  }

  const handleComplete = () => {
    router.back()
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[calc(100%-2rem)] md:max-w-[800px]">
        <DialogHeader className="px-6 pt-6">
          <DialogTitle>설문조사</DialogTitle>
        </DialogHeader>

        <div className="max-h-[75vh] overflow-y-auto px-6 pb-6">
          <SurveyContainer embedded onComplete={handleComplete} />
        </div>
      </DialogContent>
    </Dialog>
  )
}
