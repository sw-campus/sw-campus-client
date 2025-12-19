import { AdminSidebar } from '@/features/admin'
import { ReviewTable } from '@/features/review/components/ReviewTable'

export default function AdminReviewPage() {
  return (
    <>
      <div className="custom-container">
        <div className="custom-card flex gap-6">
          <AdminSidebar />
          <ReviewTable />
        </div>
      </div>
    </>
  )
}
