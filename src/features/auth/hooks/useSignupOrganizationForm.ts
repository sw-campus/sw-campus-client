'use client'

import { ChangeEvent, FormEvent, useEffect, useState } from 'react'

import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

import {
  checkEmailStatus,
  checkNicknameAvailability,
  organizationSignupSchema,
  sendEmailAuth,
  signupOrganization,
  signupSchema,
} from '@/features/auth/authApi'
import { useAuthStore } from '@/store/authStore'
import { useSignupStore } from '@/store/signupStore'

export function useSignupOrganizationForm() {
  const router = useRouter()
  const { login: setLogin } = useAuthStore()

  const {
    address,
    detailAddress,
    email,
    isSendingEmail,
    isEmailVerified,
    password,
    passwordConfirm,
    isPasswordMatched,
    name,
    nickname,
    phone,
    organizationId,
    organizationName,
    certificateImage,

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
    setOrganizationId,
    setOrganizationName,
    setCertificateImage,
  } = useSignupStore()

  const [isSubmitting, setIsSubmitting] = useState(false)

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
    const maybeMessage = (error as { response?: { data?: { message?: unknown } } }).response?.data?.message
    return typeof maybeMessage === 'string' ? maybeMessage : null
  }

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

  // 재직증명서 업로드
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null
    setCertificateImage(file)
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

  // 비밀번호 일치 확인
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

  // 이메일 인증 메일 보내기
  const handleSendEmailAuth = async (signupType: 'personal' | 'organization' = 'personal') => {
    if (isEmailVerified) return
    try {
      setIsSendingEmail(true)
      await sendEmailAuth(email, signupType)
      toast.success('인증 메일을 발송했습니다. 메일함을 확인해 주세요.')
      setIsEmailVerified(false)
    } catch (error: unknown) {
      toast.error(extractErrorMessage(error) ?? '인증 메일 발송에 실패했습니다. 잠시 후 다시 시도해 주세요.')
    } finally {
      setIsSendingEmail(false)
    }
  }

  // 재직증명서 인증(아직 미구현 placeholder)
  const handleCertificateVerifyPlaceholder = () => {
    toast.message('재직증명서 인증 기능은 아직 연결되지 않았어요.')
  }

  // 기존 기관 선택
  const handleSelectExistingOrg = (orgId: number, orgName: string) => {
    setOrganizationId(orgId)
    setOrganizationName(orgName)
  }

  // 새 기관명 직접 입력
  const handleInputNewOrg = (orgName: string) => {
    setOrganizationId(null) // 새 기관이므로 ID는 null
    setOrganizationName(orgName)
  }

  // 회원가입
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!isEmailVerified) {
      toast.error('이메일 인증을 완료해 주세요.')
      return
    }

    if (password !== passwordConfirm) {
      toast.error('비밀번호와 비밀번호 확인이 일치하지 않습니다.')
      return
    }

    const normalizedNickname = nickname.trim()
    if (nicknameCheckState !== 'available' || lastCheckedNickname !== normalizedNickname) {
      toast.error('닉네임 중복 확인을 완료해 주세요.')
      return
    }

    const location = (
      address && detailAddress ? `${address} ${detailAddress}` : (address ?? detailAddress ?? '')
    ).trim()

    try {
      setIsSubmitting(true)

      if (!certificateImage) {
        toast.error('재직증명서를 첨부해 주세요.')
        return
      }

      if (!phone || !phone.trim()) {
        toast.error('전화번호를 입력해 주세요.')
        return
      }

      if (!location) {
        toast.error('주소를 입력해 주세요.')
        return
      }

      if (!organizationName?.trim()) {
        toast.error('기관명을 입력해 주세요.')
        return
      }

      const payload = {
        email: email || '',
        password: password || '',
        name: name || '',
        nickname: normalizedNickname,
        phone: phone.trim(),
        location,
        organizationId,
        organizationName: organizationName || '',
        certificateImage,
      }

      const parsed = organizationSignupSchema.safeParse(payload)
      if (!parsed.success) {
        const firstError = parsed.error.issues[0]
        toast.error(firstError?.message ?? '입력값을 다시 확인해 주세요.')
        return
      }

      await signupOrganization(parsed.data)

      const headerName = organizationName.trim()

      if (headerName) setLogin(headerName)

      router.push('/login')
    } catch (error: unknown) {
      console.error('Organization signup error:', error)
      toast.error(extractErrorMessage(error) ?? '회원가입 중 오류가 발생했습니다. 다시 시도해 주세요.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    address,
    detailAddress,
    email,
    isSendingEmail,
    isEmailVerified,
    password,
    passwordConfirm,
    isPasswordMatched,
    name,
    nickname,
    phone,
    organizationId,
    organizationName,
    certificateImage,
    isSubmitting,

    setEmail,
    setPassword,
    setPasswordConfirm,
    setName,
    setNickname: handleNicknameChange,
    setPhone,
    handleSelectExistingOrg,
    handleInputNewOrg,

    isNicknameChecking,
    nicknameCheckState,
    handleCheckNickname,

    handleSendEmailAuth,
    handleCheckPasswordMatch,
    handleFileChange,
    handleSubmit,
    resetPasswordValidation,
    handleCertificateVerifyPlaceholder,
  }
}
