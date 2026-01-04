'use client'

import { INPUT_BASE_CLASS } from '@/features/auth/inputBaseClass'

type PhoneAuthInputProps = {
  value: string | null
  onChange: (value: string | null) => void
}

export default function PhoneAuthInput({ value, onChange }: PhoneAuthInputProps) {
  return (
    <div className="mb-4">
      <label className="mb-1 block text-white/75" htmlFor="signup-phone">
        전화번호
      </label>

      <div className="flex gap-2">
        <input
          id="signup-phone"
          type="tel"
          placeholder="전화번호를 입력하세요"
          className={`${INPUT_BASE_CLASS} w-full flex-1`}
          value={value ?? ''}
          maxLength={11}
          onChange={e => {
            const val = e.target.value.replace(/[^0-9]/g, '')
            if (val.length > 11) return
            onChange(val || null)
          }}
        />
      </div>
    </div>
  )
}
