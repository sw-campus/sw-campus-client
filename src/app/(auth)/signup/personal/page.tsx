'use client'

import { FormEvent, useState } from 'react'

import Script from 'next/script'

export default function SignupPersonalPage() {
  // 주소
  const [address, setAddress] = useState('')
  const [detailAddress, setDetailAddress] = useState('')

  // 이메일
  const [email, setEmail] = useState('')
  const [isSendingEmail, setIsSendingEmail] = useState(false)

  // 비밀번호
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [isPasswordMatched, setIsPasswordMatched] = useState<boolean | null>(null)

  const handleCheckPasswordMatch = () => {
    if (!password || !passwordConfirm) {
      alert('비밀번호와 비밀번호 확인을 모두 입력해 주세요.')
      setIsPasswordMatched(null)
      return
    }

    if (password === passwordConfirm) {
      setIsPasswordMatched(true)
    } else {
      setIsPasswordMatched(false)
    }
  }

  const handleSendEmailAuth = async () => {
    if (!email) {
      alert('이메일을 입력해 주세요.')
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
    } catch (error) {
      alert('네트워크 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.')
    } finally {
      setIsSendingEmail(false)
    }
  }

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

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
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
                  disabled={isSendingEmail}
                  className="h-9 rounded-md bg-neutral-900 px-4 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isSendingEmail ? '전송 중...' : '인증'}
                </button>
              </div>
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
              />
            </div>

            {/* 닉네임 */}
            <div className="mb-4">
              <label className="mb-1 block text-neutral-700">닉네임</label>
              <input
                type="text"
                placeholder="nickname"
                className="h-9 w-full rounded-md border border-neutral-300 bg-neutral-100 px-3 outline-none focus:border-neutral-500 focus:bg-white"
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
                  value={address}
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
                value={detailAddress}
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
