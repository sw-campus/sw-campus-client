import type { ReactNode } from 'react'

export default function OrganizationLayout({ children, modal }: { children: ReactNode; modal?: ReactNode }) {
  return (
    <>
      <div className="relative w-full">
        {children}
        {modal}
      </div>
    </>
  )
}
