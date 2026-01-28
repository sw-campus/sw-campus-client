import { AdminSidebar, ReviewApprovalPage } from '@/features/admin'

export default function AdminReviewPage() {
  return (
    <>
      <div className="custom-container">
        <div className="flex flex-col gap-4 md:flex-row md:gap-6">
          <AdminSidebar />
          <ReviewApprovalPage />
        </div>
      </div>
    </>
  )
}
