import { AdminSidebar, SurveyManagementPage } from '@/features/admin'

export default function AdminSurveysPage() {
  return (
    <>
      <div className="custom-container">
        <div className="flex flex-col gap-4 md:flex-row md:gap-6">
          <AdminSidebar />
          <SurveyManagementPage />
        </div>
      </div>
    </>
  )
}
