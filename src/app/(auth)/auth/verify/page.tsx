import { Suspense } from 'react'

import VerifyClient from '@/app/(auth)/auth/verify/VerifyClient'

export default function VerifyPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <p>이메일 인증 확인 중입니다...</p>
        </div>
      }
    >
      <VerifyClient />
    </Suspense>
  )
}
