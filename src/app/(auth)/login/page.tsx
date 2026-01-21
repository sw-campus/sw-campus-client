import { Suspense } from 'react'

import LoginPageView from '@/features/auth/pages/login-page-view'

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginPageView />
    </Suspense>
  )
}
