'use client'

import { FormEvent, useState } from 'react'

import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

import { login as loginApi } from '@/features/auth/authApi'
import { useAuthStore } from '@/store/authStore'

export function useLoginForm() {
  const router = useRouter()
  const { login: setLogin, setUserType: setAuthUserType } = useAuthStore()

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

      const data = await loginApi({ email, password })

      // 응답에 유저 정보가 있을 경우 대비
      let userName = email.split('@')[0]

      // ✅ authStore에 넣을 userType은 Header 분기와 동일하게 대문자('ORGANIZATION' | 'PERSONAL')로 통일
      let userType: 'ORGANIZATION' | 'PERSONAL' | null = null

      if (data) {
        userName = (data as any).name ?? (data as any).nickname ?? userName

        // 서버 응답 케이스별 userType 판별
        // 1) userType이 이미 'ORGANIZATION' | 'PERSONAL' 로 오는 경우
        if ((data as any).userType === 'ORGANIZATION' || (data as any).userType === 'PERSONAL') {
          userType = (data as any).userType
        }
        // 2) userType이 'organization' | 'personal' 소문자로 오는 경우
        else if ((data as any).userType === 'organization' || (data as any).userType === 'personal') {
          userType = (data as any).userType === 'organization' ? 'ORGANIZATION' : 'PERSONAL'
        }
        // 3) role로 오는 경우(예: 'ORGANIZATION')
        else if ((data as any).role) {
          userType = (data as any).role === 'ORGANIZATION' ? 'ORGANIZATION' : 'PERSONAL'
        }
        // 4) isOrganization boolean으로 오는 경우
        else if ((data as any).isOrganization !== undefined) {
          userType = (data as any).isOrganization ? 'ORGANIZATION' : 'PERSONAL'
        }
      }

      // ✅ 디버깅용 로그 (로그인 응답 + store 저장 결과)
      console.log('[login response]', data)
      console.log('[login parsed] userName:', userName, 'userType:', userType)

      console.log('[before set] authStore userType:', useAuthStore.getState().userType)
      setAuthUserType(userType)
      console.log('[after set] authStore userType:', useAuthStore.getState().userType)

      setLogin(userName)
      router.push('/')
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
