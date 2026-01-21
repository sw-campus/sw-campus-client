'use client'

import AddressInput from '@/features/auth/components/address-input'
import EmailAuthInput from '@/features/auth/components/email-auth-input'
import NameInput from '@/features/auth/components/name-input'
import NicknameInput from '@/features/auth/components/nick-name-input'
import PasswordFields from '@/features/auth/components/password-fields'
import PhoneAuthInput from '@/features/auth/components/phone-auth-input'
import { useSignupForm } from '@/features/auth/hooks/use-signup-form'

export default function SignupPersonalFormView() {
  const {
    email,
    isSendingEmail,
    isEmailVerified,
    password,
    passwordConfirm,
    isPasswordMatched,
    name,
    nickname,
    phone,

    isNicknameChecking,
    nicknameCheckState,

    setEmail,
    setPassword,
    setPasswordConfirm,
    setName,
    setNickname,
    setPhone,

    handleSendEmailAuth,
    handleCheckPasswordMatch,
    handleCheckNickname,
    handleSubmit,
    resetPasswordValidation,
  } = useSignupForm()

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-xl rounded-2xl border border-gray-200 bg-white/90 p-5 text-gray-900 shadow-xl backdrop-blur-xl sm:rounded-3xl sm:p-8"
    >
      {/* 이메일 + 인증 */}
      <EmailAuthInput
        email={email}
        isEmailVerified={isEmailVerified}
        isSendingEmail={isSendingEmail}
        onEmailChange={setEmail}
        onClickAuth={handleSendEmailAuth}
      />

      {/* 비밀번호 + 비밀번호 확인 */}
      <PasswordFields
        password={password}
        passwordConfirm={passwordConfirm}
        isPasswordMatched={isPasswordMatched}
        onChangePassword={value => {
          setPassword(value)
          resetPasswordValidation()
        }}
        onChangePasswordConfirm={value => {
          setPasswordConfirm(value)
          resetPasswordValidation()
        }}
        onCheckPasswordMatch={handleCheckPasswordMatch}
      />

      {/* 이름 */}
      <NameInput value={name} onChange={setName} />

      {/* 닉네임 */}
      <NicknameInput
        value={nickname}
        onChange={setNickname}
        onClickCheck={handleCheckNickname}
        isChecking={isNicknameChecking}
        checkState={nicknameCheckState}
      />

      {/* 전화번호 + 인증 */}
      <PhoneAuthInput value={phone} onChange={setPhone} />

      {/* 주소 */}
      <AddressInput />

      {/* 회원가입 버튼 */}
      <button
        type="submit"
        className="mt-6 h-10 w-full rounded-md bg-orange-500 font-semibold text-white transition hover:bg-orange-600"
      >
        회원가입
      </button>
    </form>
  )
}
