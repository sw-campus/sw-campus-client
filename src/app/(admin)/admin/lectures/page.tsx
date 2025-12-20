import { AdminSidebar, LectureApprovalPage } from '@/features/admin'

export default function AdminLecturesPage() {
  return (
    <>
      <div className="custom-container">
        <div className="custom-card flex gap-6">
          <AdminSidebar />
          <LectureApprovalPage />
        </div>
      </div>
    </>
  )
}
