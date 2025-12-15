'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { Button } from '@/components/ui/button'

import OrganizationAside from '@/features/mypage/components/Organization/OrganizationAside'
import OrganizationMain from '@/features/mypage/components/Organization/OrganizationMain'

export default function MyPage() {
  const router = useRouter()

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
