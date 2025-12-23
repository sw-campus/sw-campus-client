'use client'

import { useState } from 'react'

import { useRouter } from 'next/navigation'

type Mode = 'personal' | 'organization'

interface Props {
  mode: Mode
}

function SectionBox({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-sm font-semibold text-gray-800">{title}</h3>
      <div className="rounded-xl border border-gray-200 bg-white p-4 text-sm text-gray-600 shadow-sm">
        <div className="max-h-52 overflow-y-auto pr-2">{children}</div>
      </div>
    </div>
  )
}

export default function SignupAgreementsView({ mode }: Props) {
  const router = useRouter()

  const [allAgree, setAllAgree] = useState(false)
  const [termsAgree, setTermsAgree] = useState(false)
  const [privacyAgree, setPrivacyAgree] = useState(false)
  const [ageAgree, setAgeAgree] = useState(false)

  const [marketingAgree, setMarketingAgree] = useState(false)
  const [smsAgree, setSmsAgree] = useState(false)
  const [emailAgree, setEmailAgree] = useState(false)

  const requiredOK = termsAgree && privacyAgree && ageAgree

  const onToggleAll = () => {
    const next = !allAgree
    setAllAgree(next)
    setTermsAgree(next)
    setPrivacyAgree(next)
    setAgeAgree(next)
    setMarketingAgree(next)
    setSmsAgree(next)
    setEmailAgree(next)
  }

  const goNext = () => {
    const nextPath = mode === 'personal' ? '/signup/personal' : '/signup/organization'
    router.push(nextPath)
  }

  return (
    <div className="flex w-full max-w-3xl flex-col gap-6 rounded-3xl bg-white/90 p-8 shadow-[0_16px_40px_rgba(0,0,0,0.45)]">
      {/* 헤더 */}
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-bold text-neutral-900">회원가입 약관 동의</h2>
        <p className="text-sm text-neutral-600">서비스 이용을 위해 필수 항목에 동의해주세요.</p>
      </div>

      {/* 전체 동의 */}
      <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4">
        <label className="flex items-start gap-3">
          <input type="checkbox" className="mt-0.5 h-4 w-4" checked={allAgree} onChange={onToggleAll} />
          <span className="text-sm font-medium text-neutral-900">
            전체 동의
            <span className="ml-2 align-middle text-xs font-normal text-neutral-600">
              (이용약관, 개인정보, 마케팅 수신, 만 14세 이상)
            </span>
          </span>
        </label>
      </div>

      {/* 이용약관 동의 (필수) */}
      <label className="flex items-start gap-3">
        <input
          type="checkbox"
          className="mt-1 h-4 w-4"
          checked={termsAgree}
          onChange={() => setTermsAgree(!termsAgree)}
        />
        <span className="text-sm font-medium text-gray-900">
          이용약관 동의
          <span className="ml-2 inline-flex items-center rounded-md border border-red-200 bg-red-50 px-2 py-0.5 text-xs font-medium text-red-600">
            필수
          </span>
        </span>
      </label>
      <SectionBox title="이용약관 요약">
        <p>
          서비스 이용에 필요한 기본 규정, 회원의 권리·의무, 서비스 제공 범위와 제한 등 핵심 내용을 요약해 제공합니다.
          약관 전문은 추후 정책 페이지와 연동될 예정입니다.
        </p>
      </SectionBox>

      {/* 개인정보 수집 및 이용 동의 (필수) */}
      <label className="flex items-start gap-3">
        <input
          type="checkbox"
          className="mt-1 h-4 w-4"
          checked={privacyAgree}
          onChange={() => setPrivacyAgree(!privacyAgree)}
        />
        <span className="text-sm font-medium text-gray-900">
          개인정보 수집 및 이용 동의
          <span className="ml-2 inline-flex items-center rounded-md border border-red-200 bg-red-50 px-2 py-0.5 text-xs font-medium text-red-600">
            필수
          </span>
        </span>
      </label>
      <SectionBox title="개인정보 처리 목적 및 항목">
        <ul className="list-disc pl-5">
          <li>회원 가입, 본인 확인, 서비스 제공 및 고객 지원</li>
          <li>계정 관리, 접근 제어, 부정 이용 방지 및 보안 강화</li>
          <li>법령 준수 및 고지·통지 수행 등 필수 처리 목적</li>
        </ul>
        <p className="mt-2 text-xs text-gray-500">자세한 전문은 내부 정책 문서로 대체 예정입니다.</p>
      </SectionBox>

      {/* 마케팅 활용 동의 (선택) */}
      <label className="flex items-start gap-3">
        <input
          type="checkbox"
          className="mt-1 h-4 w-4"
          checked={marketingAgree}
          onChange={() => setMarketingAgree(!marketingAgree)}
        />
        <span className="text-sm font-medium text-gray-900">
          마케팅 활용 동의 및 광고 수신 동의
          <span className="ml-2 inline-flex items-center rounded-md border border-neutral-200 bg-neutral-50 px-2 py-0.5 text-xs font-medium text-neutral-700">
            선택
          </span>
        </span>
      </label>
      <SectionBox title="마케팅 안내">
        <p>
          이벤트, 혜택, 신규 서비스 소식 등 맞춤 정보 제공을 위해 활용됩니다. 동의하지 않아도 서비스 이용에는 영향이
          없습니다.
        </p>
      </SectionBox>

      {/* 세부 수신 동의 (선택) */}
      <div className="flex flex-col gap-2 pl-7">
        <label className="flex items-start gap-3">
          <input
            type="checkbox"
            className="mt-1 h-4 w-4"
            checked={smsAgree}
            disabled={!marketingAgree}
            onChange={() => setSmsAgree(!smsAgree)}
          />
          <span className="text-sm text-gray-800">메시지(SMS, 카카오톡 등) 수신 동의 (선택)</span>
        </label>
        <label className="flex items-start gap-3">
          <input
            type="checkbox"
            className="mt-1 h-4 w-4"
            checked={emailAgree}
            disabled={!marketingAgree}
            onChange={() => setEmailAgree(!emailAgree)}
          />
          <span className="text-sm text-gray-800">E-Mail 수신 동의 (선택)</span>
        </label>
      </div>

      {/* 만 14세 이상 (필수) */}
      <label className="mt-3 flex items-start gap-3">
        <input type="checkbox" className="mt-1 h-4 w-4" checked={ageAgree} onChange={() => setAgeAgree(!ageAgree)} />
        <span className="text-sm font-medium text-gray-900">만 14세 이상입니다. (필수)</span>
      </label>

      {/* 액션 영역 */}
      <div className="mt-6 flex items-center justify-end gap-3">
        <button
          type="button"
          className="rounded-xl border border-gray-200 px-4 py-2 text-sm text-gray-700"
          onClick={() => router.back()}
        >
          취소
        </button>
        <button
          type="button"
          disabled={!requiredOK}
          onClick={goNext}
          className={
            'rounded-xl px-4 py-2 text-sm font-semibold ' +
            (requiredOK ? 'bg-neutral-900 text-white hover:bg-neutral-800' : 'bg-gray-200 text-gray-500')
          }
        >
          동의하고 다음으로 ({mode === 'personal' ? '개인' : '기관'})
        </button>
      </div>
    </div>
  )
}
