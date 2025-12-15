import { create } from 'zustand'

export type SignupState = {
  address: string | null
  detailAddress: string | null

  email: string
  isSendingEmail: boolean
  isEmailVerified: boolean

  password: string
  passwordConfirm: string
  isPasswordMatched: boolean | null
  isPasswordConfirmed: boolean

  name: string
  nickname: string
  phone: string | null

  organizationName: string
  certificateImage: File | null

  setAddress: (value: string) => void
  setDetailAddress: (value: string) => void
  setEmail: (value: string) => void
  setIsSendingEmail: (value: boolean) => void
  setIsEmailVerified: (value: boolean) => void
  setPassword: (value: string) => void
  setPasswordConfirm: (value: string) => void
  setIsPasswordMatched: (value: boolean | null) => void
  setIsPasswordConfirmed: (value: boolean) => void
  setName: (value: string) => void
  setNickname: (value: string) => void
  setPhone: (value: string | null) => void
  setOrganizationName: (value: string) => void
  setCertificateImage: (value: File | null) => void
  reset: () => void
}

export const useSignupStore = create<SignupState>(set => ({
  address: null,
  detailAddress: null,
  email: '',
  isSendingEmail: false,
  isEmailVerified: false,
  password: '',
  passwordConfirm: '',
  isPasswordMatched: null,
  isPasswordConfirmed: false,
  name: '',
  nickname: '',
  phone: null,
  organizationName: '',
  certificateImage: null,

  setAddress: value => set({ address: value || null }),
  setDetailAddress: value => set({ detailAddress: value || null }),
  setEmail: value => set({ email: value }),
  setIsSendingEmail: value => set({ isSendingEmail: value }),
  setIsEmailVerified: value => set({ isEmailVerified: value }),
  setPassword: value => set({ password: value }),
  setPasswordConfirm: value => set({ passwordConfirm: value }),
  setIsPasswordMatched: value => set({ isPasswordMatched: value }),
  setIsPasswordConfirmed: value => set({ isPasswordConfirmed: value }),
  setName: value => set({ name: value }),
  setNickname: value => set({ nickname: value }),
  setPhone: value => set({ phone: value }),
  setOrganizationName: value => set({ organizationName: value }),
  setCertificateImage: value => set({ certificateImage: value }),

  reset: () =>
    set({
      address: null,
      detailAddress: null,
      email: '',
      isSendingEmail: false,
      isEmailVerified: false,
      password: '',
      passwordConfirm: '',
      isPasswordMatched: null,
      isPasswordConfirmed: false,
      name: '',
      nickname: '',
      phone: null,
      organizationName: '',
      certificateImage: null,
    }),
}))
