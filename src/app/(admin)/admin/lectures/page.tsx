import { AdminSidebar, LectureApprovalPage } from '@/features/admin'

export default function AdminLecturesPage() {
  return (
    <>
      <div className="custom-container">
        <div className="custom-card flex flex-col gap-4 lg:flex-row lg:gap-6">
          <AdminSidebar />
          <LectureApprovalPage />
        </div>
      </div>
    </>
  )
}
