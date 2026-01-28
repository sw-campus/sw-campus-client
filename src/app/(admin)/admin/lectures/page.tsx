import { AdminSidebar, LectureApprovalPage } from '@/features/admin'

export default function AdminLecturesPage() {
  return (
    <>
      <div className="custom-container">
        <div className="flex flex-col gap-4 md:flex-row md:gap-6">
          <AdminSidebar />
          <LectureApprovalPage />
        </div>
      </div>
    </>
  )
}
