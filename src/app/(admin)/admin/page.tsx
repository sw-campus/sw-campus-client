import { AdminSidebar } from '@/features/admin'
import { AdminDashboard } from '@/features/admin/components/dashboard/admin-dashboard'

export default function AdminPage() {
  return (
    <>
      <div className="custom-container">
        <div className="flex flex-col gap-4 md:flex-row md:gap-6">
          <AdminSidebar />
          <AdminDashboard />
        </div>
      </div>
    </>
  )
}
