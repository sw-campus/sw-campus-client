import { AdminGuard } from '@/components/guards/admin-guard'
import HeaderSection from '@/components/layout/header/header-section'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminGuard>
      <HeaderSection />
      {children}
    </AdminGuard>
  )
}
