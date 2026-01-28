import { Suspense } from 'react'

import OAuthCallbackClient from './o-auth-callback-client'

interface OAuthCallbackPageProps {
  params: Promise<{ provider: string }>
}

export default async function OAuthCallbackPage({ params }: OAuthCallbackPageProps) {
  const { provider } = await params

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
      <OAuthCallbackClient provider={provider} />
    </Suspense>
  )
}
