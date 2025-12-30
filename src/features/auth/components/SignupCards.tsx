'use client'

import { useRouter } from 'next/navigation'

import { useOAuthUrls } from '@/features/auth/hooks/useOAuthUrls'

import SignupCard from './SignupCard'
import SocialIcons from './SocialIcons'

export default function SignupCards() {
  const router = useRouter()
  const { handleOAuthStart } = useOAuthUrls()

  return (
    <div className="flex w-full flex-col gap-4 md:flex-row">
      <SignupCard
        title="개인회원 가입"
        imageSrc="/images/signup/signup_person.png"
        imageAlt="개인회원 가입 이미지"
        onClick={() => router.push('/signup/personal/agreements')}
      >
        <SocialIcons onGoogle={() => handleOAuthStart('google')} onGithub={() => handleOAuthStart('github')} />
      </SignupCard>

      <SignupCard
        title="기업회원 가입"
        imageSrc="/images/signup/signup_org.png"
        imageAlt="기업회원 가입 이미지"
        onClick={() => router.push('/signup/organization/agreements')}
      >
        <p className="text-sm text-white/65">• 부트캠프를 홍보하려는 사업체 직원</p>
      </SignupCard>
    </div>
  )
}
