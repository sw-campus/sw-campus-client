/**
 * 로그인 API 응답에서 사용자 유형을 파싱하는 유틸리티
 */

export type UserType = 'ORGANIZATION' | 'PERSONAL' | 'ADMIN' | null

/**
 * 로그인 API 응답 타입 (백엔드 명세 기반)
 */
export interface LoginResponse {
  name?: string
  nickname?: string
  email?: string
  role?: string
  userType?: string
  isOrganization?: boolean
}

/**
 * 로그인 API 응답에서 UserType을 추출합니다.
 *
 * 우선순위:
 * 1. role이 'ADMIN'인 경우 → 'ADMIN'
 * 2. userType이 명시적으로 있는 경우 → 해당 값
 * 3. role이 'ORGANIZATION' 또는 'USER'/'PERSONAL'인 경우 → 해당 값
 * 4. isOrganization boolean 값이 있는 경우 → 해당 값 기반
 * 5. 그 외 → null
 */
export function parseUserType(data: LoginResponse | null | undefined): UserType {
  if (!data) {
    return null
  }

  // 1. role 확인 (대소문자 정규화)
  const role = typeof data.role === 'string' ? data.role.toUpperCase() : null

  if (role === 'ADMIN') {
    return 'ADMIN'
  }

  // 2. userType 확인 (대소문자 정규화)
  const userType = typeof data.userType === 'string' ? data.userType.toUpperCase() : null

  if (userType === 'ORGANIZATION') {
    return 'ORGANIZATION'
  }
  if (userType === 'PERSONAL') {
    return 'PERSONAL'
  }

  // 3. role 기반 판단
  if (role === 'ORGANIZATION') {
    return 'ORGANIZATION'
  }
  if (role === 'USER' || role === 'PERSONAL') {
    return 'PERSONAL'
  }

  // 4. isOrganization boolean 확인
  if (typeof data.isOrganization === 'boolean') {
    return data.isOrganization ? 'ORGANIZATION' : 'PERSONAL'
  }

  return null
}

/**
 * 로그인 API 응답에서 사용자 이름(닉네임)을 추출합니다.
 */
export function parseUserName(data: LoginResponse | null | undefined, fallback = '사용자'): string {
  if (!data) {
    return fallback
  }

  return data.name || data.nickname || data.email?.split('@')[0] || fallback
}

/**
 * 로그인 API 응답에서 닉네임을 추출합니다.
 */
export function parseNickname(data: LoginResponse | null | undefined): string | null {
  if (!data) {
    return null
  }

  if (typeof data.nickname === 'string' && data.nickname.length > 0) {
    return data.nickname
  }

  return null
}
