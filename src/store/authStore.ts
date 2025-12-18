'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AuthState {
  accessToken: string | null
  isLoggedIn: boolean
  userName: string | null
  userType: 'ORGANIZATION' | 'PERSONAL' | null
  login: (name: string) => void
  logout: () => void
  setUserType: (userType: 'ORGANIZATION' | 'PERSONAL' | null) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    set => ({
      accessToken: null,
      isLoggedIn: false,
      userName: null,
      userType: null,

      login: (name: string) =>
        set({
          isLoggedIn: true,
          userName: name,
        }),

      setAuth: (token, userType) =>
        set({
          accessToken: token,
          userType,
        }),

      setUserType: userType =>
        set({
          userType,
        }),

      logout: () =>
        set({
          isLoggedIn: false,
          accessToken: null,
          userType: null,
        }),
    }),

    {
      name: 'auth-storage', // localStorage key
    },
  ),
)

//   // 로그인 시 호출 - 백엔드에서 받은 이름/닉네임을 넘겨주면 됨
// login: (name: string) =>
//   set({
//     isLoggedIn: true,
//     userName: name,
//   }),

// userType 설정 (로그인 시)
// setUserType: userType =>
//   set({
//     userType,
//   }),

//   // 로그아웃 시 호출
//   logout: () =>
//     set({
//       isLoggedIn: false,
//       userName: null,
//       userType: null,
//     }),
// }))
