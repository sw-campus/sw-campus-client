'use client'

import { FormEvent, useEffect, useRef, useState } from 'react'

import { useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'sonner'

import {
  checkEmailStatus,
  checkNicknameAvailability,
  getVerifiedEmail,
  sendEmailAuth,
  signup,
  signupSchema,
  SignupInput,
} from '@/features/auth/authApi'
import { useSignupStore } from '@/store/signupStore'

export function useSignupForm() {
  const {
    address,
    detailAddress,
    email,
    isSendingEmail,
    isEmailVerified,
    password,
    passwordConfirm,
    isPasswordMatched,
    isPasswordConfirmed,
    name,
    nickname,
    phone,

    setEmail,
    setIsSendingEmail,
    setIsEmailVerified,
    setPassword,
    setPasswordConfirm,
    setIsPasswordMatched,
    setIsPasswordConfirmed,
    setName,
    setNickname,
    setPhone,
    reset,
  } = useSignupStore()

  const searchParams = useSearchParams()
  const router = useRouter()
  const verifiedParam = searchParams.get('verified')
  const hasInitializedRef = useRef(false)

  const [isNicknameChecking, setIsNicknameChecking] = useState(false)
  const [nicknameCheckState, setNicknameCheckState] = useState<'idle' | 'available' | 'unavailable' | 'error'>('idle')
  const [lastCheckedNickname, setLastCheckedNickname] = useState<string | null>(null)

  const resetPasswordValidation = () => {
    setIsPasswordMatched(null)
    setIsPasswordConfirmed(false)
  }

  const resetNicknameValidation = () => {
    setNicknameCheckState('idle')
    setLastCheckedNickname(null)
  }

  const extractErrorMessage = (error: unknown): string | null => {
    if (!error || typeof error !== 'object') return null
    const response = (error as Record<string, unknown>).response
    if (!response || typeof response !== 'object') return null
    const data = (response as Record<string, unknown>).data
    if (!data || typeof data !== 'object') return null
    const message = (data as Record<string, unknown>).message
    return typeof message === 'string' ? message : null
  }

  // 첫 진입 시 verified=true가 아니면 초기화
  useEffect(() => {
    if (hasInitializedRef.current) return
    hasInitializedRef.current = true

    if (verifiedParam !== 'true') reset()
  }, [reset, verifiedParam])

  // verified=true로 들어오면 서버에서 인증된 이메일을 받아와 세팅
  useEffect(() => {
    if (verifiedParam === 'true') {
      ;(async () => {
        try {
          const data = await getVerifiedEmail()
          setEmail(data.email)
          setIsEmailVerified(true)
        } catch (e) {
          console.error('인증된 이메일 조회 실패', e)
          setIsEmailVerified(false)
        } finally {
          router.replace('/signup/personal')
        }
      })()
    }
  }, [verifiedParam, router, setIsEmailVerified, setEmail])

  // 이메일 인증 상태 polling
  useEffect(() => {
    if (!email || isEmailVerified) return

    const intervalId = setInterval(async () => {
      try {
        const data = await checkEmailStatus(email)

        if (data?.verified) {
          setIsEmailVerified(true)
          clearInterval(intervalId)
        }
      } catch (error) {
        console.error('이메일 인증 상태 조회 실패', error)
      }
    }, 1000)

    return () => clearInterval(intervalId)
  }, [email, isEmailVerified, setIsEmailVerified])

  const handleCheckPasswordMatch = () => {
    if (!password || !passwordConfirm) {
      toast.error('비밀번호와 비밀번호 확인을 모두 입력해 주세요.')
      resetPasswordValidation()
      return
    }

    const result = signupSchema.shape.password.safeParse(password)

    if (!result.success) {
      const firstError = result.error.issues[0]
      toast.error(firstError?.message ?? '비밀번호 형식을 다시 확인해 주세요.')
      resetPasswordValidation()
      return
    }

    if (password === passwordConfirm) {
      setIsPasswordMatched(true)
      setIsPasswordConfirmed(true)
    } else {
      setIsPasswordMatched(false)
      setIsPasswordConfirmed(false)
      toast.error('비밀번호와 비밀번호 확인이 일치하지 않습니다')
    }
  }

  const handleSendEmailAuth = async () => {
    if (isEmailVerified) return

    try {
      setIsSendingEmail(true)
      await sendEmailAuth(email)
      toast.success('인증 메일을 발송했습니다. 메일함을 확인해 주세요.')
      setIsEmailVerified(false)
    } catch (error: unknown) {
      toast.error(extractErrorMessage(error) ?? '인증 메일 발송에 실패했습니다. 잠시 후 다시 시도해 주세요.')
    } finally {
      setIsSendingEmail(false)
    }
  }

  const handleNicknameChange = (value: string) => {
    setNickname(value)
    resetNicknameValidation()
  }

  const handleCheckNickname = async () => {
    const normalized = nickname.trim()
    if (!normalized) {
      toast.error('닉네임을 입력해 주세요.')
      resetNicknameValidation()
      return
    }

    try {
      setIsNicknameChecking(true)
      setNicknameCheckState('idle')

      const data = await checkNicknameAvailability(normalized)
      const available = Boolean(data?.available)

      setLastCheckedNickname(normalized)
      setNicknameCheckState(available ? 'available' : 'unavailable')
    } catch (error: unknown) {
      console.error('닉네임 중복 검사 실패', error)
      setNicknameCheckState('error')
      setLastCheckedNickname(null)

      toast.error(extractErrorMessage(error) ?? '닉네임 확인에 실패했습니다. 잠시 후 다시 시도해 주세요.')
    } finally {
      setIsNicknameChecking(false)
    }
  }

  // 회원가입
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!isEmailVerified) {
      toast.error('이메일 인증을 완료해 주세요.')
      return
    }

    if (!isPasswordConfirmed) {
      toast.error('비밀번호 확인을 완료해 주세요.')
      return
    }

    const normalizedNickname = nickname.trim()
    if (nicknameCheckState !== 'available' || lastCheckedNickname !== normalizedNickname) {
      toast.error('닉네임 중복 확인을 완료해 주세요.')
      return
    }

    const location = address && detailAddress ? `${address} ${detailAddress}` : (address ?? detailAddress ?? null)

    const payload: SignupInput = {
      email,
      password,
      name,
      nickname: normalizedNickname,
      phone,
      location,
    }

    const result = signupSchema.safeParse(payload)
    if (!result.success) {
      const firstError = result.error.issues[0]
      toast.error(firstError?.message ?? '입력값을 다시 확인해 주세요.')
      return
    }

    try {
      await signup(result.data)
      reset()
      toast.success('회원가입이 완료되었습니다.')
      router.push('/login')
    } catch (error: unknown) {
      toast.error(extractErrorMessage(error) ?? '회원가입에 실패했습니다. 잠시 후 다시 시도해 주세요.')
    }
  }

  return {
    // values
    address,
    detailAddress,
    email,
    isSendingEmail,
    isEmailVerified,
    password,
    passwordConfirm,
    isPasswordMatched,
    isPasswordConfirmed,
    name,
    nickname,
    phone,

    // setters
    setEmail,
    setPassword,
    setPasswordConfirm,
    setName,
    setNickname: handleNicknameChange,
    setPhone,

    isNicknameChecking,
    nicknameCheckState,
    handleCheckNickname,

    // handlers
    handleSendEmailAuth,
    handleCheckPasswordMatch,
    handleSubmit,
    resetPasswordValidation,
  }
}
