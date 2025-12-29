'use client'

import { useEffect, useState } from 'react'

import { LuKey, LuPencil, LuUser, LuUserX } from 'react-icons/lu'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { api } from '@/lib/axios'

import { WithdrawResponse } from '../api/member.api'
import { PasswordChangeModal } from './PasswordChangeModal'
import { PasswordVerifyModal } from './PasswordVerifyModal'
import { WithdrawCompleteModal } from './WithdrawCompleteModal'
import { WithdrawModal } from './WithdrawModal'

type ProfileData = {
  email: string
  name: string
  nickname: string
  phone: string
  location: string
  provider: string
  role: string
}

type ProfileCardProps = {
  onEditClick: () => void
}

export function ProfileCard({ onEditClick }: ProfileCardProps) {
  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [loading, setLoading] = useState(true)

  // Modal states
  const [verifyModalOpen, setVerifyModalOpen] = useState(false)
  const [changePasswordOpen, setChangePasswordOpen] = useState(false)
  const [withdrawModalOpen, setWithdrawModalOpen] = useState(false)
  const [withdrawCompleteOpen, setWithdrawCompleteOpen] = useState(false)
  const [withdrawProviders, setWithdrawProviders] = useState<string[]>([])

  useEffect(() => {
    let mounted = true
    const loadProfile = async () => {
      try {
        setLoading(true)
        const res = await api.get<ProfileData>('/mypage/profile')
        if (mounted) setProfile(res.data)
      } catch {
        // ignore
      } finally {
        if (mounted) setLoading(false)
      }
    }
    loadProfile()
    return () => {
      mounted = false
    }
  }, [])

  const handleEditClick = () => {
    // OAuth 사용자는 비밀번호 검증 없이 바로 진행
    if (profile?.provider && profile.provider !== 'LOCAL') {
      onEditClick()
      return
    }
    setVerifyModalOpen(true)
  }

  const handleWithdrawSuccess = (response: WithdrawResponse) => {
    setWithdrawModalOpen(false)
    setWithdrawProviders(response.oauthProviders)
    setWithdrawCompleteOpen(true)
  }

  // OAuth 사용자인지 체크
  const isSocialUser = profile?.provider && profile.provider !== 'LOCAL'
  // 일반 사용자(USER) 및 기관 회원(ORGANIZATION)은 탈퇴 가능 (ADMIN만 제외)
  const canWithdraw = profile?.role === 'USER' || profile?.role === 'ORGANIZATION'

  return (
    <>
      <Card className="bg-card h-full">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div className="flex items-center gap-2">
            <div className="bg-primary/10 text-primary flex h-8 w-8 items-center justify-center rounded-full">
              <LuUser className="h-4 w-4" />
            </div>
            <CardTitle className="text-foreground text-lg">내 프로필</CardTitle>
          </div>
          <div className="flex items-center gap-1">
            {/* 비밀번호 변경 버튼 - OAuth 사용자에게는 표시하지 않음 */}
            {!isSocialUser && (
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-foreground h-8 gap-1.5"
                onClick={() => setChangePasswordOpen(true)}
              >
                <LuKey className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">비밀번호</span>
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-foreground h-8 gap-1.5"
              onClick={handleEditClick}
            >
              <LuPencil className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">프로필 수정</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 pt-4">
          {loading ? (
            <div className="flex h-32 items-center justify-center">
              <span className="text-muted-foreground text-sm">불러오는 중...</span>
            </div>
          ) : profile ? (
            <div className="grid gap-3">
              <ProfileRow label="이름" value={profile.name || '-'} />
              <ProfileRow label="이메일" value={profile.email || '-'} />
              <ProfileRow label="닉네임" value={profile.nickname || '-'} />
              <ProfileRow label="연락처" value={profile.phone || '-'} />
              <ProfileRow label="주소" value={profile.location || '-'} />
            </div>
          ) : (
            <div className="flex h-32 items-center justify-center">
              <span className="text-muted-foreground text-sm">프로필 정보를 불러올 수 없습니다.</span>
            </div>
          )}

          {/* 회원 탈퇴 버튼 */}
          {canWithdraw && (
            <div className="border-border border-t pt-4">
              <Button
                variant="ghost"
                size="sm"
                className="text-destructive hover:text-destructive hover:bg-destructive/10 h-8 gap-1.5"
                onClick={() => setWithdrawModalOpen(true)}
              >
                <LuUserX className="h-3.5 w-3.5" />
                회원 탈퇴
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

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
      />

      {/* Withdraw Complete Modal */}
      <WithdrawCompleteModal open={withdrawCompleteOpen} oauthProviders={withdrawProviders} />
    </>
  )
}

function ProfileRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <span className="text-muted-foreground w-16 shrink-0 text-sm">{label}</span>
      <span className="text-foreground text-sm font-medium break-all">{value}</span>
    </div>
  )
}
