'use client'

import { useState } from 'react'

import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { requestTemporaryPassword } from '@/features/auth/auth-api'

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
      <DialogContent className="w-[calc(100%-2rem)] max-w-sm gap-0 rounded-2xl p-8">
        <DialogHeader className="mb-6">
          <DialogTitle className="text-foreground text-xl font-semibold">비밀번호 찾기</DialogTitle>
          <p className="text-muted-foreground mt-2 text-sm">가입 정보를 입력하시면 임시 비밀번호를 보내드려요</p>
        </DialogHeader>

        <div className="space-y-4">
          {/* 이름 */}
          <div className="group relative">
            <input
              type="text"
              id="find-name"
              placeholder=" "
              value={name}
              onChange={e => {
                setName(e.target.value)
                if (error) setError(null)
              }}
              className="peer border-border text-foreground focus:border-brand-gold w-full border-b-2 bg-transparent py-2.5 transition-colors duration-200 outline-none placeholder:text-transparent"
            />
            <label
              htmlFor="find-name"
              className="text-muted-foreground peer-focus:text-brand-gold pointer-events-none absolute top-2.5 left-0 text-sm transition-all duration-200 peer-focus:-top-2 peer-focus:text-xs peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:text-xs"
            >
              이름
            </label>
          </div>

          {/* 전화번호 */}
          <div className="group relative">
            <input
              type="tel"
              id="find-phone"
              placeholder=" "
              value={phone}
              onChange={e => {
                setPhone(e.target.value)
                if (error) setError(null)
              }}
              className="peer border-border text-foreground focus:border-brand-gold w-full border-b-2 bg-transparent py-2.5 transition-colors duration-200 outline-none placeholder:text-transparent"
            />
            <label
              htmlFor="find-phone"
              className="text-muted-foreground peer-focus:text-brand-gold pointer-events-none absolute top-2.5 left-0 text-sm transition-all duration-200 peer-focus:-top-2 peer-focus:text-xs peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:text-xs"
            >
              전화번호 (숫자만)
            </label>
          </div>

          {/* 이메일 */}
          <div className="group relative">
            <input
              type="email"
              id="find-email"
              placeholder=" "
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
              className="peer border-border text-foreground focus:border-brand-gold w-full border-b-2 bg-transparent py-2.5 transition-colors duration-200 outline-none placeholder:text-transparent"
            />
            <label
              htmlFor="find-email"
              className="text-muted-foreground peer-focus:text-brand-gold pointer-events-none absolute top-2.5 left-0 text-sm transition-all duration-200 peer-focus:-top-2 peer-focus:text-xs peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:text-xs"
            >
              이메일
            </label>
          </div>

          {/* 에러 메시지 */}
          {error && <p className="text-destructive text-sm">{error}</p>}

          {/* 제출 버튼 */}
          <Button
            onClick={() => void handleSubmit()}
            disabled={isLoading || !name || !phone || !email}
            className="mt-3 h-11 w-full rounded-xl"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                발송 중
              </span>
            ) : (
              '임시 비밀번호 발송'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
