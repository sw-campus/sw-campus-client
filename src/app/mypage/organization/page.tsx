'use client'

import { useState } from 'react'

import { useRouter } from 'next/navigation'

import OrganizationAside from '@/features/mypage/components/Organization/OrganizationAside'
import OrganizationMain from '@/features/mypage/components/Organization/OrganizationMain'
import { useAuthStore } from '@/store/authStore'

export default function MyPage() {
  const router = useRouter()
  const { userType } = useAuthStore()
  const [isOrgPasswordOpen, setIsOrgPasswordOpen] = useState(true)
  const [activeTab, setActiveTab] = useState<'orgInfo' | 'lectureManage' | 'myInfo'>('orgInfo')

  // 기관 마이페이지
  if (userType === 'ORGANIZATION') {
    const handleOpenOrgInfo = () => {
      setActiveTab('orgInfo')
    }

    const handleOpenLectureManage = () => {
      setActiveTab('lectureManage')
    }

    const handleOpenMyInfo = () => {
      setActiveTab('myInfo')
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
          <div className="relative z-10 flex w-full flex-col gap-4 lg:flex-row lg:gap-6">
            <OrganizationAside
              active={activeTab}
              onClickOrgInfo={handleOpenOrgInfo}
              onClickLectureManage={handleOpenLectureManage}
              onClickMyInfo={handleOpenMyInfo}
            />
            <OrganizationMain
              activeTab={activeTab}
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
