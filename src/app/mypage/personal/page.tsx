'use client'

import { useState } from 'react'

import { useRouter } from 'next/navigation'

import PersonalAside from '@/features/mypage/components/Personal/PersonalAside'
import PersonalMain from '@/features/mypage/components/Personal/PersonalMain'
import { useAuthStore } from '@/store/authStore'

export default function MyPage() {
  const [isOrgPasswordOpen, setIsOrgPasswordOpen] = useState(false)
  const router = useRouter()
  const { isLoggedIn, userName, userType, logout } = useAuthStore()

  if (userType === 'PERSONAL') {
    const handleOpenOrgInfo = () => {
      setIsOrgPasswordOpen(true)
    }

    const handleOpenLectureManage = () => {
      setIsOrgPasswordOpen(false)
    }

    const openInfoModal = () => {
      router.push('/mypage/personal/info')
    }

    const openProductModal = () => {
      router.push('/mypage/personal/survey')
    }

    return (
      <div className="custom-container">
        <div className="custom-card">
          {/* 실제 내용 영역 */}
          <div className="relative z-10 flex w-full gap-6">
            <PersonalAside onClickOrgInfo={handleOpenOrgInfo} onClickLectureManage={handleOpenLectureManage} />
            <PersonalMain
              isOrgPasswordOpen={isOrgPasswordOpen}
              openInfoModal={openInfoModal}
              onOpenProductModal={openProductModal}
            />
          </div>
        </div>
      </div>
    )
  }

  // userType이 null이거나 알 수 없을 때
  return (
    <div className="flex h-96 items-center justify-center">
      <span className="text-lg text-neutral-500">로그인 후 이용 가능합니다.</span>
    </div>
  )
}
