'use client'

import { FormEvent, useState } from 'react'

import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { createJSONStorage } from 'zustand/middleware'

import { login as loginApi } from '@/features/auth/authApi'
import { getProfile } from '@/features/mypage/api/survey.api'
import { useAuthStore } from '@/store/authStore'

export function useLoginForm() {
  const router = useRouter()
  const { login: setLogin, setUserType: setAuthUserType, setNickname } = useAuthStore()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [rememberMe, setRememberMe] = useState<boolean>(false)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!email || !password) {
      toast.error('이메일과 비밀번호를 모두 입력해주세요.')
      return
    }

    try {
      setIsLoading(true)

      const data = await loginApi({ email, password })

      let userName = email.split('@')[0]

      let userType: 'ORGANIZATION' | 'PERSONAL' | 'ADMIN' | null = null

      if (data) {
        userName = (data as any).name ?? (data as any).nickname ?? userName
        const role = (data as any)?.role?.toUpperCase?.() ?? (data as any)?.role

        console.log('[Login] Server response:', { role, data }) // 디버깅용

        // 관리자인 경우 ADMIN 타입으로 설정
        if (role === 'ADMIN') {
          userType = 'ADMIN'
        } else if ((data as any).userType === 'ORGANIZATION' || (data as any).userType === 'PERSONAL') {
          userType = (data as any).userType
        } else if ((data as any).userType === 'organization' || (data as any).userType === 'personal') {
          userType = (data as any).userType === 'organization' ? 'ORGANIZATION' : 'PERSONAL'
        } else if (role === 'ORGANIZATION') {
          userType = 'ORGANIZATION'
        } else if (role === 'USER' || role === 'PERSONAL') {
          userType = 'PERSONAL'
        } else if ((data as any).isOrganization !== undefined) {
          userType = (data as any).isOrganization ? 'ORGANIZATION' : 'PERSONAL'
        }
      }
      // persist 저장소를 자동로그인 여부에 따라 전환
      try {
        const persistApi = (useAuthStore as unknown as { persist?: { setOptions?: Function } }).persist
        persistApi?.setOptions?.({
          storage: createJSONStorage(() => (rememberMe ? localStorage : sessionStorage)),
        })
        if (!rememberMe && typeof window !== 'undefined') {
          // 기존 localStorage 잔여분 정리
          window.localStorage.removeItem('auth-storage')
        }
      } catch {
        // noop
      }

      setAuthUserType(userType)
      setLogin(userName)

      // 닉네임 설정: 응답에 있으면 사용, 없으면 프로필 조회
      try {
        const nickFromResponse = (data as any)?.nickname
        if (typeof nickFromResponse === 'string' && nickFromResponse.length > 0) {
          setNickname(nickFromResponse)
        } else {
          const profile = await getProfile()
          if (profile?.nickname) setNickname(profile.nickname)
        }
      } catch {
        // ignore nickname fetch errors
      }

      // 관리자인 경우 /admin 페이지로, 그 외에는 홈으로 리다이렉트
      console.log('[Login] Redirecting...', { userType }) // 디버깅용
      if (userType === 'ADMIN') {
        console.log('[Login] Redirecting to /admin')
        router.push('/admin')
      } else {
        console.log('[Login] Redirecting to /')
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
    rememberMe,
    setRememberMe,
    handleSubmit,
  }
}
