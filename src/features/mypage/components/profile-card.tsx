'use client'

import { useState } from 'react'

import { useQuery } from '@tanstack/react-query'
import { User, Key, Pencil, UserX } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { type WithdrawResponse } from '@/features/mypage/api/member.api'
import { api } from '@/lib/axios'

import { PasswordChangeModal } from './password-change-modal'
import { PasswordVerifyModal } from './password-verify-modal'
import { WithdrawCompleteModal } from './withdraw-complete-modal'
import { WithdrawModal } from './withdraw-modal'

type ProfileData = {
  email: string
  name: string
  nickname: string
  phone: string
  location: string
  provider: string
  role: string
}

export const PROFILE_QUERY_KEY = ['mypage', 'profile'] as const

type ProfileCardProps = {
  onEditClick: () => void
}

export function ProfileCard({ onEditClick }: ProfileCardProps) {
  const { data: profile, isLoading: loading } = useQuery({
    queryKey: PROFILE_QUERY_KEY,
    queryFn: async () => {
      const res = await api.get<ProfileData>('/mypage/profile')
      return res.data
    },
  })

  // Modal states
  const [verifyModalOpen, setVerifyModalOpen] = useState(false)
  const [changePasswordOpen, setChangePasswordOpen] = useState(false)
  const [withdrawModalOpen, setWithdrawModalOpen] = useState(false)
  const [withdrawCompleteOpen, setWithdrawCompleteOpen] = useState(false)
  const [withdrawProviders, setWithdrawProviders] = useState<string[]>([])

  const handleEditClick = () => {
    // OAuth 사용자는 비밀번호 검증 없이 바로 진행
    if (profile?.provider && profile.provider !== 'LOCAL') {
      onEditClick()
      return
    }
    setVerifyModalOpen(true)
  }

  // OAuth 사용자인지 체크
  const isSocialUser = profile?.provider && profile.provider !== 'LOCAL'
  // 일반 사용자(USER) 및 기관 회원(ORGANIZATION)은 탈퇴 가능 (ADMIN만 제외)
  const canWithdraw = profile?.role === 'USER' || profile?.role === 'ORGANIZATION'

  const handleWithdrawSuccess = (response: WithdrawResponse) => {
    setWithdrawModalOpen(false)
    setWithdrawProviders(response.oauthProviders)
    setWithdrawCompleteOpen(true)
  }

  return (
    <>
      {/* 공통 레이아웃 */}
      <div className="p-4 sm:p-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-4">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-[#FEB706]" />
            <span className="text-base font-semibold text-[#020202]">내 정보</span>
          </div>
          <div className="flex items-center gap-2">
            {!isSocialUser && (
              <button
                className="h-8 px-3 text-xs sm:text-sm text-[#555555] hover:text-[#020202] hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-1.5"
                onClick={() => setChangePasswordOpen(true)}
              >
                <Key className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">비밀번호</span>
              </button>
            )}
            {canWithdraw && (
              <button
                className="h-8 w-8 text-red-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors flex items-center justify-center"
                onClick={() => setWithdrawModalOpen(true)}
                title="회원 탈퇴"
              >
                <UserX className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex h-24 items-center justify-center">
            <span className="text-sm text-[#888888]">불러오는 중...</span>
          </div>
        ) : profile ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <ProfileRowNew label="이름" value={profile.name || '-'} />
            <ProfileRowNew label="이메일" value={profile.email || '-'} />
            <ProfileRowNew label="닉네임" value={profile.nickname || '-'} />
            <ProfileRowNew label="연락처" value={profile.phone || '-'} />
            <ProfileRowNew label="주소" value={profile.location || '-'} className="sm:col-span-2" />
          </div>
        ) : (
          <div className="flex h-24 items-center justify-center">
            <span className="text-sm text-[#888888]">프로필 정보를 불러올 수 없습니다.</span>
          </div>
        )}
      </div>

      {/* Password Verification Modal */}
      <PasswordVerifyModal open={verifyModalOpen} onOpenChange={setVerifyModalOpen} onVerified={onEditClick} />

      {/* Password Change Modal */}
      <PasswordChangeModal open={changePasswordOpen} onOpenChange={setChangePasswordOpen} />

      {/* Withdraw Confirmation Modal */}
      <WithdrawModal
        open={withdrawModalOpen}
        onOpenChange={setWithdrawModalOpen}
        onSuccess={handleWithdrawSuccess}
        isOrganization={profile?.role === 'ORGANIZATION'}
        isSocialUser={!!isSocialUser}
      />

      {/* Withdraw Complete Modal */}
      <WithdrawCompleteModal open={withdrawCompleteOpen} oauthProviders={withdrawProviders} />
    </>
  )
}

function ProfileRowNew({ label, value, className = '' }: { label: string; value: string; className?: string }) {
  return (
    <div className={`flex items-center gap-4 py-2 px-3 bg-gray-50 rounded-lg ${className}`}>
      <span className="text-xs sm:text-sm text-[#888888] w-14 sm:w-16 shrink-0">{label}</span>
      <span className="text-sm sm:text-base text-[#020202] break-all">{value}</span>
    </div>
  )
}
