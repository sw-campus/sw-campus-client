'use client'

import { FormEvent, useState, useEffect, useRef, ChangeEvent } from 'react'

import { useRouter } from 'next/navigation'
import { Toaster, toast } from 'sonner'

import { signupOrganization } from '@/features/auth/authApi'
import {
  checkEmailStatus,
  getVerifiedEmail,
  sendEmailAuth,
  signup,
  signupSchema,
  SignupInput,
} from '@/features/auth/authApi'
import AddressInput from '@/features/auth/components/AddressInput'
import EmailAuthInput from '@/features/auth/components/EmailAuthInput'
import PasswordFields from '@/features/auth/components/PasswordFields'
import { useSignupStore } from '@/store/signupStore'

const INPUT_BASE_CLASS =
  'h-9 rounded-md border border-neutral-300 bg-neutral-100 px-3 outline-none focus:border-neutral-500 focus:bg-white'

export default function SignupOrganizationPage() {
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
    organizationName,
    certificateImage,

    setAddress,
    setDetailAddress,
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
    reset,
  } = useSignupStore()

  const router = useRouter()

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
  }, [email, isEmailVerified])

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

    // Zod 스키마의 password 규칙만 따로 검사
    const result = signupSchema.shape.password.safeParse(password)

    if (!result.success) {
      // 첫 번째 에러 메시지 사용
      const firstError = result.error.issues[0]
      toast.error(firstError?.message ?? '비밀번호 형식을 다시 확인해 주세요.')
      resetPasswordValidation()
      return
    }

    // 여기까지 통과했으면 형식은 통과 → 이제 일치 여부만 체크
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

  // 회원가입
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (password !== passwordConfirm) {
      alert('비밀번호와 비밀번호 확인이 일치하지 않습니다.')
      return
    }

    try {
      setIsSubmitting(true)

      if (!certificateImage) {
        toast.error('재직증명서를 첨부해 주세요.')
        setIsSubmitting(false)
        return
      }

      // 기관 회원가입 API 호출
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
      alert('회원가입 중 오류가 발생했습니다. 다시 시도해 주세요.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-xl rounded-xl bg-white/90 p-8 shadow-[0_16px_40px_rgba(0,0,0,0.45)]"
    >
      {/* 이메일 + 인증 */}
      <EmailAuthInput
        email={email}
        isEmailVerified={isEmailVerified}
        isSendingEmail={isSendingEmail}
        onEmailChange={setEmail}
        onClickAuth={handleSendEmailAuth}
      />

      {/* 비밀번호 + 비밀번호 확인 */}
      <PasswordFields
        password={password}
        passwordConfirm={passwordConfirm}
        isPasswordMatched={isPasswordMatched}
        onChangePassword={value => {
          setPassword(value)
          resetPasswordValidation()
        }}
        onChangePasswordConfirm={value => {
          setPasswordConfirm(value)
          resetPasswordValidation()
        }}
        onCheckPasswordMatch={handleCheckPasswordMatch}
      />

      {/* 이름 */}
      <div className="mb-4">
        <label className="mb-1 block text-neutral-700" htmlFor="">
          이름
        </label>
        <input
          id=""
          type="text"
          placeholder="name"
          className={`${INPUT_BASE_CLASS} w-full`}
          value={name}
          onChange={e => setName(e.target.value)}
        />
      </div>

      {/* 닉네임 */}
      <div className="mb-4">
        <label className="mb-1 block text-neutral-700">닉네임</label>
        <input
          type="text"
          placeholder="nickname"
          className={`${INPUT_BASE_CLASS} w-full`}
          value={nickname}
          onChange={e => setNickname(e.target.value)}
        />
      </div>

      {/* 기관명 */}
      <div className="mb-4">
        <label className="mb-1 block text-neutral-700">기관명</label>
        <input
          type="text"
          name="organizationName"
          value={organizationName}
          onChange={e => setOrganizationName(e.target.value)}
          placeholder="기관명을 입력해 주세요"
          className="h-9 w-full rounded-md border border-neutral-300 bg-neutral-100 px-3 outline-none focus:border-neutral-500 focus:bg-white"
        />
      </div>

      {/* 전화번호 + 인증 */}
      <div className="mb-4">
        <label className="mb-1 block text-neutral-700">전화번호</label>
        <div className="flex gap-2">
          <input
            type="tel"
            name="phone"
            value={phone ?? ''}
            onChange={e => setPhone(e.target.value || null)}
            placeholder="phone"
            className="h-9 w-full flex-1 rounded-md border border-neutral-300 bg-neutral-100 px-3 outline-none focus:border-neutral-500 focus:bg-white"
          />
          <button type="button" className="h-9 rounded-md bg-neutral-900 px-4 font-semibold text-white">
            인증
          </button>
        </div>
      </div>

      {/* 주소 */}
      <AddressInput />

      {/* 재직증명서 (파일 선택) */}
      <div className="mb-4">
        <label className="mb-1 block text-neutral-700">재직증명서</label>
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <input
              type="file"
              name="certificateImage"
              accept=".pdf,image/*"
              onChange={handleFileChange}
              className="h-9 w-full flex-1 rounded-md border border-neutral-300 bg-neutral-100 px-2 py-1 text-sm outline-none file:mr-2 file:cursor-pointer file:rounded-md file:border-0 file:bg-neutral-900 file:px-3 file:py-1 file:text-sm file:font-semibold file:text-white focus:border-neutral-500 focus:bg-white"
            />
            <button type="button" className="h-9 rounded-md bg-neutral-900 px-4 font-semibold text-white">
              인증
            </button>
          </div>
          {certificateImage && <p className="text-xs text-neutral-500">선택된 파일: {certificateImage.name}</p>}
        </div>
      </div>

      {/* 회원가입 버튼 */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-6 h-9 w-full rounded-md bg-neutral-900 font-semibold text-white disabled:opacity-60"
      >
        {isSubmitting ? '가입 처리중...' : '회원가입'}
      </button>
    </form>
  )
}
