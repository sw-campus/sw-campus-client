'use client'

import AddressInput from '@/features/auth/components/AddressInput'
import EmailAuthInput from '@/features/auth/components/EmailAuthInput'
import NameInput from '@/features/auth/components/NameInput'
import NicknameInput from '@/features/auth/components/NickNameInput'
import PasswordFields from '@/features/auth/components/PasswordFields'
import PhoneAuthInput from '@/features/auth/components/PhoneAuthInput'
import { useSignupForm } from '@/features/auth/hooks/useSignupForm'

export default function SignupForm() {
  const {
    // store values
    address,
    detailAddress,
    email,
    isSendingEmail,
    isEmailVerified,
    password,
    passwordConfirm,
    isPasswordMatched,
    name,
    nickname,
    phone,

    // store setters
    setEmail,
    setPassword,
    setPasswordConfirm,
    setName,
    setNickname,
    setPhone,

    // handlers
    handleSendEmailAuth,
    handleCheckPasswordMatch,
    handleSubmit,
    resetPasswordValidation,
  } = useSignupForm()

  return (
    <form
      onSubmit={e => handleSubmit(e, { address, detailAddress })}
      className="w-full max-w-xl rounded-xl bg-white/90 p-8 shadow-[0_16px_40px_rgba(0,0,0,0.45)]"
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
      <NicknameInput value={nickname} onChange={setNickname} />

      {/* 전화번호 + 인증 */}
      <PhoneAuthInput value={phone} onChange={setPhone} onClickAuth={() => {}} />

      {/* 주소 컴포넌트 */}
      <AddressInput />

      {/* 회원가입 버튼 */}
      <button type="submit" className="mt-6 h-9 w-full rounded-md bg-neutral-900 font-semibold text-white">
        회원가입
      </button>
    </form>
  )
}
