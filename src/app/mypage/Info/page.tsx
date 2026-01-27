'use client'

import { useRouter } from 'next/navigation'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { OrgInfoForm } from '@/features/mypage/components/Organization/org-info-form'
import { PersonalInfoForm } from '@/features/mypage/components/Personal/personal-form'
import { useAuthStore } from '@/store/auth-store'

export default function OrgInfoPage() {
  const router = useRouter()
  const { userType } = useAuthStore()

  const handleClose = () => {
    if (userType === 'ADMIN') {
      router.push('/admin')
    } else {
      router.back()
    }
  }

  return (
    <Dialog open onOpenChange={(open) => !open && handleClose()}>
      {/* 모바일: 전체 화면 시트 / 데스크톱: 중앙 모달 */}
      <DialogContent
        onOpenAutoFocus={(e) => e.preventDefault()}
        className="
          !flex !flex-col
          !inset-0 !max-h-full !max-w-full !translate-x-0 !translate-y-0 !rounded-none
          sm:!inset-auto sm:!top-1/2 sm:!left-1/2 sm:!-translate-x-1/2 sm:!-translate-y-1/2
          sm:!max-h-[85vh] sm:!max-w-[calc(100%-2rem)] sm:!rounded-lg
          md:!max-w-175
        "
      >
        <DialogHeader className="shrink-0 border-b px-4 py-4 sm:border-none sm:px-6 sm:pt-6 sm:pb-0">
          <DialogTitle>{userType === 'ORGANIZATION' ? '기업 정보 수정' : '개인 정보 수정'}</DialogTitle>
        </DialogHeader>
        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:px-6 sm:pt-4 sm:pb-6">
          <>
            {userType === 'ORGANIZATION' ? (
              <OrgInfoForm embedded onSuccess={handleClose} />
            ) : (
              <PersonalInfoForm embedded onSuccess={handleClose} />
            )}
          </>
        </div>
      </DialogContent>
    </Dialog>
  )
}
