import type { ReactNode } from 'react'

export default function AdminMypageLayout({ children, modal }: { children: ReactNode; modal?: ReactNode }) {
  return (
    <>
      {children}
      {modal}
    </>
  )
}
