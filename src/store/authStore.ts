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
