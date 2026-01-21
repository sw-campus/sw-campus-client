import React from 'react'

import { INPUT_BASE_CLASS } from '@/features/auth/input-base-class'

interface EmailAuthInputProps {
  email: string
  isEmailVerified: boolean
  isSendingEmail: boolean
  onEmailChange: (value: string) => void
  onClickAuth: () => void
}

const EmailAuthInput: React.FC<EmailAuthInputProps> = ({
  email,
  isEmailVerified,
  isSendingEmail,
  onEmailChange,
  onClickAuth,
}) => {
  return (
    <div className="mb-4">
      <label className="mb-1 block text-gray-700">이메일</label>
      <div className="flex gap-2">
        <input
          type="email"
          placeholder="이메일을 입력하세요"
          className={`${INPUT_BASE_CLASS} w-full flex-1`}
          value={email}
          onChange={e => onEmailChange(e.target.value)}
          disabled={isEmailVerified}
        />
        <button
          type="button"
          onClick={onClickAuth}
          disabled={isSendingEmail || isEmailVerified}
          className="h-10 rounded-md bg-orange-500 px-4 font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isEmailVerified ? '인증 완료' : isSendingEmail ? '전송 중...' : '인증'}
        </button>
      </div>
      {isEmailVerified ? (
        <p className="mt-1 text-xs text-success">이메일 인증이 완료되었습니다.</p>
      ) : (
        <p className="mt-1 text-xs text-gray-500">인증 메일을 보낸 후, 메일함에서 인증 버튼을 눌러 주세요.</p>
      )}
    </div>
  )
}

export default EmailAuthInput
