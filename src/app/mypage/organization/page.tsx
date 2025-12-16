'use client'

import { useState } from 'react'

import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import OrganizationAside from '@/features/mypage/components/Organization/OrganizationAside'
import OrganizationMain from '@/features/mypage/components/Organization/OrganizationMain'
import PersonalAside from '@/features/mypage/components/Personal/PersonalAside'
import PersonalMain from '@/features/mypage/components/Personal/PersonalMain'
import { useSignupStore } from '@/store/signupStore'

export default function MyPage() {
  const router = useRouter()
  const userType = useSignupStore(state => state.userType)

  // 기관 마이페이지
  if (userType === 'organization') {
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

  // 개인 마이페이지 (간단 예시)
  if (userType === 'personal') {
    return (
      <div className="custom-container">
        <div className="custom-card">
          <div className="relative z-10 flex w-full gap-6">
            <aside className="w-52 self-start rounded-md bg-white/90 p-5 text-neutral-900">
              <h2 className="mb-4 text-2xl font-semibold">마이페이지</h2>
              <nav className="space-y-2 leading-relaxed">
                <button className="block w-full text-left font-medium text-neutral-900 hover:underline">
                  회원정보 수정
                </button>
                <button className="block w-full text-left text-neutral-700 hover:underline">찜한 강의</button>
                <button className="block w-full text-left text-neutral-700 hover:underline">내가 쓴 리뷰</button>
              </nav>
            </aside>
            <div className="flex-4 rounded-3xl bg-neutral-600/80">
              {/* TODO: 회원정보 / 찜한 강의 / 리뷰 내용 들어갈 자리 */}
            </div>
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
