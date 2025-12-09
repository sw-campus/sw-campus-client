'use client'

import { useEffect, useState } from 'react'

import Header from '@/components/layout/header/Header'
import Navigation from '@/components/layout/header/NavigationMenu'

export default function HeaderSection() {
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])
  if (!mounted) return null // SSR 단계에서는 아무것도 렌더하지 않음

  return (
    <>
      <Header onOpenNav={() => setOpen(true)} />
      <Navigation open={open} onClose={() => setOpen(false)} />
    </>
  )
}
