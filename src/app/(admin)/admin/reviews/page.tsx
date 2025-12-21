import { AdminSidebar, ReviewApprovalPage } from '@/features/admin'

export default function AdminReviewPage() {
  return (
    <>
      <div className="custom-container">
        <div className="custom-card flex gap-6">
          <AdminSidebar />
          <ReviewApprovalPage />
        </div>
      </div>
    </>
  )
}
