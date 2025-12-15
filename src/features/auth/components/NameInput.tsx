'use client'

import { INPUT_BASE_CLASS } from '@/features/auth/inputBaseClass'

type NameInputProps = {
  value: string
  onChange: (value: string) => void
}

export default function NameInput({ value, onChange }: NameInputProps) {
  return (
    <div className="mb-4">
      <label className="mb-1 block text-neutral-700" htmlFor="signup-name">
        이름
      </label>
      <input
        id="signup-name"
        type="text"
        placeholder="name"
        className={`${INPUT_BASE_CLASS} w-full`}
        value={value}
        required
        onChange={e => onChange(e.target.value)}
      />
    </div>
  )
}
