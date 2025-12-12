'use client'

import { FormEvent, useEffect, useRef } from 'react'

import { useRouter, useSearchParams } from 'next/navigation'
import Script from 'next/script'
import { Toaster, toast } from 'sonner'

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

export default function SignupForm() {
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
    reset,
  } = useSignupStore()

  const searchParams = useSearchParams()
  const router = useRouter()
  const verifiedParam = searchParams.get('verified')
  const hasInitializedRef = useRef(false)

  const resetPasswordValidation = () => {
    setIsPasswordMatched(null)
    setIsPasswordConfirmed(false)
  }

  useEffect(() => {
    if (hasInitializedRef.current) return
    hasInitializedRef.current = true

    if (verifiedParam !== 'true') reset()
  }, [reset, verifiedParam])

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
  }, [email, isEmailVerified])

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

    if (!isEmailVerified) {
      toast.error('이메일 인증을 완료해 주세요.')
      return
    }

    if (!isPasswordConfirmed) {
      toast.error('비밀번호 확인을 완료해 주세요.')
      return
    }

    const location = address && detailAddress ? `${address} ${detailAddress}` : (address ?? detailAddress ?? null)

    const payload: SignupInput = {
      email,
      password,
      name,
      nickname,
      phone,
      location,
    }

    // Zod로 유효성 검증
    const result = signupSchema.safeParse(payload)
    if (!result.success) {
      const firstError = result.error.issues[0]
      if (firstError?.message) {
        toast.error(firstError.message)
      } else {
        toast.error('입력값을 다시 확인해 주세요.')
      }
      return
    }

    try {
      await signup(result.data)

      reset()

      toast.success('회원가입이 완료되었습니다.')
      router.push('/')
    } catch (error: any) {
      const message = error?.response?.data?.message ?? '회원가입에 실패했습니다. 잠시 후 다시 시도해 주세요.'
      toast.error(message)
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
          required
          onChange={e => setName(e.target.value)}
        />
      </div>

      {/* 닉네임 (필수) */}
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

      {/* 전화번호 + 인증 */}
      <div className="mb-4">
        <label className="mb-1 block text-neutral-700">전화번호</label>
        <div className="flex gap-2">
          <input
            type="tel"
            placeholder="phone"
            className={`${INPUT_BASE_CLASS} w-full flex-1`}
            value={phone ?? ''}
            onChange={e => setPhone(e.target.value || null)}
          />
          <button type="button" className="h-9 rounded-md bg-neutral-900 px-4 font-semibold text-white">
            인증
          </button>
        </div>
      </div>

      {/* 주소 컴포넌트 */}
      <AddressInput />

      {/* 회원가입 버튼 */}
      <button type="submit" className="mt-6 h-9 w-full rounded-md bg-neutral-900 font-semibold text-white">
        회원가입
      </button>
    </form>
  )
}
