import { api } from '@/lib/axios'

/**
 * 현재 사용자 정보 응답 타입
 */
export interface CurrentMember {
  userId: number
  nickname: string
  email: string
  role: 'USER' | 'ORGANIZATION' | 'ADMIN'
}

/**
 * 회원 탈퇴 응답 타입
 */
export interface WithdrawResponse {
  success: boolean
  oauthProviders: string[]
  message: string
}

/**
 * 현재 사용자 정보 조회 API
 * GET /api/v1/members/me
 */
export async function getCurrentMember(): Promise<CurrentMember> {
  const { data } = await api.get<CurrentMember>('/members/me')
  return data
}

/**
 * 회원 탈퇴 API
 * @param password 비밀번호 (OAuth 사용자는 빈 문자열)
 * @returns 탈퇴 결과 (OAuth provider 정보 포함)
 */
export async function withdrawMember(password: string): Promise<WithdrawResponse> {
  const { data } = await api.delete<WithdrawResponse>('/members/me', {
    data: { password },
  })
  return data
}
