'use client'

import { create } from 'zustand'

interface AuthState {
  isLoggedIn: boolean // 로그인 여부
  userName: string | null // 유저 이름 (또는 닉네임)
  userType: 'ORGANIZATION' | 'PERSONAL' | null // 개인 / 기관 구분
  login: (name: string) => void
  logout: () => void
  setUserType: (userType: 'ORGANIZATION' | 'PERSONAL' | null) => void
}

export const useAuthStore = create<AuthState>(set => ({
  isLoggedIn: false,
  userName: null,
  userType: null,

  // 로그인 시 호출 - 백엔드에서 받은 이름/닉네임을 넘겨주면 됨
  login: (name: string) =>
    set({
      isLoggedIn: true,
      userName: name,
    }),

  // userType 설정 (로그인 시)
  setUserType: userType =>
    set({
      userType,
    }),

  // 로그아웃 시 호출
  logout: () =>
    set({
      isLoggedIn: false,
      userName: null,
      userType: null,
    }),
}))
