'use client'

import { useState } from 'react'

import Header from '@/components/layout/header/Header'
import Navigation from '@/components/layout/header/NavigationMenu'

export default function HeaderSection() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Header onOpenNav={() => setOpen(true)} />
      <Navigation open={open} onClose={() => setOpen(false)} />
    </>
  )
}
