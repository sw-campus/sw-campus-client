'use client'

import { INPUT_BASE_CLASS } from '@/features/auth/components/inputBaseClass'

type NicknameInputProps = {
  value: string
  onChange: (value: string) => void
}

export default function NicknameInput({ value, onChange }: NicknameInputProps) {
  return (
    <div className="mb-4">
      <label className="mb-1 block text-neutral-700" htmlFor="signup-nickname">
        닉네임
      </label>
      <input
        id="signup-nickname"
        type="text"
        placeholder="nickname"
        className={`${INPUT_BASE_CLASS} w-full`}
        value={value}
        onChange={e => onChange(e.target.value)}
      />
    </div>
  )
}
