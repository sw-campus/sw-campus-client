'use client'

import AddressInput from '@/features/auth/components/AddressInput'
import CertificateUploadSection from '@/features/auth/components/CertificateUploadSection'
import EmailAuthInput from '@/features/auth/components/EmailAuthInput'
import LabeledInput from '@/features/auth/components/LabeledInput'
import PasswordFields from '@/features/auth/components/PasswordFields'
import PhoneAuthInput from '@/features/auth/components/PhoneAuthInput'
import { useSignupOrganizationForm } from '@/features/auth/hooks/useSignupOrganizationForm'

const INPUT_BASE_CLASS =
  'h-9 rounded-md border border-neutral-300 bg-neutral-100 px-3 outline-none focus:border-neutral-500 focus:bg-white'

export default function SignupOrganizationFormView() {
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
    organizationName,
    certificateImage,
    isSubmitting,

    setEmail,
    setPassword,
    setPasswordConfirm,
    setName,
    setNickname,
    setPhone,
    setOrganizationName,

    handleSendEmailAuth,
    handleCheckPasswordMatch,
    handleFileChange,
    handleSubmit,
    resetPasswordValidation,
    handleCertificateVerifyPlaceholder,
  } = useSignupOrganizationForm()

  return (
    <form
      onSubmit={handleSubmit}
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
      <LabeledInput
        label="이름"
        type="text"
        placeholder="name"
        value={name}
        onChangeValue={setName}
        className={INPUT_BASE_CLASS}
      />

      {/* 닉네임 */}
      <LabeledInput
        label="닉네임"
        type="text"
        placeholder="nickname"
        value={nickname}
        onChangeValue={setNickname}
        className={INPUT_BASE_CLASS}
      />

      {/* 기관명 */}
      <LabeledInput
        label="기관명"
        type="text"
        name="organizationName"
        placeholder="기관명을 입력해 주세요"
        value={organizationName}
        onChangeValue={setOrganizationName}
        className={INPUT_BASE_CLASS}
      />

      {/* 전화번호 + 인증 (기존 UI를 재사용 컴포넌트로 교체) */}
      <PhoneAuthInput value={phone} onChange={setPhone} onClickAuth={() => {}} />

      {/* 주소 */}
      <AddressInput />

      {/* 재직증명서 (파일 선택) */}
      <CertificateUploadSection
        certificateImage={certificateImage}
        onChangeFile={handleFileChange}
        onClickVerify={handleCertificateVerifyPlaceholder}
      />

      {/* 회원가입 버튼 */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-6 h-9 w-full rounded-md bg-neutral-900 font-semibold text-white disabled:opacity-60"
      >
        {isSubmitting ? '가입 처리중...' : '회원가입'}
      </button>
    </form>
  )
}
