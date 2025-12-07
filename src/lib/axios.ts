import axios from 'axios'

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
    return Promise.reject(error)
  },
)

// 응답 인터셉터
api.interceptors.response.use(
  response => response,
  error => {
    const status = error.response?.status

    // 공통 에러 처리 (강제 로그아웃, 토스트 등)
    if (status === 401) {
      // 예: 인증 만료 → 로그인 페이지 이동
      // router.push('/auth/login')
    }

    if (status === 403) {
      console.warn('권한 없음')
    }

    if (status >= 500) {
      console.error('서버 에러 발생')
    }

    return Promise.reject(error)
  },
)
