import { AdminSidebar } from '@/features/admin'
import { ReviewApprovalPage } from '@/features/admin/components/review/ReviewApprovalPage'

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
