import { AdminSidebar, TestDataPage } from '@/features/admin'

export default function AdminTestDataPage() {
  return (
    <>
      <div className="custom-container">
        <div className="custom-card flex gap-6">
          <AdminSidebar />
          <TestDataPage />
        </div>
      </div>
    </>
  )
}
