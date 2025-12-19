'use client'

import { use, useEffect, useRef } from 'react'

import { useRouter, useSearchParams } from 'next/navigation'

import { api } from '@/lib/axios'

type Provider = 'google' | 'github'
const isProvider = (v: string | null): v is Provider => v === 'google' || v === 'github'

export default function OAuthCallbackPage({ params }: { params: Promise<{ provider: string }> }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { provider } = use(params)
  const search = searchParams.toString()
  const didRunRef = useRef(false)

  useEffect(() => {
    if (didRunRef.current) return
    didRunRef.current = true

    const sp = new URLSearchParams(search)
    const code = sp.get('code')
    const state = sp.get('state')
    const error = sp.get('error')

    if (!isProvider(provider)) return router.replace('/login?oauth=invalid_provider')
    if (error) return router.replace(`/login?oauth=error&provider=${provider}`)
    if (!code) return router.replace(`/login?oauth=missing_code&provider=${provider}`)
    ;(async () => {
      try {
        await api.post(`/auth/oauth/${provider}`, { code })
        router.replace('/')
      } catch (e) {
        router.replace(`/login?oauth=failed&provider=${provider}`)
      }
    })()
  }, [provider, router, search])

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="bg-card text-card-foreground rounded-lg border px-6 py-5">소셜 로그인 처리 중...</div>
    </div>
  )
}
