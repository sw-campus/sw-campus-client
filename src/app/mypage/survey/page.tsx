import { Suspense } from 'react'

import { SurveyPageClient } from './survey-page-client'

export default function SurveyCreatePage() {
  return (
    <Suspense fallback={null}>
      <SurveyPageClient />
    </Suspense>
  )
}
