import { api } from '@/lib/axios'

/**
 * 회원 탈퇴 응답 타입
 */
export interface WithdrawResponse {
  success: boolean
  oauthProviders: string[]
  message: string
}

/**
 * 회원 탈퇴 API
 * @returns 탈퇴 결과 (OAuth provider 정보 포함)
 */
export async function withdrawMember(): Promise<WithdrawResponse> {
  const { data } = await api.delete<WithdrawResponse>('/members/me')
  return data
}
