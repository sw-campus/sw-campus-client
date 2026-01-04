'use client'

import { useState } from 'react'

import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { requestTemporaryPassword } from '@/features/auth/authApi'

type FindPasswordModalProps = {
  isOpen: boolean
  onClose: () => void
}

export function FindPasswordModal({ isOpen, onClose }: FindPasswordModalProps) {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async () => {
    try {
      setIsLoading(true)
      setError(null)

      if (!name.trim()) {
        setError('이름을 입력해주세요.')
        return
      }
      if (!phone.trim()) {
        setError('전화번호를 입력해주세요.')
        return
      }
      if (!email.trim()) {
        setError('이메일을 입력해주세요.')
        return
      }

      // 전화번호 형식 검증 (숫자만 11자리)
      const phoneDigits = phone.replace(/\D/g, '')
      if (phoneDigits.length !== 11) {
        setError('전화번호는 11자리 숫자여야 합니다.')
        return
      }

      await requestTemporaryPassword({ name: name.trim(), phone: phoneDigits, email: email.trim() })
      toast.success('임시 비밀번호가 이메일로 발송되었습니다.')
      resetForm()
      onClose()
    } catch (err: unknown) {
      // 서버에서 받은 에러 메시지 표시
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosError = err as { response?: { data?: { message?: string } } }
        const message = axiosError.response?.data?.message || '임시 비밀번호 발송에 실패했습니다.'
        setError(message)
      } else {
        setError('임시 비밀번호 발송에 실패했습니다.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setName('')
    setPhone('')
    setEmail('')
    setError(null)
  }

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      resetForm()
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-foreground text-lg font-semibold">비밀번호 찾기</DialogTitle>
        </DialogHeader>
        <p className="text-muted-foreground text-sm">
          가입 시 입력한 이름, 전화번호, 이메일을 입력하세요.
          <br />
          일치하면 임시 비밀번호를 이메일로 발송합니다.
        </p>
        <div className="space-y-4 pt-2">
          <div>
            <label className="text-foreground mb-1 block text-sm font-medium">이름</label>
            <input
              type="text"
              placeholder="홍길동"
              className="border-input bg-background text-foreground placeholder:text-muted-foreground focus:ring-ring h-10 w-full rounded-md border px-3 text-sm focus:ring-2 focus:outline-none"
              value={name}
              onChange={e => {
                setName(e.target.value)
                if (error) setError(null)
              }}
            />
          </div>
          <div>
            <label className="text-foreground mb-1 block text-sm font-medium">전화번호</label>
            <input
              type="tel"
              placeholder="01012345678"
              className="border-input bg-background text-foreground placeholder:text-muted-foreground focus:ring-ring h-10 w-full rounded-md border px-3 text-sm focus:ring-2 focus:outline-none"
              value={phone}
              onChange={e => {
                setPhone(e.target.value)
                if (error) setError(null)
              }}
            />
          </div>
          <div>
            <label className="text-foreground mb-1 block text-sm font-medium">이메일</label>
            <input
              type="email"
              placeholder="email@example.com"
              className="border-input bg-background text-foreground placeholder:text-muted-foreground focus:ring-ring h-10 w-full rounded-md border px-3 text-sm focus:ring-2 focus:outline-none"
              value={email}
              onChange={e => {
                setEmail(e.target.value)
                if (error) setError(null)
              }}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  void handleSubmit()
                }
              }}
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <Button
            onClick={() => void handleSubmit()}
            disabled={isLoading || !name || !phone || !email}
            className="w-full"
          >
            {isLoading ? '발송 중...' : '임시 비밀번호 발송'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
