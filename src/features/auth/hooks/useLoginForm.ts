'use client'

import { FormEvent, useState } from 'react'

import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

import { login as loginApi } from '@/features/auth/authApi'
import { getProfile } from '@/features/mypage/api/survey.api'
import { parseUserType, parseUserName, parseNickname, type LoginResponse } from '@/lib/parseLoginResponse'
import { useAuthStore } from '@/store/authStore'

export function useLoginForm() {
  const router = useRouter()
  const { login: setLogin, setUserType: setAuthUserType, setNickname } = useAuthStore()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!email || !password) {
      toast.error('이메일과 비밀번호를 모두 입력해주세요.')
      return
    }

    try {
      setIsLoading(true)

      const data = (await loginApi({ email, password })) as LoginResponse | null

      const userName = parseUserName(data, email.split('@')[0])
      const userType = parseUserType(data)

      setAuthUserType(userType)
      setLogin(userName)

      // 닉네임 설정: 응답에 있으면 사용, 없으면 프로필 조회
      try {
        const nickFromResponse = parseNickname(data)
        if (nickFromResponse) {
          setNickname(nickFromResponse)
        } else {
          const profile = await getProfile()
          if (profile?.nickname) setNickname(profile.nickname)
        }
      } catch {
        // ignore nickname fetch errors
      }

      // 관리자인 경우 /admin 페이지로, 그 외에는 홈으로 리다이렉트
      if (userType === 'ADMIN') {
        router.push('/admin')
      } else {
        router.push('/')
      }
    } catch (error) {
      console.error(error)
      toast.error('이메일 또는 비밀번호를 다시 확인해주세요.')
    } finally {
      setIsLoading(false)
    }
  }

  return {
    email,
    password,
    isLoading,
    setEmail,
    setPassword,
    handleSubmit,
  }
}
