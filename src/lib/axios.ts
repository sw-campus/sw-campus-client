import axios from 'axios'
import { toast } from 'sonner'

import { env } from './env'

export const api = axios.create({
  baseURL: env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  timeout: 10_000,
})

// 요청 인터셉터
api.interceptors.request.use(
  config => {
    // const token = getAuthToken()
    // if (token) config.headers.Authorization = `Bearer ${token}`
    return config
  },
  error => {
    toast.error('요청 생성 중 오류 발생')
    return Promise.reject(error)
  },
)

// 응답 인터셉터
api.interceptors.response.use(
  response => response,
  error => {
    const status = error.response?.status
    const message = error.response?.data?.message

    // 공통 에러 처리
    if (status === 400) toast.error(message ?? '잘못된 요청입니다')
    if (status === 401) toast.error('로그인이 필요합니다')
    if (status === 403) toast.error('접근 권한이 없습니다')
    if (status === 404) toast.error('요청한 리소스를 찾을 수 없습니다')
    if (status >= 500) toast.error('서버 오류가 발생했습니다')

    return Promise.reject(error)
  },
)

// 이메일 인증 리다이렉트 URL 생성
export const getVerifyEmailRedirectUrl = (token: string, signupType: 'personal' | 'organization' = 'personal') => {
  const params = new URLSearchParams({
    token,
    type: signupType,
  })

  return `${env.NEXT_PUBLIC_API_URL}/auth/email/verify?${params.toString()}`
}
