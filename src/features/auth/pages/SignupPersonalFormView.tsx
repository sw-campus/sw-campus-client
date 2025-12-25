'use client'

import AddressInput from '@/features/auth/components/AddressInput'
import EmailAuthInput from '@/features/auth/components/EmailAuthInput'
import NameInput from '@/features/auth/components/NameInput'
import NicknameInput from '@/features/auth/components/NickNameInput'
import PasswordFields from '@/features/auth/components/PasswordFields'
import PhoneAuthInput from '@/features/auth/components/PhoneAuthInput'
import { useSignupForm } from '@/features/auth/hooks/useSignupForm'

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
      className="w-full max-w-xl rounded-3xl border border-white/15 bg-white/10 p-8 text-white shadow-xl backdrop-blur-xl"
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
        className="mt-6 h-10 w-full rounded-md bg-white/85 font-semibold text-black transition hover:bg-white"
      >
        회원가입
      </button>
    </form>
  )
}
