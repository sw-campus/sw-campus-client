'use client'

import { ChangeEvent, FormEvent, useState } from 'react'

import { useRouter } from 'next/navigation'

import { signupOrganization } from '@/features/auth/authApi'

type OrganizationFormState = {
  email: string
  password: string
  confirmPassword: string
  name: string
  nickname: string
  phone: string
  location: string
  organizationName: string
  employmentCertificate: File | null
}

export default function SignupOrganizationPage() {
  const router = useRouter()

  const [form, setForm] = useState<OrganizationFormState>({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    nickname: '',
    phone: '',
    location: '',
    organizationName: '',
    employmentCertificate: null,
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  // 인풋 변경 핸들러 (공통)
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setForm(prev => ({
      ...prev,
      employmentCertificate: file,
      // 파일 이름을 organizationName 필드에 저장해서 백엔드로 전송할 수 있게 함
      organizationName: file.name,
    }))
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // 비밀번호 확인 체크
    if (form.password !== form.confirmPassword) {
      alert('비밀번호와 비밀번호 확인이 일치하지 않습니다.')
      return
    }

    try {
      setIsSubmitting(true)

      // 기관 회원가입 API 호출
      await signupOrganization({
        email: form.email,
        password: form.password,
        name: form.name,
        nickname: form.nickname,
        phone: form.phone,
        location: form.location,
        organizationName: form.organizationName,
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
    <div className="flex flex-col gap-4">
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
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="h-9 w-full flex-1 rounded-md border border-neutral-300 bg-neutral-100 px-3 outline-none focus:border-neutral-500 focus:bg-white"
                />
                <button type="button" className="h-9 rounded-md bg-neutral-900 px-4 font-semibold text-white">
                  인증
                </button>
              </div>
            </div>

            {/* 비밀번호 */}
            <div className="mb-4">
              <label className="mb-1 block text-neutral-700">비밀번호</label>
              <input
                type="password"
                placeholder="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                className="h-9 w-full rounded-md border border-neutral-300 bg-neutral-100 px-3 outline-none focus:border-neutral-500 focus:bg-white"
              />
            </div>

            {/* 비밀번호 확인 + 확인 버튼 */}
            <div className="mb-4">
              <label className="mb-1 block text-neutral-700">비밀번호 확인</label>
              <div className="flex gap-2">
                <input
                  type="password"
                  placeholder="password"
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  className="h-9 w-full flex-1 rounded-md border border-neutral-300 bg-neutral-100 px-3 outline-none focus:border-neutral-500 focus:bg-white"
                />
                <button type="button" className="h-9 rounded-md bg-neutral-900 px-4 font-semibold text-white">
                  확인
                </button>
              </div>
            </div>

            {/* 이름 */}
            <div className="mb-4">
              <label className="mb-1 block text-neutral-700">이름</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="이름을 입력해 주세요"
                className="h-9 w-full rounded-md border border-neutral-300 bg-neutral-100 px-3 outline-none focus:border-neutral-500 focus:bg-white"
              />
            </div>

            {/* 닉네임 */}
            <div className="mb-4">
              <label className="mb-1 block text-neutral-700">닉네임</label>
              <input
                type="text"
                name="nickname"
                value={form.nickname}
                onChange={handleChange}
                placeholder="닉네임을 입력해 주세요"
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
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="phone"
                  className="h-9 w-full flex-1 rounded-md border border-neutral-300 bg-neutral-100 px-3 outline-none focus:border-neutral-500 focus:bg-white"
                />
                <button type="button" className="h-9 rounded-md bg-neutral-900 px-4 font-semibold text-white">
                  인증
                </button>
              </div>
            </div>

            {/* 주소 */}
            <div className="mb-4">
              <label className="mb-1 block text-neutral-700">주소</label>
              <input
                type="text"
                name="location"
                value={form.location}
                onChange={handleChange}
                placeholder="주소를 입력해 주세요"
                className="h-9 w-full rounded-md border border-neutral-300 bg-neutral-100 px-3 outline-none focus:border-neutral-500 focus:bg-white"
              />
            </div>

            {/* 재직증명서 (파일 선택) */}
            <div className="mb-4">
              <label className="mb-1 block text-neutral-700">재직증명서</label>
              <div className="flex flex-col gap-2">
                <div className="flex gap-2">
                  <input
                    type="file"
                    name="employmentCertificate"
                    accept=".pdf,image/*"
                    onChange={handleFileChange}
                    className="h-9 w-full flex-1 rounded-md border border-neutral-300 bg-neutral-100 px-2 py-1 text-sm outline-none file:mr-2 file:cursor-pointer file:rounded-md file:border-0 file:bg-neutral-900 file:px-3 file:py-1 file:text-sm file:font-semibold file:text-white focus:border-neutral-500 focus:bg-white"
                  />
                  <button type="button" className="h-9 rounded-md bg-neutral-900 px-4 font-semibold text-white">
                    인증
                  </button>
                </div>
                {form.organizationName && (
                  <p className="text-xs text-neutral-500">선택된 파일: {form.organizationName}</p>
                )}
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
        </div>
      </section>
    </div>
  )
}
