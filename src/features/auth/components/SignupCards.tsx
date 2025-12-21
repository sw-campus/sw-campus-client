'use client'

import { useRouter } from 'next/navigation'
import SignupCard from './SignupCard'
import SocialIcons from './SocialIcons'

export default function SignupCards() {
  const router = useRouter()

  return (
    <div className="flex w-full max-w-5xl gap-8">
      <SignupCard
        title="개인회원 가입"
        imageSrc="/images/signup/signup_person.png"
        imageAlt="개인회원 가입 이미지"
        onClick={() => router.push('/signup/personal/agreements')}
      >
        <SocialIcons />
      </SignupCard>

      <SignupCard
        title="기업회원 가입"
        imageSrc="/images/signup/signup_org.png"
        imageAlt="기업회원 가입 이미지"
        onClick={() => router.push('/signup/organization/agreements')}
      >
        <p className="mt-4 text-neutral-600">• 부트캠프를 홍보하려는 사업체 직원</p>
      </SignupCard>
    </div>
  )
}
