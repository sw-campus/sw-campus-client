'use client'

import AddressInput from '@/features/auth/components/AddressInput'
import CertificateUploadSection from '@/features/auth/components/CertificateUploadSection'
import EmailAuthInput from '@/features/auth/components/EmailAuthInput'
import LabeledInput from '@/features/auth/components/LabeledInput'
import NicknameInput from '@/features/auth/components/NickNameInput'
import PasswordFields from '@/features/auth/components/PasswordFields'
import PhoneAuthInput from '@/features/auth/components/PhoneAuthInput'
import { useSignupOrganizationForm } from '@/features/auth/hooks/useSignupOrganizationForm'

const INPUT_BASE_CLASS =
  'h-10 rounded-md border border-white/15 bg-white/10 px-3 text-white placeholder:text-white/45 outline-none focus:border-white/35 focus:bg-white/15'

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

    isNicknameChecking,
    nicknameCheckState,

    setEmail,
    setPassword,
    setPasswordConfirm,
    setName,
    setNickname,
    setPhone,
    setOrganizationName,

    handleSendEmailAuth,
    handleCheckPasswordMatch,
    handleCheckNickname,
    handleFileChange,
    handleSubmit,
    resetPasswordValidation,
    handleCertificateVerifyPlaceholder,
  } = useSignupOrganizationForm()

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
        onClickAuth={() => handleSendEmailAuth('organization')}
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
      <NicknameInput
        value={nickname}
        onChange={setNickname}
        onClickCheck={handleCheckNickname}
        isChecking={isNicknameChecking}
        checkState={nicknameCheckState}
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
      <PhoneAuthInput value={phone} onChange={setPhone} />

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
        className="mt-6 h-10 w-full rounded-md bg-white/85 font-semibold text-black transition hover:bg-white disabled:opacity-60"
      >
        {isSubmitting ? '가입 처리중...' : '회원가입'}
      </button>
    </form>
  )
}
