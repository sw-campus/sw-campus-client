import type { ReactNode } from 'react'

export default function PersonalLayout({ children, modal }: { children: ReactNode; modal?: ReactNode }) {
  return (
    <>
      {children}
      {modal}
    </>
  )
}
