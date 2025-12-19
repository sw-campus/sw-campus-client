import { AdminSidebar } from '@/features/admin'
import { AdminDashboard } from '@/features/admin/components/AdminDashboard'

export default function AdminReviewPage() {
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
