import { AdminSidebar, TestDataPage } from '@/features/admin'

export default function AdminTestDataPage() {
  return (
    <>
      <div className="custom-container">
        <div className="custom-card flex flex-col gap-4 lg:flex-row lg:gap-6">
          <AdminSidebar />
          <TestDataPage />
        </div>
      </div>
    </>
  )
}
