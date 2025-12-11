import { z } from 'zod'

import { api } from '@/lib/axios'

// 이메일 인증 상태 조회 API
export const checkEmailStatus = async (email: string) => {
  const res = await api.get('/auth/email/status', {
    params: { email },
  })
  return res.data
}

// 이메일 인증 메일 보내기
export const sendEmailAuth = async (email: string) => {
  const res = await api.post('/auth/email/send', { email })
  return res.data
}

// 쿠키 기반 인증된 이메일 조회
export const getVerifiedEmail = async () => {
  const res = await api.get('/auth/email/verified')
  return res.data
}

// 회원가입
export const signup = async (payload: {
  email: string
  password: string
  name: string
  nickname: string
  phone: string | null
  location: string | null
}) => {
  const res = await api.post('/auth/signup', payload)
  return res.data
}

// 회원가입 유효성 검증 스키마 (Zod)
export const signupSchema = z.object({
  email: z.string().email('유효한 이메일 주소를 입력해 주세요.'),
  password: z
    .string()
    .min(8, '비밀번호는 8자 이상이어야 합니다.')
    .regex(/[!@#$%^&*(),.?":{}|<>]/, '비밀번호에 특수문자가 1개 이상 포함되어야 합니다.'),
  name: z.string().trim().min(1, '이름은 필수 입력값입니다.'),
  nickname: z.string().trim().min(1, '닉네임은 필수 입력값입니다.'),
  phone: z.string().nullable(),
  location: z.string().nullable(),
})

export type SignupInput = z.infer<typeof signupSchema>
