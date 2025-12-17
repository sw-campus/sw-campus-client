'use client'

import { FormEvent, useCallback, useState } from 'react'

import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

import { login as loginApi } from '@/features/auth/authApi'
import { useAuthStore } from '@/store/authStore'
import { useSignupStore } from '@/store/signupStore'

export function useLoginForm() {
  const router = useRouter()
  const { login: setLogin } = useAuthStore()
  const setUserType = useSignupStore(state => state.setUserType)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault()

      if (!email || !password) {
        toast.error('이메일과 비밀번호를 모두 입력해주세요.')
        return
      }

      try {
        setIsLoading(true)

        const data = await loginApi({ email, password })

        // 응답에 유저 정보가 있을 경우 대비
        let userName = email.split('@')[0]
        let userType: 'personal' | 'organization' | null = null
        if (data) {
          userName = (data as any).name ?? (data as any).nickname ?? userName
          // userType 판별: 서버 응답에 role, type, isOrganization 등 필드가 있다고 가정
          if ((data as any).userType) {
            userType = (data as any).userType
          } else if ((data as any).role) {
            userType = (data as any).role === 'ORGANIZATION' ? 'organization' : 'personal'
          } else if ((data as any).isOrganization !== undefined) {
            userType = (data as any).isOrganization ? 'organization' : 'personal'
          }
        }
        setUserType(userType)
        setLogin(userName)
        router.push('/')
      } catch (error) {
        console.error(error)
        toast.error('이메일 또는 비밀번호를 다시 확인해주세요.')
      } finally {
        setIsLoading(false)
      }
    },
    [email, password, router, setLogin],
  )

  return {
    email,
    password,
    isLoading,
    setEmail,
    setPassword,
    handleSubmit,
  }
}
