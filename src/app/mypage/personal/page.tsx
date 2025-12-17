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
}
