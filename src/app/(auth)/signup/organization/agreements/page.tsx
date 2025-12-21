import { Suspense } from "react"

import SignupAgreementsView from "@/features/auth/pages/SignupAgreementsView"

export default function SignupOrganizationAgreementsPage() {
  return (
    <div className="flex flex-col gap-4">
      <section className="relative flex min-h-[540px] w-full items-center justify-center rounded-3xl px-8 py-10">
        <div className="relative z-10 flex w-full items-center justify-center">
          <Suspense fallback={null}>
            <SignupAgreementsView mode="organization" />
          </Suspense>
        </div>
      </section>
    </div>
  )
}
