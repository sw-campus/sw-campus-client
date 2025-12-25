'use client'

import { create } from 'zustand'
import type { StateCreator } from 'zustand'
import { persist } from 'zustand/middleware'

interface AuthState {
  accessToken: string | null
  isLoggedIn: boolean
  userName: string | null
  nickname: string | null
  userType: 'ORGANIZATION' | 'PERSONAL' | 'ADMIN' | null

  // actions
  login: (name: string) => void
  setAuth: (token: string | null, userType: 'ORGANIZATION' | 'PERSONAL' | 'ADMIN' | null) => void
  setUserType: (userType: 'ORGANIZATION' | 'PERSONAL' | 'ADMIN' | null) => void
  setNickname: (nickname: string | null) => void
  logout: () => void
  resetAuth: () => void
}

export const useAuthStore = create<AuthState>()(
  persist<AuthState>(
    set => ({
      accessToken: null,
      isLoggedIn: false,
      userName: null,
      nickname: null,
      userType: null,

      login: (name: string) =>
        set({
          isLoggedIn: true,
          userName: name,
        }),

      setAuth: (token: string | null, userType: 'ORGANIZATION' | 'PERSONAL' | 'ADMIN' | null) =>
        set({
          accessToken: token,
          userType,
          isLoggedIn: !!token,
        }),

      setUserType: (userType: 'ORGANIZATION' | 'PERSONAL' | 'ADMIN' | null) => set({ userType }),

      setNickname: (nickname: string | null) => set({ nickname }),

      logout: () =>
        set({
          accessToken: null,
          isLoggedIn: false,
          userName: null,
          nickname: null,
          userType: null,
        }),

      // 🔥 토큰 만료/401 대응용: 인증 상태 완전 초기화
      resetAuth: () =>
        set({
          accessToken: null,
          isLoggedIn: false,
          userName: null,
          nickname: null,
          userType: null,
        }),
    }),

    {
      name: 'auth-storage', // localStorage key
    },
  ) as unknown as StateCreator<AuthState>,
)
