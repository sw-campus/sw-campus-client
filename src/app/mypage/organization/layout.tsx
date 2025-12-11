import type { ReactNode } from 'react'

export default function OrganizationLayout({ children, modal }: { children: ReactNode; modal?: ReactNode }) {
  return (
    <>
      {children}
      {modal}
    </>
  )
}
