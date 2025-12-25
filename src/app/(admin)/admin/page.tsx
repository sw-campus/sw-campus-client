import { AdminSidebar } from '@/features/admin'
import { AdminDashboard } from '@/features/admin/components/dashboard/AdminDashboard'

export default function AdminPage() {
  return (
    <>
      <div className="custom-container">
        <div className="custom-card flex gap-6">
          <AdminSidebar />
          <AdminDashboard />
        </div>
      </div>
    </>
  )
}
