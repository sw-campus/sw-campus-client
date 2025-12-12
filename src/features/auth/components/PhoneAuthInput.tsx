'use client'

import { INPUT_BASE_CLASS } from '@/features/auth/components/inputBaseClass'

type PhoneAuthInputProps = {
  value: string | null
  onChange: (value: string | null) => void
  onClickAuth: () => void
}

export default function PhoneAuthInput({ value, onChange, onClickAuth }: PhoneAuthInputProps) {
  return (
    <div className="mb-4">
      <label className="mb-1 block text-neutral-700" htmlFor="signup-phone">
        전화번호
      </label>

      <div className="flex gap-2">
        <input
          id="signup-phone"
          type="tel"
          placeholder="phone"
          className={`${INPUT_BASE_CLASS} w-full flex-1`}
          value={value ?? ''}
          onChange={e => onChange(e.target.value || null)}
        />
        <button
          type="button"
          onClick={onClickAuth}
          className="h-9 rounded-md bg-neutral-900 px-4 font-semibold text-white"
        >
          인증
        </button>
      </div>
    </div>
  )
}
