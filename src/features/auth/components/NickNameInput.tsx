'use client'

import { INPUT_BASE_CLASS } from '@/features/auth/inputBaseClass'

type NicknameInputProps = {
  value: string
  onChange: (value: string) => void

  onClickCheck: () => void
  isChecking: boolean
  checkState: 'idle' | 'available' | 'unavailable' | 'error'
  disabled?: boolean
}

export default function NicknameInput({
  value,
  onChange,
  onClickCheck,
  isChecking,
  checkState,
  disabled,
}: NicknameInputProps) {
  return (
    <div className="mb-4">
      <label className="mb-1 block text-neutral-700" htmlFor="signup-nickname">
        닉네임
      </label>
      <div className="flex gap-2">
        <input
          id="signup-nickname"
          type="text"
          placeholder="nickname"
          className={`${INPUT_BASE_CLASS} w-full flex-1`}
          value={value}
          disabled={disabled}
          onChange={e => onChange(e.target.value)}
        />
        <button
          type="button"
          onClick={onClickCheck}
          disabled={disabled || isChecking}
          className="h-9 rounded-md bg-neutral-900 px-4 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isChecking ? '확인 중...' : '검증'}
        </button>
      </div>

      {checkState === 'available' && <p className="mt-1 text-xs text-green-600">사용 가능한 닉네임입니다.</p>}
      {checkState === 'unavailable' && <p className="mt-1 text-xs text-red-600">이미 사용 중인 닉네임입니다.</p>}
      {checkState === 'error' && <p className="mt-1 text-xs text-red-600">닉네임 확인에 실패했습니다. 다시 시도해 주세요.</p>}
    </div>
  )
}
