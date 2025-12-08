'use client'

import { usePathname } from 'next/navigation'

import Footer from './Footer'

export default function FooterController() {
  const pathname = usePathname()

  const hideFooter = pathname.startsWith('/login') || pathname.startsWith('/signup') || pathname.startsWith('/find')

  if (hideFooter) return null

  return <Footer />
}
