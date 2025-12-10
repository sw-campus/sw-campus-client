'use client'

import { FormEvent, useEffect } from 'react'

import { useRouter, useSearchParams } from 'next/navigation'
import Script from 'next/script'
import { create } from 'zustand'

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

  // ✅ 페이지 진입/새로고침 시 이메일/인증 관련 상태 초기화 + localStorage 에 저장된 이메일 복원
  useEffect(() => {
    setIsEmailVerified(false)
    setIsPasswordMatched(null)
    setIsPasswordConfirmed(false)

    if (typeof window !== 'undefined') {
      const savedEmail = window.localStorage.getItem('signupEmail')
      if (savedEmail) {
        setEmail(savedEmail)
      }
    }
  }, [setIsEmailVerified, setIsPasswordMatched, setIsPasswordConfirmed, setEmail])

  useEffect(() => {
    const verified = searchParams.get('verified')
    const verifiedEmail = searchParams.get('email')

    // ✅ 이메일 쿼리가 함께 온 경우, 바로 input 에 세팅
    if (verifiedEmail) {
      setEmail(verifiedEmail)
    }

    // ✅ verified=true 로 들어왔으면
    // → 인증 완료 상태로 표시하고
    // → 같은 페이지지만 쿼리 제거해서 깔끔한 URL로 다시 replace
    if (verified === 'true') {
      setIsEmailVerified(true)
      router.replace('/signup/personal')
    }
  }, [searchParams, router, setIsEmailVerified, setEmail])

  // ✅ 이메일 인증 상태 polling
  // 이메일이 입력되어 있고 아직 인증이 안 된 경우, 일정 간격으로 status API를 호출해서
  // 백엔드에서 verified=true 로 바뀌면 자동으로 UI를 갱신한다.
  useEffect(() => {
    if (!email || isEmailVerified) return

    const intervalId = setInterval(async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/auth/email/status?email=${encodeURIComponent(email)}`,
        )

        if (!res.ok) {
          // 상태 조회 실패 시에는 조용히 무시 (사용자에게 계속 에러를 띄우지 않기 위함)
          return
        }

        const data = await res.json()

        // 백엔드에서 인증 여부를 나타내는 필드명이 verified 라고 가정
        if (data && data.verified) {
          setIsEmailVerified(true)
          clearInterval(intervalId)
        }
      } catch (error) {
        // 네트워크 오류도 조용히 무시하고 다음 interval 에 다시 시도
      }
    }, 3000) // 3초마다 한 번씩 상태 확인

    return () => clearInterval(intervalId)
  }, [email, isEmailVerified, setIsEmailVerified])

  // 비밀번호 일치 확인
  const handleCheckPasswordMatch = () => {
    const MIN_LENGTH = 8
    const SPECIAL_CHAR_REGEX = /[!@#$%^&*(),.?":{}|<>]/

    // 1) 비밀번호 / 비밀번호 확인 공백 체크
    if (!password || !passwordConfirm) {
      alert('비밀번호와 비밀번호 확인을 모두 입력해 주세요.')
      setIsPasswordMatched(null)
      setIsPasswordConfirmed(false)
      return
    }

    // 2) 길이 체크 (백엔드 PasswordValidator 와 동일)
    if (password.length < MIN_LENGTH) {
      alert(`비밀번호는 ${MIN_LENGTH}자 이상이어야 합니다`)
      setIsPasswordMatched(null)
      setIsPasswordConfirmed(false)
      return
    }

    // 3) 특수문자 포함 여부 체크 (백엔드 SPECIAL_CHAR_PATTERN 과 동일)
    if (!SPECIAL_CHAR_REGEX.test(password)) {
      alert('비밀번호에 특수문자가 1개 이상 포함되어야 합니다')
      setIsPasswordMatched(null)
      setIsPasswordConfirmed(false)
      return
    }

    // 4) 위 조건을 모두 통과한 후, 두 비밀번호가 같은지 확인
    if (password === passwordConfirm) {
      setIsPasswordMatched(true)
      setIsPasswordConfirmed(true) // ✅ 비밀번호가 같으면 “저장” (확인 완료 상태)
    } else {
      setIsPasswordMatched(false)
      setIsPasswordConfirmed(false)
      alert('비밀번호와 비밀번호 확인이 일치하지 않습니다')
    }
  }

  // 이메일 인증 메일 보내기
  const handleSendEmailAuth = async () => {
    // 이미 이메일 인증이 완료된 경우, 더 이상 동작하지 않도록 막기
    if (isEmailVerified) {
      return
    }

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
        } catch (error) {
          // ignore JSON parse error and use default message
        }

        alert(message)
        return
      }

      alert('인증 메일을 발송했습니다. 메일함을 확인해 주세요.')
      // 새로 발송했으므로, 다시 인증 대기 상태로 초기화
      setIsEmailVerified(false)

      // ✅ 새 탭에서도 같은 이메일을 사용할 수 있도록 localStorage에 저장
      if (typeof window !== 'undefined') {
        window.localStorage.setItem('signupEmail', email)
      }
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
    // 어떤 경우에도 브라우저 기본 submit(새로고침) 먼저 차단
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

    // address + detailAddress → API 스펙의 location 으로 변환
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
        } catch (error) {
          // JSON 파싱 실패 시 기본 메시지 사용
        }

        alert(message)
        return
      }

      // ✅ 회원가입 성공 시: signup 상태 및 localStorage 초기화
      reset()
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem('signupEmail')
      }

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
                  className="h-9 w-full flex-1 rounded-md border border-neutral-300 bg-neutral-100 px-3 outline-none focus:border-neutral-500 focus:bg-white"
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
                className="h-9 w-full rounded-md border border-neutral-300 bg-neutral-100 px-3 outline-none focus:border-neutral-500 focus:bg-white"
                value={password}
                onChange={e => {
                  setPassword(e.target.value)
                  setIsPasswordMatched(null)
                  setIsPasswordConfirmed(false)
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
                  className="h-9 w-full flex-1 rounded-md border border-neutral-300 bg-neutral-100 px-3 outline-none focus:border-neutral-500 focus:bg-white"
                  value={passwordConfirm}
                  onChange={e => {
                    setPasswordConfirm(e.target.value)
                    setIsPasswordMatched(null)
                    setIsPasswordConfirmed(false)
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
                className="h-9 w-full rounded-md border border-neutral-300 bg-neutral-100 px-3 outline-none focus:border-neutral-500 focus:bg-white"
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
                className="h-9 w-full rounded-md border border-neutral-300 bg-neutral-100 px-3 outline-none focus:border-neutral-500 focus:bg-white"
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
                  className="h-9 w-full flex-1 rounded-md border border-neutral-300 bg-neutral-100 px-3 outline-none focus:border-neutral-500 focus:bg-white"
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
                  className="h-9 w-full flex-1 rounded-md border border-neutral-300 bg-neutral-100 px-3 outline-none focus:border-neutral-500 focus:bg-white"
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
                className="h-9 w-full rounded-md border border-neutral-300 bg-neutral-100 px-3 outline-none focus:border-neutral-500 focus:bg-white"
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
