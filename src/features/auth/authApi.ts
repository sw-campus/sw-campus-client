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

// 개인 회원가입
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

// 기관 회원가입
export const signupOrganization = async (payload: {
  email: string
  password: string
  name: string
  nickname: string
  phone: string
  location: string
  organizationName: string
  certificateImage: File
}) => {
  const formData = new FormData()

  // 공통 필드 (개인 회원가입 기준과 동일)
  formData.append('email', payload.email)
  formData.append('password', payload.password)
  formData.append('name', payload.name)
  formData.append('nickname', payload.nickname)

  // 기관 회원 필수/선택 필드
  if (payload.phone) formData.append('phone', payload.phone)
  if (payload.location) formData.append('location', payload.location)
  formData.append('organizationName', payload.organizationName)

  // 재직증명서 (필수)
  formData.append('certificateImage', payload.certificateImage)

  const res = await api.post('/auth/signup/organization', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })

  return res.data
}

// 로그인
export const login = async (payload: { email: string; password: string }) => {
  const res = await api.post('/auth/login', payload, {
    withCredentials: true,
  })
  return res.data
}

// 로그아웃
export const logout = async () => {
  const res = await api.post(
    '/auth/logout',
    {},
    {
      withCredentials: true, // 쿠키 삭제 위해 필요
    },
  )
  return res.data
}

// 회원가입 공통 베이스 스키마 (email, password, name, nickname)
const baseSignupSchema = z.object({
  email: z.string().email('유효한 이메일 주소를 입력해 주세요.'),
  password: z
    .string()
    .min(8, '비밀번호는 8자 이상이어야 합니다.')
    .regex(/[!@#$%^&*(),.?":{}|<>]/, '비밀번호에 특수문자가 1개 이상 포함되어야 합니다.'),
  name: z.string().trim().min(1, '이름은 필수 입력값입니다.'),
  nickname: z.string().trim().min(1, '닉네임은 필수 입력값입니다.'),
})

// 개인 회원가입 유효성 검증 스키마
export const signupSchema = baseSignupSchema.extend({
  // 개인 회원은 전화번호/주소를 선택 입력으로 허용
  phone: z.string().nullable(),
  location: z.string().nullable(),
})

// 기관 회원가입 유효성 검증 스키마
export const organizationSignupSchema = baseSignupSchema.extend({
  phone: z.string().nullable(),
  location: z.string().nullable(),
  organizationName: z.string().trim().min(1, '기관명은 필수 입력값입니다.'),
  certificateImage: z.instanceof(File, { message: '재직증명서는 필수입니다.' }),
})

export type SignupInput = z.infer<typeof signupSchema>
export type OrganizationSignupInput = z.infer<typeof organizationSignupSchema>
