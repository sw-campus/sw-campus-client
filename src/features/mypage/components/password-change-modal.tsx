'use client'

import { useState } from 'react'

import { isAxiosError } from 'axios'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { api } from '@/lib/axios'

type PasswordChangeModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function PasswordChangeModal({ open, onOpenChange }: PasswordChangeModalProps) {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [changing, setChanging] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const resetForm = () => {
    setCurrentPassword('')
    setNewPassword('')
    setConfirmPassword('')
    setError(null)
  }

  const handleChange = async () => {
    try {
      setChanging(true)
      setError(null)

      // Validation
      if (!currentPassword.trim()) {
        setError('현재 비밀번호를 입력해주세요.')
        return
      }
      if (!newPassword.trim()) {
        setError('새 비밀번호를 입력해주세요.')
        return
      }
      if (newPassword.length < 8) {
        setError('새 비밀번호는 8자 이상이어야 합니다.')
        return
      }
      if (newPassword !== confirmPassword) {
        setError('새 비밀번호가 일치하지 않습니다.')
        return
      }

      await api.patch('/auth/password', {
        currentPassword: currentPassword.trim(),
        newPassword: newPassword.trim(),
      })

      toast.success('비밀번호가 변경되었습니다.')
      resetForm()
      onOpenChange(false)
    } catch (err: unknown) {
      if (isAxiosError(err)) {
        const status = err.response?.status
        if (status === 400) {
          setError('현재 비밀번호가 일치하지 않습니다.')
        } else {
          setError('비밀번호 변경에 실패했습니다.')
        }
      } else {
        setError('비밀번호 변경에 실패했습니다.')
      }
    } finally {
      setChanging(false)
    }
  }

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      resetForm()
    }
    onOpenChange(isOpen)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-foreground text-lg font-semibold">비밀번호 변경</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-2">
          <div>
            <label className="text-foreground mb-1 block text-sm font-medium">현재 비밀번호</label>
            <input
              type="password"
              placeholder="현재 비밀번호"
              className="border-input bg-background text-foreground placeholder:text-muted-foreground focus:ring-ring h-10 w-full rounded-md border px-3 text-sm focus:ring-2 focus:outline-none"
              value={currentPassword}
              onChange={e => {
                setCurrentPassword(e.target.value)
                if (error) setError(null)
              }}
            />
          </div>
          <div>
            <label className="text-foreground mb-1 block text-sm font-medium">새 비밀번호</label>
            <input
              type="password"
              placeholder="새 비밀번호 (8자 이상)"
              className="border-input bg-background text-foreground placeholder:text-muted-foreground focus:ring-ring h-10 w-full rounded-md border px-3 text-sm focus:ring-2 focus:outline-none"
              value={newPassword}
              onChange={e => {
                setNewPassword(e.target.value)
                if (error) setError(null)
              }}
            />
          </div>
          <div>
            <label className="text-foreground mb-1 block text-sm font-medium">새 비밀번호 확인</label>
            <input
              type="password"
              placeholder="새 비밀번호 확인"
              className="border-input bg-background text-foreground placeholder:text-muted-foreground focus:ring-ring h-10 w-full rounded-md border px-3 text-sm focus:ring-2 focus:outline-none"
              value={confirmPassword}
              onChange={e => {
                setConfirmPassword(e.target.value)
                if (error) setError(null)
              }}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  void handleChange()
                }
              }}
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <Button
            onClick={() => void handleChange()}
            disabled={changing || !currentPassword || !newPassword || !confirmPassword}
            className="w-full"
          >
            {changing ? '변경 중...' : '비밀번호 변경'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
