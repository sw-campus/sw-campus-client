import type { ReactNode } from 'react'

export default function OrganizationLayout({ children, modal }: { children: ReactNode; modal?: ReactNode }) {
  return (
    <>
      <div className="relative min-h-screen w-full bg-linear-to-b from-slate-950/80 via-slate-900/80 to-slate-950/90">
        {children}
        {modal}
      </div>
    </>
  )
}
