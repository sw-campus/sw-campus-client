'use client'

type EmailVerificationFieldProps = {
  email: string
  isEmailVerified: boolean
  isSendingEmail: boolean
  // 이메일 값 변경 (Zustand의 setEmail 그대로 넘겨서 사용)
  setEmail: (value: string) => void
  // 이메일 인증 메일 전송 핸들러
  handleSendEmailAuth: () => void
}

// 입력 공통 스타일 (page.tsx와 동일하게 맞춰줌)
const INPUT_BASE_CLASS =
  'h-9 rounded-md border border-neutral-300 bg-neutral-100 px-3 outline-none focus:border-neutral-500 focus:bg-white'

// 이메일 입력 + 인증 버튼 공통 컴포넌트
export function EmailVerificationField({
  email,
  isEmailVerified,
  isSendingEmail,
  setEmail,
  handleSendEmailAuth,
}: EmailVerificationFieldProps) {
  return (
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
        <p className="mt-1 text-xs text-neutral-500">인증 메일을 보낸 후, 메일함에서 인증 버튼을 눌러 주세요.</p>
      )}
    </div>
  )
}
