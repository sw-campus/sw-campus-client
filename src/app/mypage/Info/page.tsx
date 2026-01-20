'use client'

import { useState } from 'react'

import { useRouter } from 'next/navigation'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/Dialog'
import { OrgInfoForm } from '@/features/mypage/components/Organization/OrgInfoForm'
import { PersonalInfoForm } from '@/features/mypage/components/Personal/PersonalForm'
import { useAuthStore } from '@/store/authStore'

export default function OrgInfoPage() {
  const router = useRouter()
  const [open, setOpen] = useState(true)
  const { userType } = useAuthStore()

  const handleOpenChange = (next: boolean) => {
    if (!next) {
      if (userType === 'ADMIN') {
        router.push('/admin')
      } else {
        router.back()
      }
    }
    setOpen(next)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[calc(100%-2rem)] md:max-w-175">
        <DialogHeader className="px-6 pt-6">
          <DialogTitle>{userType === 'ORGANIZATION' ? '기업 정보 수정' : '개인 정보 수정'}</DialogTitle>
        </DialogHeader>
        <div className="max-h-[75vh] overflow-y-auto px-6 pt-4 pb-6">
          <>{userType === 'ORGANIZATION' ? <OrgInfoForm embedded /> : <PersonalInfoForm embedded />}</>
        </div>
      </DialogContent>
    </Dialog>
  )
}
