'use client'

import { useState } from 'react'

import { LuTriangleAlert, LuLoader } from 'react-icons/lu'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import { withdrawMember, WithdrawResponse } from '../api/member.api'

type WithdrawModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: (response: WithdrawResponse) => void
  isOrganization?: boolean
  isSocialUser?: boolean
}

export function WithdrawModal({ open, onOpenChange, onSuccess, isOrganization, isSocialUser }: WithdrawModalProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [password, setPassword] = useState('')

  const handleWithdraw = async () => {
    // 일반 사용자는 비밀번호 필수
    if (!isSocialUser && !password.trim()) {
      setError('비밀번호를 입력해주세요.')
      return
    }

    try {
      setLoading(true)
      setError(null)
      const response = await withdrawMember(isSocialUser ? '' : password)
      onSuccess(response)
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : '탈퇴 처리 중 오류가 발생했습니다.'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setPassword('')
      setError(null)
    }
    onOpenChange(open)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-destructive flex items-center gap-2">
            <LuTriangleAlert className="h-5 w-5" />
            회원 탈퇴
          </DialogTitle>
          <DialogDescription className="pt-2 text-left">
            정말 탈퇴하시겠습니까?
            <br />
            {isOrganization ? (
              <span className="text-muted-foreground">
                기관 정보와 등록된 강의는 유지되며, 새로운 담당자가 인수할 수 있습니다.
              </span>
            ) : (
              <span className="text-destructive font-medium">탈퇴 시 모든 데이터가 삭제되며 복구할 수 없습니다.</span>
            )}
          </DialogDescription>
        </DialogHeader>

        {/* 일반 사용자만 비밀번호 입력 */}
        {!isSocialUser && (
          <div className="space-y-2">
            <Label htmlFor="withdraw-password">비밀번호 확인</Label>
            <Input
              id="withdraw-password"
              type="password"
              placeholder="비밀번호를 입력하세요"
              value={password}
              onChange={e => setPassword(e.target.value)}
              disabled={loading}
            />
          </div>
        )}

        {error && <div className="bg-destructive/10 text-destructive rounded-md p-3 text-sm">{error}</div>}

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => handleOpenChange(false)} disabled={loading}>
            취소
          </Button>
          <Button variant="destructive" onClick={handleWithdraw} disabled={loading}>
            {loading ? (
              <>
                <LuLoader className="mr-2 h-4 w-4 animate-spin" />
                처리 중...
              </>
            ) : (
              '탈퇴하기'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
