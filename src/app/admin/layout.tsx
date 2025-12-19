import Footer from '@/components/layout/Footer'
import HeaderSection from '@/components/layout/header/HeaderSection'
import { AdminSidebar } from '@/features/admin'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <HeaderSection />
      <div className="custom-container">
        <div className="custom-card flex gap-6">
          <AdminSidebar />
          <main className="flex-1">{children}</main>
        </div>
      </div>
      <Footer />
    </>
  )
}
