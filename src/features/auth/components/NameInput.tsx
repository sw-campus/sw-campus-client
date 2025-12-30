'use client'

import { INPUT_BASE_CLASS } from '@/features/auth/inputBaseClass'

type NameInputProps = {
  value: string
  onChange: (value: string) => void
}

export default function NameInput({ value, onChange }: NameInputProps) {
  return (
    <div className="mb-4">
      <label className="mb-1 block text-white/75" htmlFor="signup-name">
        이름
      </label>
      <input
        id="signup-name"
        type="text"
        placeholder="이름을 입력하세요"
        className={`${INPUT_BASE_CLASS} w-full`}
        value={value}
        required
        onChange={e => onChange(e.target.value)}
      />
    </div>
  )
}
