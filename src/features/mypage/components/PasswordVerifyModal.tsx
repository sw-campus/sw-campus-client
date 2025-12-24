'use client'

import { useState } from 'react'

import { isAxiosError } from 'axios'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { api } from '@/lib/axios'

type PasswordVerifyModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onVerified: () => void
}

export function PasswordVerifyModal({ open, onOpenChange, onVerified }: PasswordVerifyModalProps) {
  const [passwordInput, setPasswordInput] = useState('')
  const [verifying, setVerifying] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleVerify = async () => {
    try {
      setVerifying(true)
      setError(null)

      const password = passwordInput.trim()
      const { data } = await api.post<unknown>('/mypage/verify-password', { password })

      const verified =
        typeof data === 'boolean'
          ? data
          : typeof (data as { verified?: unknown })?.verified === 'boolean'
            ? Boolean((data as { verified?: unknown }).verified)
            : typeof (data as { isValid?: unknown })?.isValid === 'boolean'
              ? Boolean((data as { isValid?: unknown }).isValid)
              : typeof (data as { success?: unknown })?.success === 'boolean'
                ? Boolean((data as { success?: unknown }).success)
                : typeof (data as { result?: unknown })?.result === 'boolean'
                  ? Boolean((data as { result?: unknown }).result)
                  : false

      if (!verified) {
        setError('비밀번호가 일치하지 않습니다.')
        return
      }

      onOpenChange(false)
      onVerified()
    } catch (err: unknown) {
      if (isAxiosError(err)) {
        setError('비밀번호 검증에 실패했습니다.')
      } else {
        setError('비밀번호 검증에 실패했습니다.')
      }
    } finally {
      setPasswordInput('')
      setVerifying(false)
    }
  }

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setPasswordInput('')
      setError(null)
    }
    onOpenChange(isOpen)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-foreground text-lg font-semibold">비밀번호 확인</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-2">
          <p className="text-muted-foreground text-sm">개인 정보 수정을 위해 비밀번호를 입력해주세요.</p>
          <input
            type="password"
            placeholder="비밀번호 입력"
            className="border-input bg-background text-foreground placeholder:text-muted-foreground focus:ring-ring h-10 w-full rounded-md border px-3 text-sm focus:ring-2 focus:outline-none"
            value={passwordInput}
            onChange={e => {
              setPasswordInput(e.target.value)
              if (error) setError(null)
            }}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                e.preventDefault()
                void handleVerify()
              }
            }}
          />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <Button
            onClick={() => void handleVerify()}
            disabled={verifying || passwordInput.trim().length === 0}
            className="w-full"
          >
            {verifying ? '확인 중...' : '확인'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
