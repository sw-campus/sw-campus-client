'use client'

import { useState } from 'react'

import { useRouter } from 'next/navigation'

import OrganizationAside from '@/features/mypage/components/Organization/OrganizationAside'
import OrganizationMain from '@/features/mypage/components/Organization/OrganizationMain'
import { useAuthStore } from '@/store/authStore'

export default function MyPage() {
  const router = useRouter()
  const { isLoggedIn, userName, userType, logout } = useAuthStore()

  // 디버깅용: userType 확인
  console.log('[mypage/organization] userType:', userType)
  console.log('[mypage/organization] userType:', isLoggedIn)

  // 기관 마이페이지
  if (userType === 'ORGANIZATION') {
    const [isOrgPasswordOpen, setIsOrgPasswordOpen] = useState(false)

    const handleOpenOrgInfo = () => {
      setIsOrgPasswordOpen(true)
    }

    const handleOpenLectureManage = () => {
      setIsOrgPasswordOpen(false)
    }

    const openInfoModal = () => {
      router.push('/mypage/organization/info')
    }

    const openProductModal = () => {
      router.push('/mypage/organization/lectures/new')
    }

    return (
      <div className="custom-container">
        <div className="custom-card">
          <div className="relative z-10 flex w-full gap-6">
            <OrganizationAside onClickOrgInfo={handleOpenOrgInfo} onClickLectureManage={handleOpenLectureManage} />
            <OrganizationMain
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
