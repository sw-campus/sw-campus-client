import { Suspense } from 'react'

import OAuthCallbackClient from './o-auth-callback-client'

export default function OAuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[50vh] items-center justify-center">
          <div className="text-center">
            <p className="text-lg font-medium">소셜 로그인 처리 중…</p>
            <p className="mt-2 text-sm text-gray-500">잠시만 기다려 주세요.</p>
          </div>
        </div>
      }
    >
      <OAuthCallbackClient />
    </Suspense>
  )
}
