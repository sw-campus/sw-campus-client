import { Suspense } from 'react'

import LoginPageView from '@/features/auth/pages/LoginPageView'

export default function LoginPage() {
  return (
    <Suspense>
      <LoginPageView />
    </Suspense>
  )
}
