import React from 'react'

import { INPUT_BASE_CLASS } from '@/features/auth/inputBaseClass'

interface PasswordFieldsProps {
  // 현재 비밀번호 값
  password: string
  // 비밀번호 확인 값
  passwordConfirm: string
  // 비밀번호 일치 여부 (true / false / null)
  isPasswordMatched: boolean | null

  // 비밀번호 변경 핸들러
  onChangePassword: (value: string) => void
  // 비밀번호 확인 변경 핸들러
  onChangePasswordConfirm: (value: string) => void
  // "확인" 버튼 클릭 시 호출되는 함수
  onCheckPasswordMatch: () => void
}

/**
 * 비밀번호 + 비밀번호 확인 입력 필드 컴포넌트
 * - 실제 검증 로직(길이, 특수문자, 일치 여부 등)은 부모에서 수행
 * - 이 컴포넌트는 UI + 이벤트 전달만 담당
 */
const PasswordFields: React.FC<PasswordFieldsProps> = ({
  password,
  passwordConfirm,
  isPasswordMatched,
  onChangePassword,
  onChangePasswordConfirm,
  onCheckPasswordMatch,
}) => {
  return (
    <>
      {/* 비밀번호 */}
      <div className="mb-4">
        <label className="mb-1 block text-white/75">비밀번호</label>
        <input
          type="password"
          placeholder="비밀번호를 입력하세요"
          className={`${INPUT_BASE_CLASS} w-full`}
          value={password}
          onChange={e => onChangePassword(e.target.value)}
        />
      </div>

      {/* 비밀번호 확인 + 확인 버튼 */}
      <div className="mb-4">
        <label className="mb-1 block text-white/75">비밀번호 확인</label>
        <div className="flex gap-2">
          <input
            type="password"
            placeholder="비밀번호를 다시 입력하세요"
            className={`${INPUT_BASE_CLASS} w-full flex-1`}
            value={passwordConfirm}
            onChange={e => onChangePasswordConfirm(e.target.value)}
          />
          <button
            type="button"
            onClick={onCheckPasswordMatch}
            className="h-10 rounded-md bg-white/85 px-4 font-semibold text-black transition hover:bg-white"
          >
            확인
          </button>
        </div>

        {isPasswordMatched === true && <p className="mt-1 text-xs text-green-400">비밀번호가 일치합니다.</p>}
        {isPasswordMatched === false && <p className="mt-1 text-xs text-red-400">비밀번호가 일치하지 않습니다.</p>}
      </div>
    </>
  )
}

export default PasswordFields
