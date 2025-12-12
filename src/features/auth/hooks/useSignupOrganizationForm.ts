'use client'

import { ChangeEvent, FormEvent, useEffect, useState } from 'react'

import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

import { checkEmailStatus, sendEmailAuth, signupOrganization, signupSchema } from '@/features/auth/authApi'
import { useSignupStore } from '@/store/signupStore'

export function useSignupOrganizationForm() {
  const router = useRouter()

  const {
    address,
    email,
    isSendingEmail,
    isEmailVerified,
    password,
    passwordConfirm,
    isPasswordMatched,
    name,
    nickname,
    phone,
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
    setOrganizationName,
    setCertificateImage,
  } = useSignupStore()

  const [isSubmitting, setIsSubmitting] = useState(false)

  const resetPasswordValidation = () => {
    setIsPasswordMatched(null)
    setIsPasswordConfirmed(false)
  }

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

  // 재직증명서 업로드
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null
    setCertificateImage(file)
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
  const handleSendEmailAuth = async () => {
    if (isEmailVerified) return

    try {
      setIsSendingEmail(true)
      await sendEmailAuth(email)
      toast.success('인증 메일을 발송했습니다. 메일함을 확인해 주세요.')
      setIsEmailVerified(false)
    } catch (error: any) {
      const message = error?.response?.data?.message ?? '인증 메일 발송에 실패했습니다. 잠시 후 다시 시도해 주세요.'
      toast.error(message)
    } finally {
      setIsSendingEmail(false)
    }
  }

  // 재직증명서 인증(아직 미구현 placeholder)
  const handleCertificateVerifyPlaceholder = () => {
    toast.message('재직증명서 인증 기능은 아직 연결되지 않았어요.')
  }

  // 회원가입
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (password !== passwordConfirm) {
      toast.error('비밀번호와 비밀번호 확인이 일치하지 않습니다.')
      return
    }

    try {
      setIsSubmitting(true)

      if (!certificateImage) {
        toast.error('재직증명서를 첨부해 주세요.')
        return
      }

      await signupOrganization({
        email: email || '',
        password: password || '',
        name: name || '',
        nickname: nickname || '',
        phone: phone || '',
        location: address || '',
        organizationName: organizationName || '',
        certificateImage: certificateImage || '',
      })

      router.push('/')
    } catch (error) {
      console.error('Organization signup error:', error)
      toast.error('회원가입 중 오류가 발생했습니다. 다시 시도해 주세요.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    // values
    address,
    email,
    isSendingEmail,
    isEmailVerified,
    password,
    passwordConfirm,
    isPasswordMatched,
    name,
    nickname,
    phone,
    organizationName,
    certificateImage,
    isSubmitting,

    // setters
    setEmail,
    setPassword,
    setPasswordConfirm,
    setName,
    setNickname,
    setPhone,
    setOrganizationName,

    // handlers
    handleSendEmailAuth,
    handleCheckPasswordMatch,
    handleFileChange,
    handleSubmit,
    resetPasswordValidation,
    handleCertificateVerifyPlaceholder,
  }
}
