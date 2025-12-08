'use client'

import { CourseSection } from '@/features/course'
import { useCartStore } from '@/store/cart.store'

export default function Home() {
  const add = useCartStore(s => s.add)

  return (
    <div className="min-h-screen px-6 py-10">
      <CourseSection />
    </div>
  )
}
