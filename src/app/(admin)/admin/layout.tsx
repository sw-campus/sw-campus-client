import { AdminGuard } from '@/components/guards/AdminGuard'
import HeaderSection from '@/components/layout/header/HeaderSection'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminGuard>
      <HeaderSection />
      {children}
    </AdminGuard>
  )
}
