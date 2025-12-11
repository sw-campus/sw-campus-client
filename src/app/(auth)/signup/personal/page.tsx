'use client'

import { FormEvent, useEffect } from 'react'

import { useRouter, useSearchParams } from 'next/navigation'
import Script from 'next/script'
import { create } from 'zustand'

const INPUT_BASE_CLASS =
  'h-9 rounded-md border border-neutral-300 bg-neutral-100 px-3 outline-none focus:border-neutral-500 focus:bg-white'

// Zustand 스토어
type SignupState = {
  // 주소
  address: string | null
  detailAddress: string | null

  // 이메일
  email: string
  isSendingEmail: boolean
  isEmailVerified: boolean

  // 비밀번호
  password: string
  passwordConfirm: string
  isPasswordMatched: boolean | null
  isPasswordConfirmed: boolean

  // 사용자 정보
  name: string
  nickname: string
  phone: string | null

  // actions
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
  reset: () => void
}

const useSignupStore = create<SignupState>(set => ({
  // 상태 초기값
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

  // actions
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
    }),
}))

export default function SignupPersonalPage() {
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

  const resetPasswordValidation = () => {
    setIsPasswordMatched(null)
    setIsPasswordConfirmed(false)
  }

  useEffect(() => {
    const verified = searchParams.get('verified')
    if (verified !== 'true') {
      reset()
    }
  }, [reset, searchParams])

  useEffect(() => {
    const verified = searchParams.get('verified')

    if (verified === 'true') {
      ;(async () => {
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/auth/email/verified`, {
            credentials: 'include',
          })

          if (res.ok) {
            const data = await res.json()
            setEmail(data.email)
            setIsEmailVerified(true)
          } else {
            setIsEmailVerified(false)
          }
        } catch (e) {
          console.error('인증된 이메일 조회 실패', e)
        } finally {
          router.replace('/signup/personal')
        }
      })()
    }
  }, [searchParams, router, setIsEmailVerified, setEmail])

  useEffect(() => {
    if (!email || isEmailVerified) return

    const intervalId = setInterval(async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/auth/email/status?email=${encodeURIComponent(email)}`,
        )

        if (!res.ok) return

        const data = await res.json()

        if (data && data.verified) {
          setIsEmailVerified(true)
          clearInterval(intervalId)
        }
      } catch (error) {}
    }, 1000)

    return () => clearInterval(intervalId)
  }, [email, isEmailVerified, setIsEmailVerified])

  // 비밀번호 일치 확인
  const handleCheckPasswordMatch = () => {
    const MIN_LENGTH = 8
    const SPECIAL_CHAR_REGEX = /[!@#$%^&*(),.?":{}|<>]/

    if (!password || !passwordConfirm) {
      alert('비밀번호와 비밀번호 확인을 모두 입력해 주세요.')
      resetPasswordValidation()
      return
    }

    if (password.length < MIN_LENGTH) {
      alert(`비밀번호는 ${MIN_LENGTH}자 이상이어야 합니다`)
      resetPasswordValidation()
      return
    }

    if (!SPECIAL_CHAR_REGEX.test(password)) {
      alert('비밀번호에 특수문자가 1개 이상 포함되어야 합니다')
      resetPasswordValidation()
      return
    }

    if (password === passwordConfirm) {
      setIsPasswordMatched(true)
      setIsPasswordConfirmed(true)
    } else {
      setIsPasswordMatched(false)
      setIsPasswordConfirmed(false)
      alert('비밀번호와 비밀번호 확인이 일치하지 않습니다')
    }
  }

  // 이메일 인증 메일 보내기
  const handleSendEmailAuth = async () => {
    if (isEmailVerified) return

    try {
      setIsSendingEmail(true)

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/auth/email/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      if (!response.ok) {
        let message = '인증 메일 발송에 실패했습니다. 잠시 후 다시 시도해 주세요.'

        try {
          const data = await response.json()
          if (data && typeof data.message === 'string') {
            message = data.message
          }
        } catch (error) {}

        alert(message)
        return
      }

      alert('인증 메일을 발송했습니다. 메일함을 확인해 주세요.')
      setIsEmailVerified(false)
    } catch (error) {
      alert('네트워크 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.')
    } finally {
      setIsSendingEmail(false)
    }
  }

  // 주소 찾기
  const handleSearchAddress = () => {
    if (typeof window === 'undefined') return

    const { daum } = window as any
    if (!daum || !daum.Postcode) {
      alert('주소 검색 스크립트가 아직 로드되지 않았어요. 잠시 후 다시 시도해 주세요.')
      return
    }

    new daum.Postcode({
      oncomplete: (data: any) => {
        const fullAddress = data.roadAddress || data.jibunAddress
        setAddress(fullAddress)
      },
    }).open()
  }

  // 회원가입
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!name.trim()) {
      alert('이름은 필수 입력값입니다.')
      return
    }

    if (!nickname || !nickname.trim()) {
      alert('닉네임은 필수 입력값입니다.')
      return
    }

    if (!isEmailVerified) {
      alert('이메일 인증을 완료해 주세요.')
      return
    }

    if (!isPasswordConfirmed) {
      alert('비밀번호 확인을 완료해 주세요.')
      return
    }

    const location = address && detailAddress ? `${address} ${detailAddress}` : (address ?? detailAddress ?? null)

    const payload = {
      email,
      password,
      name,
      nickname,
      phone,
      location,
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        let message = '회원가입에 실패했습니다. 잠시 후 다시 시도해 주세요.'

        try {
          const data = await response.json()
          if (data && typeof data.message === 'string') {
            message = data.message
          }
        } catch (error) {}

        alert(message)
        return
      }

      reset()

      alert('회원가입이 완료되었습니다.')
      router.push('/')
    } catch (error) {
      alert('네트워크 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.')
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <Script src="https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js" strategy="lazyOnload" />
      {/* 전체 영역 */}
      <section className="relative flex min-h-[540px] w-full items-center justify-center rounded-3xl px-8 py-10">
        {/* 가운데 회원가입 카드 */}
        <div className="relative z-10 flex w-full items-center justify-center">
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-xl rounded-xl bg-white/90 p-8 shadow-[0_16px_40px_rgba(0,0,0,0.45)]"
          >
            {/* 이메일 + 인증 */}
            <div className="mb-4">
              <label className="mb-1 block text-neutral-700">이메일</label>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="email"
                  className={`${INPUT_BASE_CLASS} w-full flex-1`}
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
                <button
                  type="button"
                  onClick={handleSendEmailAuth}
                  disabled={isSendingEmail || isEmailVerified}
                  className="h-9 rounded-md bg-neutral-900 px-4 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isEmailVerified ? '인증 완료' : isSendingEmail ? '전송 중...' : '인증'}
                </button>
              </div>
              {isEmailVerified ? (
                <p className="mt-1 text-xs text-green-600">이메일 인증이 완료되었습니다.</p>
              ) : (
                <p className="mt-1 text-xs text-neutral-500">
                  인증 메일을 보낸 후, 메일함에서 인증 버튼을 눌러 주세요.
                </p>
              )}
            </div>

            {/* 비밀번호 */}
            <div className="mb-4">
              <label className="mb-1 block text-neutral-700">비밀번호</label>
              <input
                type="password"
                placeholder="password"
                className={`${INPUT_BASE_CLASS} w-full`}
                value={password}
                onChange={e => {
                  setPassword(e.target.value)
                  resetPasswordValidation()
                }}
              />
            </div>

            {/* 비밀번호 확인 + 확인 버튼 */}
            <div className="mb-4">
              <label className="mb-1 block text-neutral-700">비밀번호 확인</label>
              <div className="flex gap-2">
                <input
                  type="password"
                  placeholder="password"
                  className={`${INPUT_BASE_CLASS} w-full flex-1`}
                  value={passwordConfirm}
                  onChange={e => {
                    setPasswordConfirm(e.target.value)
                    resetPasswordValidation()
                  }}
                />
                <button
                  type="button"
                  onClick={handleCheckPasswordMatch}
                  className="h-9 rounded-md bg-neutral-900 px-4 font-semibold text-white"
                >
                  확인
                </button>
              </div>
              {isPasswordMatched === true && <p className="mt-1 text-xs text-green-600">비밀번호가 일치합니다.</p>}
              {isPasswordMatched === false && (
                <p className="mt-1 text-xs text-red-600">비밀번호가 일치하지 않습니다.</p>
              )}
            </div>

            {/* 이름 */}
            <div className="mb-4">
              <label className="mb-1 block text-neutral-700">이름</label>
              <input
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
                required
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

            {/* 주소 + 검색 + 상세주소 */}
            <div className="mb-3">
              <label className="mb-1 block text-neutral-700">주소</label>
              <div className="mb-2 flex gap-2">
                <input
                  type="text"
                  placeholder="address"
                  className={`${INPUT_BASE_CLASS} w-full flex-1`}
                  value={address ?? ''}
                  readOnly
                />
                <button
                  type="button"
                  onClick={handleSearchAddress}
                  className="h-9 rounded-md bg-neutral-900 px-4 font-semibold text-white"
                >
                  검색
                </button>
              </div>
              <input
                type="text"
                placeholder="상세 주소"
                className={`${INPUT_BASE_CLASS} w-full`}
                value={detailAddress ?? ''}
                onChange={e => setDetailAddress(e.target.value)}
              />
            </div>

            {/* 회원가입 버튼 */}
            <button type="submit" className="mt-6 h-9 w-full rounded-md bg-neutral-900 font-semibold text-white">
              회원가입
            </button>
          </form>
        </div>
      </section>
    </div>
  )
}
