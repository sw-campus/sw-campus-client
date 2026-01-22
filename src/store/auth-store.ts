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
  hasHydrated: boolean

  // actions
  login: (name: string) => void
  setAuth: (token: string | null, userType: 'ORGANIZATION' | 'PERSONAL' | 'ADMIN' | null) => void
  setUserType: (userType: 'ORGANIZATION' | 'PERSONAL' | 'ADMIN' | null) => void
  setNickname: (nickname: string | null) => void
  logout: () => void
  resetAuth: () => void
  setHasHydrated: (state: boolean) => void
}

export const useAuthStore = create<AuthState>()(
  persist<AuthState>(
    set => ({
      accessToken: null,
      isLoggedIn: false,
      userName: null,
      nickname: null,
      userType: null,
      hasHydrated: false,

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

      setHasHydrated: (state: boolean) => set({ hasHydrated: state }),
    }),

    {
      name: 'auth-storage', // localStorage key
      // 🔒 보안: accessToken은 localStorage에 저장하지 않음 (XSS 방지)
      // 페이지 새로고침 시 httpOnly refresh cookie로 자동 갱신됨
      partialize: state => ({
        isLoggedIn: state.isLoggedIn,
        userName: state.userName,
        nickname: state.nickname,
        userType: state.userType,
        // accessToken은 메모리에만 유지, localStorage에 저장 안 함
      }),
      onRehydrateStorage: () => state => {
        state?.setHasHydrated(true)
      },
    },
  ) as unknown as StateCreator<AuthState>,
)
